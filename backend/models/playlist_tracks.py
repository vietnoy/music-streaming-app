from sqlalchemy import Column, String, DateTime, func
from models.base import Base

class PlaylistTracks(Base):
    __tablename__ = "playlist_tracks"

    playlist_id = Column(String, primary_key=True)
    track_id = Column(String, primary_key=True)
    date_added = Column(DateTime, default=func.now())
