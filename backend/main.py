from fastapi import FastAPI
from models.base import engine, Base
from models.song import Song

from routes.auth_routes import router as auth_router
from routes.music_routes import router as music_router
from routes.user_routes import router as user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(music_router, prefix="/api/music")
app.include_router(user_router, prefix="/api/user")

@app.get("/")
def root():
    return {"message": "Testing OK"}