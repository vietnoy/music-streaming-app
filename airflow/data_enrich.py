import os
import json
import time
import logging
import pandas as pd
from dotenv import load_dotenv
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
from upload_pg import upload_csv_to_postgres
from logging.handlers import RotatingFileHandler

# ---------------------- CONFIG ----------------------

AIRFLOW_HOME = "/opt/airflow"
DATA_DIR = os.path.join(AIRFLOW_HOME, "data")
LOG_DIR = os.path.join(AIRFLOW_HOME, "logs")
PROGRESS_FILE = os.path.join(AIRFLOW_HOME, "progress.json")
DATASET_PATH = os.path.join(DATA_DIR, "dataset.csv")

# ---------------------- ENV -------------------------

load_dotenv(os.path.join(AIRFLOW_HOME, ".env"))

sp = Spotify(auth_manager=SpotifyClientCredentials(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
))

# ---------------------- LOGGING ---------------------

os.makedirs(LOG_DIR, exist_ok=True)
log_path = os.path.join(LOG_DIR, "data_enrich.log")

logger = logging.getLogger("data_enrich")
logger.setLevel(logging.INFO)
formatter = logging.Formatter('[%(asctime)s] %(levelname)s: %(message)s')

file_handler = RotatingFileHandler(log_path, maxBytes=5_000_000, backupCount=3)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# ------------------ BATCH PROGRESS ------------------

if os.path.exists(PROGRESS_FILE):
    with open(PROGRESS_FILE, "r") as f:
        progress = json.load(f)
        batch_number = progress.get("batch_number", 0)
else:
    batch_number = 0

# --------------------- READ DATA ---------------------

try:
    df = pd.read_csv(DATASET_PATH)
except FileNotFoundError:
    logger.error(f"Dataset file not found at {DATASET_PATH}")
    exit(1)

batch_size = 3800
start = batch_number * batch_size
end = start + batch_size
df_batch = df.iloc[start:end]

if df_batch.empty:
    logger.info(f"[Batch {batch_number}] No more tracks to process.")
    exit(0)

# ---------------------- PROCESS ----------------------

albums, artists, songs = {}, {}, []
os.makedirs(DATA_DIR, exist_ok=True)

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

                # Song row
                song_row = row[[
                    "track_id", "track_name", "popularity", "duration_ms", "explicit", "danceability",
                    "energy", "key", "loudness", "mode", "speechiness", "acousticness",
                    "instrumentalness", "liveness", "valence", "tempo", "time_signature", "track_genre"
                ]].to_dict()

                song_row.update({
                    "album_id": album_id,
                    "artist_id": artist_id,
                    "track_image_url": album["images"][0]["url"] if album["images"] else None
                })

                songs.append(song_row)

            break  # success, exit retry loop

        except Exception as e:
            logger.error(f"Error fetching track {track_id} on attempt {attempt}: {e}")
            attempt += 1
            time.sleep(backoff)
            backoff *= 2

# ------------------ SAVE & UPLOAD -------------------

albums_df = pd.DataFrame(albums.values())
artists_df = pd.DataFrame(artists.values())
songs_df = pd.DataFrame(songs)

songs_df = songs_df.sort_values("popularity", ascending=False)
songs_df = songs_df.drop_duplicates(subset=["track_id", "artist_id"], keep="first")

albums_df.to_csv(os.path.join(DATA_DIR, "albums.csv"), index=False)
artists_df.to_csv(os.path.join(DATA_DIR, "artists.csv"), index=False)
songs_df.to_csv(os.path.join(DATA_DIR, "songs.csv"), index=False)

upload_csv_to_postgres(os.path.join(DATA_DIR, "albums.csv"), "albums", logger)
upload_csv_to_postgres(os.path.join(DATA_DIR, "artists.csv"), "artists", logger)
upload_csv_to_postgres(os.path.join(DATA_DIR, "songs.csv"), "songs", logger)

# ------------------ UPDATE PROGRESS ------------------

batch_number += 1
with open(PROGRESS_FILE, "w") as f:
    json.dump({"batch_number": batch_number}, f)

logger.info(f"[Batch {batch_number}] Completed {len(songs)} songs, {len(artists)} artists, {len(albums)} albums")