from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
from ..models.user import User
from fastapi.security import  OAuth2PasswordBearer
from jose import jwt, JWTError  
from ..utils.password import hash_password, verify_password
from ..dependencies import db_dependency
from ..schemas.user import UserCreate, Token

SECRET_KEY = '197b2c37c391bed93fe80344fe73b806947a65e36206e05a1a23c2fa12702fe3'
ALGORITHM = 'HS256'

oauth2_bearer = OAuth2PasswordBearer(tokenUrl='/auth/token')

def authenticate_user(username: str, password: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)