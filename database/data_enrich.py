import os
import pandas as pd
import logging
import time
from dotenv import load_dotenv
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials

log_name = "data_enrich"
log_path = os.path.join(os.getcwd(), f"database/logs/{log_name}.log")
os.makedirs(os.path.dirname(log_path), exist_ok=True)

logger = logging.getLogger(log_name)
logger.setLevel(logging.INFO)
formatter = logging.Formatter('[%(asctime)s] %(levelname)s: %(message)s')

file_handler = logging.FileHandler(log_path)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

load_dotenv()
sp = Spotify(auth_manager=SpotifyClientCredentials(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
))

df = pd.read_csv("./database/data/dataset.csv")
track_ids = df["track_id"].unique()

albums = {}
artists = {}
song_artists = []

for index, track_id in enumerate(track_ids):
    try:
        
        max_attempts = 5
        attempt = 1

        while attempt <= max_attempts:
            logger.info(f"Processing {index+1}/{len(track_ids)} track_id={track_id} (Attempt {attempt}/{max_attempts})")
            track = sp.track(track_id)

            # --- Album Info ---
            album_id = track["album"]["id"]
            if album_id not in albums:
                albums[album_id] = {
                    "id": album_id,
                    "name": track["album"]["name"],
                    "release_date": track["album"]["release_date"],
                    "image_url": track["album"]["images"][0]["url"] if track["album"]["images"] else None
                }

            # --- Artist Info ---
            for artist in track["artists"]:
                artist_id = artist["id"]
                if artist_id not in artists:
                    artist_data = sp.artist(artist_id)
                    artists[artist_id] = {
                        "id": artist_id,
                        "name": artist_data["name"],
                        "followers": artist_data["followers"]["total"],
                        "image_url": artist_data["images"][0]["url"] if artist_data["images"] else None
                    }
                song_artists.append({"song_id": track_id, "artist_id": artist_id})

            break

    except Exception as e:
        logger.error(f"Error fetching track {track_id} (Attempt {attempt}): {e}")
        attempt += 1
        time.sleep(2)
    
    finally:
        time.sleep(5)

output_dir = "./database/data"
os.makedirs(output_dir, exist_ok=True)

pd.DataFrame(albums.values()).to_csv(os.path.join(output_dir, "albums.csv"), index=False)
pd.DataFrame(artists.values()).to_csv(os.path.join(output_dir, "artists.csv"), index=False)
pd.DataFrame(song_artists).to_csv(os.path.join(output_dir, "song_artists.csv"), index=False)

logger.info(f"Exported {len(albums)} albums, {len(artists)} artists, and {len(song_artists)} song-artist links")
logger.info("Data enrichment completed successfully")