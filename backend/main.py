from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from models.base import engine, Base
from models.song import Song
from models.user import User
from models.album import Album
from models.artist import Artist
from models.album_artists import AlbumArtist
from routes.auth_routes import router as auth_router
from routes.music_routes import router as music_router
from routes.user_routes import router as user_router
from typing import Annotated

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,  
    allow_methods=["*"], 
    allow_headers=["*"], 
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(music_router, prefix="/api/music")
app.include_router(user_router, prefix="/api/user")

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@app.get("/")
def root():
    return {"message": "Testing OK"}