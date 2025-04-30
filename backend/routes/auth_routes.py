import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt, JWTError

from models.base import SessionLocal
from models.user import User
from models.playlist import Playlist
from models.playlist_user import PlaylistUser
from schemas.user import UserCreate, UserResponse, UserLogin
from utils.password import hash_password, verify_password

from dotenv import load_dotenv

### Config
load_dotenv("backend/.env")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTE")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/signin")


### Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


### JWT helper
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


### Authenticated user dependency
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == str(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


### Signup route
@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        birthdate=user.birthdate,
        gender=user.gender,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # now new_user.id is ready

    # Create default playlist
    liked_playlist = Playlist(
        name="Liked Songs",
        owner_id=new_user.id,
        
        is_public=False,
        description="Your personal liked songs collection",
        cover_image_url="https://misc.scdn.co/liked-songs/liked-songs-640.png",
    )

    db.add(liked_playlist)
    db.commit()
    db.refresh(liked_playlist)

    playlist_user = PlaylistUser(
        playlist_id=liked_playlist.id,
        user_id=new_user.id,
        type="playlist",
    )

    db.add(playlist_user)
    db.commit()

    return new_user


### Signin route (returns token)
@router.post("/signin")
def signin(credentials: UserLogin, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(
            (User.email == credentials.identifier)
            | (User.username == credentials.identifier)
        )
        .first()
    )
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
    }


### Protected test route
@router.get("/home")
def get_home(user: User = Depends(get_current_user)):
    return {"message": f"Welcome back, {user.username}!"}