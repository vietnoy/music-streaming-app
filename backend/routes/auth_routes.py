import os

from fastapi import APIRouter, Depends, HTTPException, Response, Request
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
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS"))


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
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    # print(f"Token creat at: {datetime.utcnow()}")
    # print(f"Token expires at: {expire}")
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


###
def get_current_admin_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        roles = payload.get("roles", [])
        if user_id is None or "admin" not in roles:
            raise HTTPException(status_code=403, detail="Admin access required")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == str(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user
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
        # is_public=False,
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
def signin(credentials: UserLogin, response: Response, db: Session = Depends(get_db)):
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

    access_token = create_access_token(data={
        "sub": str(user.id),
        "roles": user.roles.split(",") if user.roles else ["user"]
    })
    refresh_token = create_refresh_token(data={"username": str(user.username)})
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        path="api/auth/refresh-token",
        expires=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "roles": user.roles,
        },
    }

### Refresh token route
@router.post("/refresh-token")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    access_token = create_access_token(data={
        "sub": str(user.id),
        "roles": user.roles.split(",") if user.roles else ["user"]
    })
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "roles": user.roles,
        },
    }


### Protected test route
@router.get("/home")
def get_home(user: User = Depends(get_current_user)):
    return {"message": f"Welcome back, {user.username}!"}