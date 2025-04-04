from sqlalchemy import Column, String, ForeignKey
from models.base import Base

class PLaylist(Base):
    __tablename__ = "playlists"

    id = Column(String, primary_key=True)
    name = Column(String)
    owner_id = Column(String, ForeignKey("users.id"))