from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.base import engine, Base
from models.song import Song
from models.user import User
from models.album import Album
from models.artist import Artist
from models.album_artists import AlbumArtist
from models.playlist import Playlist
from models.playlist_user import PlaylistUser
from models.playlist_tracks import PlaylistTracks
from routes.auth_routes import router as auth_router
from routes.music_routes import router as music_router
from routes.user_routes import router as user_router
from routes.table_routes import router as database_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://*.vercel.app",   # Vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(music_router, prefix="/api/music")
app.include_router(user_router, prefix="/api/user")
app.include_router(database_router, prefix="/api/database")

@app.get("/")
def root():
<<<<<<< Updated upstream
    return {"message": "Testing OK"}
=======
<<<<<<< HEAD
    return {"message": "Testing OK"}

<<<<<<< Updated upstream
@app.on_event("startup")
def startup_event():
    print("Loading models...")
    recommender.load()
    print("Done.")
=======
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Backend is running"}
>>>>>>> Stashed changes
=======
    return {"message": "Testing OK"}
>>>>>>> 8f6b096427df9f0d02f76c72d8d6788045082319
>>>>>>> Stashed changes
