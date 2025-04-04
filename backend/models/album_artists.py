from sqlalchemy import Column, String, ForeignKey
from models.base import Base

class AlbumArtist(Base):
    __tablename__ = "album_artists"

    album_id = Column(String, ForeignKey("albums.id"), primary_key=True)
    artist_id = Column(String, ForeignKey("artists.id"), primary_key=True)
