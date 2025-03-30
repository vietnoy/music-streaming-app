from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.base import SessionLocal
from models.user import User
from schemas.user import UserCreate, UserResponse, UserLogin
from utils.password import hash_password, verify_password
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user with email already exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        birthdate=user.birthdate,
        gender=user.gender
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/signin", response_model=UserResponse)
def signin(credentials: UserLogin, db: Session = Depends(get_db)):
    # Try finding the user by email or username
    user = (
        db.query(User)
        .filter((User.email == credentials.identifier) | (User.username == credentials.identifier))
        .first()
    )

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    return user