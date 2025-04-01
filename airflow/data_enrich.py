import os
import json
import time
import logging
import pandas as pd
from dotenv import load_dotenv
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
from upload_pg import upload_csv_to_postgres

# Load Environment 
load_dotenv()
sp = Spotify(auth_manager=SpotifyClientCredentials(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
))

# Logging Setup
log_name = "data_enrich"
log_path = os.path.join(os.getcwd(), f"airflow/logs/{log_name}.log")
os.makedirs(os.path.dirname(log_path), exist_ok=True)

logger = logging.getLogger(log_name)
logger.setLevel(logging.INFO)
formatter = logging.Formatter('[%(asctime)s] %(levelname)s: %(message)s')
file_handler = logging.FileHandler(log_path)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Progress Tracking
progress_file = "airflow/progress.json"
if os.path.exists(progress_file):
    with open(progress_file, "r") as f:
        progress = json.load(f)
        batch_number = progress.get("batch_number", 0)
else:
    batch_number = 0

# Load and Slice Dataset
df = pd.read_csv("airflow/data/dataset.csv")
batch_size = 10000
start = batch_number * batch_size
end = start + batch_size
df_batch = df.iloc[start:end]

# Prepare Output Stores
albums, artists, songs = {}, {}, []
output_dir = "airflow/data"
os.makedirs(output_dir, exist_ok=True)

# Process Tracks ──
for index, row in df_batch.iterrows():
    track_id = row["track_id"]
    attempt = 1
    max_attempts = 5
    backoff = 2

    while attempt <= max_attempts:
        try:
            logger.info(f"[Batch {batch_number}] Processing {index+1}/{len(df_batch)}: track_id={track_id} (Attempt {attempt})")
            track = sp.track(track_id)

            # Album
            album = track["album"]
            album_id = album["id"]
            if album_id not in albums:
                albums[album_id] = {
                    "id": album_id,
                    "name": album["name"],
                    "release_date": album["release_date"],
                    "image_url": album["images"][0]["url"] if album["images"] else None,
                    "type": album["album_type"]
                }

            # Artists
            for artist in track["artists"]:
                artist_id = artist["id"]
                if artist_id not in artists:
                    try:
                        artist_data = sp.artist(artist_id)
                        artists[artist_id] = {
                            "id": artist_id,
                            "name": artist_data["name"],
                            "followers": artist_data["followers"]["total"],
                            "image_url": artist_data["images"][0]["url"] if artist_data["images"] else None
                        }
                    except Exception as e:
                        logger.error(f"Error fetching artist {artist_id}: {e}")
                        continue

                # Song entry
                song_row = row[["track_id","track_name","popularity","duration_ms","explicit","danceability",
                                "energy","key","loudness","mode","speechiness","acousticness","instrumentalness",
                                "liveness","valence","tempo","time_signature","track_genre"]].to_dict()
                song_row.update({
                    "album_id": album_id,
                    "artist_id": artist_id,
                    "track_image_url": album["images"][0]["url"] if album["images"] else None
                })
                songs.append(song_row)

            break  # Break out of retry loop on success

        except Exception as e:
            logger.error(f"Error fetching track {track_id} on attempt {attempt}: {e}")
            attempt += 1
            time.sleep(backoff)
            backoff *= 2

# Save CSVs
pd.DataFrame(albums.values()).to_csv(os.path.join(output_dir, "albums.csv"), index=False)
pd.DataFrame(artists.values()).to_csv(os.path.join(output_dir, "artists.csv"), index=False)
pd.DataFrame(songs).to_csv(os.path.join(output_dir, "songs.csv"), index=False)

upload_csv_to_postgres("airflow/data/albums.csv", "albums", logger)
upload_csv_to_postgres("airflow/data/artists.csv", "artists", logger)
upload_csv_to_postgres("airflow/data/songs.csv", "songs", logger)

# Update Progress
batch_number += 1
with open(progress_file, "w") as f:
    json.dump({"batch_number": batch_number}, f)

logger.info(f"[Batch {batch_number}] Completed {len(songs)} songs, {len(artists)} artists, {len(albums)} albums")