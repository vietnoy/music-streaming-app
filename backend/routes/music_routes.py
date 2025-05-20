from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Query, Body
from typing import List, Union
from sqlalchemy.orm import Session
from sqlalchemy import text
from models.base import SessionLocal
from models.playlist import Playlist
from models.playlist_user import PlaylistUser
from schemas.album import AlbumResponse
from schemas.track import TrackResponse
from schemas.user import UserResponse
from schemas.playlist import PlaylistResponse
from schemas.artist import ArtistResponse
from utils.format_ms import format_duration
from collections import defaultdict
from utils.s3_mp3_url import generate_presigned_url
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import cloudinary
import cloudinary.uploader
import os
from uuid import uuid4
from dotenv import load_dotenv
from utils.recommender_loader import recommender
import random
from models.user import User
from .auth_routes import get_current_user

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_NAME"),
    api_key=os.getenv("CLOUDINARY_KEY"),
    api_secret=os.getenv("CLOUDINARY_SECRET"),
    secure=True
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

### Playlist API
@router.get("/user_playlist", response_model=List[PlaylistResponse])
def get_user_playlists(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id
    query = text("""
        SELECT playlist_user.playlist_id AS id, playlists.name, users.username AS owner_name, playlist_user.type, playlists.cover_image_url, playlists.description, playlist_user.created_at, playlist_user.last_played as last_played
        FROM playlists
        RIGHT JOIN playlist_user ON playlists.id = playlist_user.playlist_id
        INNER JOIN users ON users.id = playlist_user.user_id
        WHERE users.id = :user_id
    """)
    result = db.execute(query, {"user_id": user_id})
    rows = result.fetchall()

    # Convert to list of PlaylistResponse
    playlists = []
    for row in rows:
        playlist_id, name, owner_name, type_, cover, desc, created_at, last_played = row

        if type_ == "artist":
            artist_row = db.execute(text("""
                SELECT name, image_url FROM artists WHERE id = :id
            """), {"id": playlist_id}).fetchone()
            if artist_row:
                name, cover = artist_row
                desc = f"Playlist của nghệ sĩ {name}"
        
        elif type_ == "single" or type_ == "composite":
            song_row = db.execute(text("""
                SELECT name, image_url FROM albums WHERE id = :id
            """), {"id": playlist_id}).fetchone()
            if song_row:
                name, cover = song_row
                desc = f"Single: {name}"

        playlists.append(PlaylistResponse(
            id=playlist_id,
            name=name,
            owner_name=owner_name,
            type=type_,
            cover_image_url=cover,
            description=desc,
            created_at=created_at,
            last_played=last_played
        ))

    # playlists = [
    #     PlaylistResponse(
    #         id = row[0],
    #         name=row[1],
    #         owner_name=row[2],
    #         type=row[3],
    #         cover_image_url=row[4],
    #         description=row[5],
    #         created_at=row[6],
    #     )
    #     for row in rows
    # ]

    return playlists

@router.get("/playlist/{playlist_id}/songs", response_model=List[TrackResponse])
def get_playlist_songs(playlist_id: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT s.track_id, s.track_name, at.id AS artist_id, at.name AS artist_name, ab.id AS album_id, ab.name AS album_name,
               s.duration_ms, s.track_image_url, ps.date_added
        FROM songs s
        INNER JOIN playlist_tracks ps ON s.track_id = ps.track_id
        INNER JOIN playlist_user pu ON pu.playlist_id = ps.playlist_id
        INNER JOIN artists at ON at.id = s.artist_id
        INNER JOIN albums ab ON ab.id = s.album_id
        WHERE ps.playlist_id = :playlist_id
    """)
    result = db.execute(query, {"playlist_id": playlist_id})
    rows = result.fetchall()

    if not rows:
        raise HTTPException(status_code=404, detail="No songs found in this playlist")

    # Aggregate artists by track
    track_map = defaultdict(lambda: {
        "id": None,
        "title": None,
        "artist_id": set(),
        "artists": set(),
        "album_id": None,
        "album": None,
        "duration": None,
        "cover_url": None,
        "date_added": None,
    })

    for row in rows:
        track_id = row[0]
        track = track_map[track_id]
        track["id"] = track_id
        track["title"] = row[1]
        track["artist_id"].add(row[2])
        track["artists"].add(row[3])
        track["album_id"] = row[4]
        track["album"] = row[5]
        track["duration"] = format_duration(row[6])
        track["cover_url"] = row[7]
        track["date_added"] = row[8]

    return [
        TrackResponse(
            id=track["id"],
            title=track["title"],
            artist_id=", ".join(sorted(track["artist_id"])),
            artist=", ".join(sorted(track["artists"])),
            album_id=track["album_id"],
            album=track["album"],
            duration=track["duration"],
            cover_url=track["cover_url"],
            date_added=track["date_added"].isoformat() if track["date_added"] else None
        )
        for track in track_map.values()
    ]

@router.get("/playlist/{playlist_id}", response_model=PlaylistResponse)
def get_playlist_info(playlist_id: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT 
            playlists.id,
            playlists.name,
            users.username AS owner_name,
            playlist_user.type,
            playlists.cover_image_url,
            playlists.description,
            playlist_user.created_at,
            playlist_user.last_played
        FROM playlists
        INNER JOIN playlist_user ON playlists.id = playlist_user.playlist_id
        INNER JOIN users ON users.id = playlist_user.user_id
        WHERE playlists.id = :playlist_id
        LIMIT 1
    """)
    result = db.execute(query, {"playlist_id": playlist_id}).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Playlist not found")

    return PlaylistResponse(
        id=result[0],
        name=result[1],
        owner_name=result[2],
        type=result[3],
        cover_image_url=result[4],
        description=result[5],
        created_at=result[6],
        last_played=result[7]
    )

@router.put("/playlist/{playlist_id}/edit")
async def update_playlist(
    playlist_id: str,
    name: str = Form(None),
    description: str = Form(None),
    cover_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")

    if name is not None:
        playlist.name = name
    if description is not None:
        playlist.description = description
    if cover_image:
        try:
            upload_result = cloudinary.uploader.upload(
                cover_image.file,
                folder=f"playlist_covers/{playlist_id}",
                public_id="cover",
                resource_type="image"
            )
            playlist.cover_image_url = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    db.commit()
    db.refresh(playlist)
    return {"message": "Playlist updated", "cover_image_url": playlist.cover_image_url}

@router.delete("/user/playlist/{playlist_id}")
def delete_playlist(playlist_id: str, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    # First delete all songs from the playlist
    db.execute(text("""
        DELETE FROM playlist_tracks
        WHERE playlist_id = :playlist_id
    """), {"playlist_id": playlist_id})

    # Then delete the playlist-user association
    db.execute(text("""
        DELETE FROM playlist_user
        WHERE playlist_id = :playlist_id AND user_id = :user_id
    """), {"playlist_id": playlist_id, "user_id": user_id})

    # Then delete the playlist itself
    result = db.execute(text("""
        DELETE FROM playlists
        WHERE id = :playlist_id AND owner_id = :user_id
    """), {"playlist_id": playlist_id, "user_id": user_id})

    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Playlist not found or not owned by user")

    return {"message": "Playlist deleted successfully"}

@router.post("/user/create_playlist")
async def create_playlist(
    user_id: str,
    name: str = Form(...),
    description: str = Form(""),
    cover_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    playlist_id = str(uuid4())
    cover_url = None

    if cover_image:
        try:
            upload_result = cloudinary.uploader.upload(
                cover_image.file,
                folder=f"user_{user_id}/playlist_covers/{playlist_id}",
                public_id="cover",
                resource_type="image"
            )
            cover_url = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

    # Create playlist
    playlist = Playlist(
        id=playlist_id,
        name=name,
        description=description,
        cover_image_url=cover_url,
        # is_public=True,
        # last_played=None,
        owner_id=user_id
    )
    db.add(playlist)
    db.add(PlaylistUser(user_id=user_id, playlist_id=playlist_id, type="playlist"))
    db.commit()

    return {
        "id": playlist_id,
        "name": name,
        "description": description,
        "cover_image_url": cover_url
    }

@router.delete("/playlist/{playlist_id}/remove_track")
def remove_track_from_playlist(
    playlist_id: str,
    track_id: str = Query(...),
    db: Session = Depends(get_db)
):
    delete_query = text("""
        DELETE FROM playlist_tracks
        WHERE playlist_id = :playlist_id AND track_id = :track_id
    """)
    result = db.execute(delete_query, {
        "playlist_id": playlist_id,
        "track_id": track_id
    })
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Track not found in playlist")

    return {"message": "Track removed from playlist"}

### Album API

@router.get("/album/{album_id}", response_model=AlbumResponse)
def get_album_by_id(album_id: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT ab.id, ab.name, ab.image_url, ab.release_date, at.name, aa.artist_id
        FROM albums ab
        INNER JOIN album_artists aa ON ab.id = aa.album_id
        INNER JOIN artists at ON aa.artist_id = at.id
        WHERE ab.id = :album_id
        LIMIT 1
    """)
    result = db.execute(query, {"album_id": album_id}).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Playlist not found")

    return AlbumResponse(
            id=result[0],
            name=result[1],
            cover_image_url=result[2],
            release_date=result[3],
            artist_name=result[4],
            artist_id=result[5]
        )

@router.get("/album/{album_id}/songs", response_model=List[TrackResponse])
def get_album_songs(album_id: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT s.track_id, s.track_name, at.id AS artist_id, at.name AS artist_name, ab.id AS album_id, ab.name AS album_name,
               s.duration_ms, s.track_image_url
        FROM songs s
        INNER JOIN albums ab ON ab.id = s.album_id
        INNER JOIN artists at ON at.id = s.artist_id
        WHERE ab.id = :album_id
    """)
    result = db.execute(query, {"album_id": album_id})
    rows = result.fetchall()

    if not rows:
        raise HTTPException(status_code=404, detail="No songs found in this album")

    return [
        TrackResponse(
            id=row[0],
            title=row[1],
            artist_id=row[2],
            artist=row[3],
            album_id=row[4],
            album=row[5],
            duration=format_duration(row[6]),
            cover_url=row[7],
            date_added=None
        )
        for row in rows
    ]

@router.post("/user/add_track_to_playlist")
def add_track_to_playlist(
    track_id: str = Body(...),
    playlist_id: str = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    # Step 1: Check if track already exists
    existing = db.execute(text("""
        SELECT 1 FROM playlist_tracks
        WHERE playlist_id = :playlist_id AND track_id = :track_id
    """), {"playlist_id": playlist_id, "track_id": track_id}).fetchone()

    if existing:
        raise HTTPException(status_code=409, detail="Track already exists in playlist")

    # Step 2: Insert the track
    local_time = datetime.now(ZoneInfo("Asia/Bangkok"))
    naive_time = local_time.replace(tzinfo=None)
    db.execute(text("""
        INSERT INTO playlist_tracks (playlist_id, track_id, date_added)
        VALUES (:playlist_id, :track_id, :date_added)
    """), {
        "playlist_id": playlist_id,
        "track_id": track_id,
        "date_added": naive_time
    })

    db.commit()
    return {"message": "Track successfully added to playlist"}

@router.post("/add_to_library/{item_id}")
def add_to_library(
    item_id: str,
    type: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    new_entry = PlaylistUser(
        playlist_id=item_id,
        user_id=user_id,
        type=type
    )

    db.add(new_entry)
    db.commit()

@router.delete("/remove_from_library/{item_id}")
def remove_from_library(
    item_id:str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    delete_query = text("""
        DELETE FROM playlist_user
        WHERE playlist_id = :item_id AND user_id = :user_id
    """)
    result = db.execute(delete_query, {
        "item_id": item_id,
        "user_id": user_id
    })
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Playlist not found in library")

    return {"message": "Playlist removed from library"}

### Artist API
@router.get("/artist/{artist_id}", response_model=ArtistResponse)
def get_artist_by_id(artist_id: str, db: Session = Depends(get_db)):
    query = text("SELECT id, name, image_url FROM artists WHERE id = :artist_id")
    result = db.execute(query, {"artist_id": artist_id}).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Artist not found")

    return ArtistResponse(
        id=result[0],
        name=result[1],
        profile_image_url=result[2],
    )

@router.get("/artist/{artist_id}/songs", response_model=List[TrackResponse])
def get_artist_songs(artist_id: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT s.track_id, s.track_name, at.id AS artist_id, at.name AS artist_name, ab.id AS album_id, ab.name AS album_name,
               s.duration_ms, s.track_image_url
        FROM songs s
        INNER JOIN artists at ON at.id = s.artist_id
        INNER JOIN albums ab ON ab.id = s.album_id
        WHERE at.id = :artist_id
    """)
    result = db.execute(query, {"artist_id": artist_id})
    rows = result.fetchall()

    if not rows:
        raise HTTPException(status_code=404, detail="No songs found for this artist")

    return [
        TrackResponse(
            id=row[0],
            title=row[1],
            artist_id=row[2],
            artist=row[3],
            album_id=row[4],
            album=row[5],
            duration=format_duration(row[6]),
            cover_url=row[7],
            date_added=None
        )
        for row in rows
    ]

### Search API
@router.get("/search", response_model=Union[List[TrackResponse], List[AlbumResponse], List[ArtistResponse]])
def search_items(
    query: str = Query(..., alias="query", description="Search keyword"),  # <-- use alias
    filter_by: str = Query("track", description="Search filter: track, album, or artist"),
    db: Session = Depends(get_db)
):
    keyword_like = f"%{query.lower()}%"

    if filter_by == "track":
        query = text("""
            WITH filtered_songs AS (
                SELECT * FROM songs 
                WHERE LOWER(track_name) LIKE :keyword
                LIMIT 50
            )
            SELECT fs.track_id, fs.track_name, a.id AS artist_id, a.name AS artist_name, al.id AS album_id, al.name AS album_name,
                fs.duration_ms, fs.track_image_url
            FROM filtered_songs fs
            JOIN artists a ON fs.artist_id = a.id
            JOIN albums al ON fs.album_id = al.id
        """)
        rows = db.execute(query, {"keyword": keyword_like}).fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="No songs found in this playlist")

        # Aggregate artists by track
        track_map = defaultdict(lambda: {
            "id": None,
            "title": None,
            "artist_id": set(),
            "artists": set(),
            "album_id": None,
            "album": None,
            "duration": None,
            "cover_url": None,
            "date_added": None,
        })

        for row in rows:
            track_id = row[0]
            track = track_map[track_id]
            track["id"] = track_id
            track["title"] = row[1]
            track["artist_id"].add(row[2])
            track["artists"].add(row[3])
            track["album_id"] = row[4]
            track["album"] = row[5]
            track["duration"] = format_duration(row[6])
            track["cover_url"] = row[7]
            track["date_added"] = None

        return [
            TrackResponse(
                id=track["id"],
                title=track["title"],
                artist_id=", ".join(sorted(track["artist_id"])),
                artist=", ".join(sorted(track["artists"])),
                album_id=track["album_id"],
                album=track["album"],
                duration=track["duration"],
                cover_url=track["cover_url"],
                date_added=track["date_added"].isoformat() if track["date_added"] else None
            )
            for track in track_map.values()
        ]

    elif filter_by == "album":
        query = text("""
            SELECT ab.id AS album_id, ab.name, ab.image_url, ab.release_date,
                   at.id AS artist_id, at.name AS artist_name
            FROM albums ab
            JOIN album_artists aa ON ab.id = aa.album_id
            JOIN artists at ON aa.artist_id = at.id
            WHERE LOWER(ab.name) LIKE :keyword
        """)
        rows = db.execute(query, {"keyword": keyword_like}).fetchall()

        album_map = defaultdict(lambda: {
            "id": None,
            "name": None,
            "cover_image_url": None,
            "release_date": None,
            "artist_ids": set(),
            "artist_names": set()
        })

        for row in rows:
            album_id = row[0]
            album = album_map[album_id]
            album["id"] = album_id
            album["name"] = row[1]
            album["cover_image_url"] = row[2]
            album["release_date"] = row[3]
            album["artist_ids"].add(row[4])
            album["artist_names"].add(row[5])

        return [
            AlbumResponse(
                id=album["id"],
                name=album["name"],
                cover_image_url=album["cover_image_url"],
                release_date=album["release_date"],
                artist_id=", ".join(album["artist_ids"]),
                artist_name=", ".join(sorted(album["artist_names"]))
            )
            for album in album_map.values()
        ]

    elif filter_by == "artist":
        query = text("""
            SELECT id, name, image_url
            FROM artists
            WHERE LOWER(name) LIKE :keyword
        """)
        rows = db.execute(query, {"keyword": keyword_like}).fetchall()

        return [
            ArtistResponse(
                id=row[0],
                name=row[1],
                profile_image_url=row[2],
            )
            for row in rows
        ]

    return []

@router.get("/mp3url/{track_name}")
def get_mp3_url(track_name: str):
    try:
        url = generate_presigned_url(track_name)
        if not url:
            return JSONResponse(status_code=404, content={"detail": "URL could not be generated"})
        return {"url": url}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@router.get("/user/liked_track_ids", response_model=List[str])
def get_liked_track_ids(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id
    query = text("""
        SELECT pt.track_id
        FROM playlist_tracks pt
        INNER JOIN playlist_user pu ON pu.playlist_id = pt.playlist_id
        INNER JOIN playlists p ON p.id = pt.playlist_id
        WHERE pu.user_id = :user_id AND p.name = 'Liked Songs'
    """)
    result = db.execute(query, {"user_id": user_id}).fetchall()
    return [row[0] for row in result]

@router.post("/user/liked_track")
def add_to_liked_playlist(
    track_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    local_time = datetime.now(ZoneInfo("Asia/Bangkok"))
    naive_time = local_time.replace(tzinfo=None)
    # Get Liked Songs playlist ID (p.name = 'Liked Songs' is error)
    playlist_query = text("""
        SELECT p.id FROM playlists p
        INNER JOIN playlist_user pu ON pu.playlist_id = p.id
        WHERE pu.user_id = :user_id AND p.name = 'Liked Songs' 
        LIMIT 1
    """)
    result = db.execute(playlist_query, {"user_id": user_id}).first()
    if not result:
        raise HTTPException(status_code=404, detail="Liked Songs playlist not found")

    playlist_id = result[0]

    # Check if track is already added
    exists_query = text("""
        SELECT 1 FROM playlist_tracks
        WHERE playlist_id = :playlist_id AND track_id = :track_id
        LIMIT 1
    """)
    exists = db.execute(exists_query, {"playlist_id": playlist_id, "track_id": track_id}).first()
    if exists:
        raise HTTPException(status_code=409, detail="Track already in Liked Songs")

    # Insert the track
    insert_query = text("""
        INSERT INTO playlist_tracks (playlist_id, track_id, date_added)
        VALUES (:playlist_id, :track_id, :date_added)
    """)
    db.execute(insert_query, {
        "playlist_id": playlist_id,
        "track_id": track_id,
        "date_added": naive_time
    })
    db.commit()

    return {"message": "Track added to Liked Songs"}

@router.delete("/user/liked_track")
def remove_from_liked_playlist(
    track_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    try:
        # Find Liked Songs playlist ID
        playlist_query = text("""
            SELECT pu.playlist_id
            FROM playlist_user pu
            JOIN playlists p ON pu.playlist_id = p.id
            WHERE pu.user_id = :user_id AND p.name = 'Liked Songs'
        """)
        result = db.execute(playlist_query, {"user_id": user_id}).fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Liked Songs playlist not found.")

        playlist_id = result[0]

        # Remove the track from the playlist
        delete_query = text("""
            DELETE FROM playlist_tracks
            WHERE playlist_id = :playlist_id AND track_id = :track_id
        """)
        db.execute(delete_query, {"playlist_id": playlist_id, "track_id": track_id})
        db.commit()

        return {"message": "Track removed from liked songs."}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# @router.get("/related")  
# def get_recommendations(track_id: str = Query(...)):
#     idx = recommender.data_df[recommender.data_df["track_id"] == track_id].index[0]
#     query_vector = recommender.track_features[idx].reshape(1, -1)

#     distances, indices = recommender.faiss_index.search(query_vector, 6)
#     similar = recommender.data_df.iloc[indices[0][1:]]
#     return similar[['track_id', 'track_name', 'artists', 'track_genre', 'popularity']].to_dict(orient="records")

@router.get("/related/{track_id}", response_model=List[TrackResponse])
def get_related_songs(track_id: str, db: Session = Depends(get_db)):
    idx = recommender.data_df[recommender.data_df["track_id"] == track_id].index[0]
    query_vector = recommender.track_features[idx].reshape(1, -1)

    distances, indices = recommender.faiss_index.search(query_vector, 10)
    similar_ids = {
        recommender.data_df.iloc[i]["track_id"]
        for i in indices[0]
        if recommender.data_df.iloc[i]["track_id"] != track_id
    }

    track_ids = random.sample(list(similar_ids), min(3, len(similar_ids)))

    rows = []
    for tid in track_ids:
        query = text("""
            SELECT s.track_id, s.track_name, at.id AS artist_id, at.name AS artist_name,
                   ab.id AS album_id, ab.name AS album_name,
                   s.duration_ms, s.track_image_url
            FROM songs s
            JOIN artists at ON at.id = s.artist_id
            JOIN albums ab ON ab.id = s.album_id
            WHERE s.track_id = :track_id
        """)
        row = db.execute(query, {"track_id": tid}).fetchone()
        if row:
            rows.append(row)

    track_map = defaultdict(lambda: {
        "id": None,
        "title": None,
        "artist_id": set(),
        "artists": set(),
        "album_id": None,
        "album": None,
        "duration": None,
        "cover_url": None,
        "date_added": None,
    })

    for row in rows:
        track_id = row[0]
        track = track_map[track_id]
        track["id"] = track_id
        track["title"] = row[1]
        track["artist_id"].add(row[2])
        track["artists"].add(row[3])
        track["album_id"] = row[4]
        track["album"] = row[5]
        track["duration"] = format_duration(row[6])
        track["cover_url"] = row[7]

    return [
        TrackResponse(
            id=track["id"],
            title=track["title"],
            artist_id=", ".join(sorted(track["artist_id"])),
            artist=", ".join(sorted(track["artists"])),
            album_id=track["album_id"],
            album=track["album"],
            duration=track["duration"],
            cover_url=track["cover_url"],
            date_added=None 
        )
        for track in track_map.values()
    ]


@router.get("/recommendations", response_model=List[TrackResponse])
def get_recommendations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id
    recommended_track_ids = recommender.get_recommendations(user_id)
    if not recommended_track_ids:
        return []

    rows = []
    for tid in recommended_track_ids:
        query = text("""
            SELECT s.track_id, s.track_name, at.id AS artist_id, at.name AS artist_name,
                   ab.id AS album_id, ab.name AS album_name,
                   s.duration_ms, s.track_image_url
            FROM songs s
            JOIN artists at ON at.id = s.artist_id
            JOIN albums ab ON ab.id = s.album_id
            WHERE s.track_id = :track_id
        """)
        row = db.execute(query, {"track_id": tid}).fetchone()
        if row:
            rows.append(row)

    track_map = defaultdict(lambda: {
        "id": None,
        "title": None,
        "artist_id": set(),
        "artists": set(),
        "album_id": None,
        "album": None,
        "duration": None,
        "cover_url": None,
        "date_added": None,
    })

    for row in rows:
        track_id = row[0]
        track = track_map[track_id]
        track["id"] = track_id
        track["title"] = row[1]
        track["artist_id"].add(row[2])
        track["artists"].add(row[3])
        track["album_id"] = row[4]
        track["album"] = row[5]
        track["duration"] = format_duration(row[6])
        track["cover_url"] = row[7]

    return [
        TrackResponse(
            id=track["id"],
            title=track["title"],
            artist_id=", ".join(sorted(track["artist_id"])),
            artist=", ".join(sorted(track["artists"])),
            album_id=track["album_id"],
            album=track["album"],
            duration=track["duration"],
            cover_url=track["cover_url"],
            date_added=None 
        )
        for track in track_map.values()
    ]


### Library API
@router.put("/library/{item_id}/last_played")
def update_last_played(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = db.query(PlaylistUser).filter(
        PlaylistUser.user_id == current_user.id,
        PlaylistUser.playlist_id == item_id
    ).first()

    if not entry:
        raise HTTPException(status_code=403, detail="Item is not in user's library")

    entry.last_played = datetime.now(timezone.utc)
    db.commit()
    return {"message": f"Updated last_played for item {item_id}"}