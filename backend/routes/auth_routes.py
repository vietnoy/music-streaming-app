from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.user import User
from starlette import status
from schemas.user import UserCreate, UserResponse, UserLogin
from typing import List
from ..dependencies import db_dependency
from ..controllers import auth_controller

from ..utils.password import hash_password, verify_password

router = APIRouter()

@router.post("/signup",status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def signup(user: UserCreate, db: db_dependency):
    return auth_controller.signup(user, db)

def login(user: UserCreate, db: db_dependency):
    return auth_controller.login_for_access_token(user, db)


# @router.post("/signin", response_model=UserResponse)
# def signin(username: UserLogin, db: db_dependency):
#     # Try finding the user by email or username
#     user = (
#         db.query(User)
#         .filter((User.email == username.identifier) | (User.username == username.identifier))
#         .first()
#     )

#     if not user or not verify_password(username.password, user.hashed_password):
#         # raise HTTPException(status_code=401, detail="Invalid username/email or password")
#         return False

#     return user