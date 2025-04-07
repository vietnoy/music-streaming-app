from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    birthdate: date
    gender: Optional[str]

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    birthdate: date
    gender: Optional[str]

    class Config:
        orm_mode = True
