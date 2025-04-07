from sqlalchemy import Column, Integer, String, Date
from models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    birthdate = Column(Date, nullable=False)
    gender = Column(String, nullable=True)
