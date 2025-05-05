import React, { useEffect, useState } from "react";
import "../styles/RightContent.css";
// import { FaPlay } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";

const RightContent = ({ currentSong }) => {
  const [relatedSongs, setRelatedSongs] = useState([]);
  const { playSong } = usePlayer();

  const fetchMp3Url = async (trackName) => {
    try {
      const res = await fetch(`http://localhost:8000/api/music/mp3url/${encodeURIComponent(trackName)}`);
      const data = await res.json();
      return data.url;
    } catch (err) {
      return null;
    }
  };

  const playSongFrom = async (trackId) => {
    const track = relatedSongs.find((t) => t.id === trackId);
    if (!track) return;

    const rest = relatedSongs.filter((t) => t.id !== trackId);

    try {
      const mp3Url = await fetchMp3Url(track.title);
      const enrichedTrack = { ...track, mp3_url: mp3Url };

      playSong(enrichedTrack, rest);
    } catch (err) {
      console.error("Lỗi khi play song:", err);
    }
  };

  useEffect(() => {
    if (!currentSong?.id) return;

    const fetchRelated = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/music/related/${currentSong.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setRelatedSongs(data);
        } else {
          setRelatedSongs([]);
        }
      } catch (err) {
        setRelatedSongs([]);
      }
    };

    fetchRelated();
  }, [currentSong]);

  if (!currentSong) return null;

  return (
    <aside className="right-content-cover">
      <img
        className="cover-image"
        src={currentSong.image_url || currentSong.cover_url}
        alt={currentSong.track_name || currentSong.title}
      />
      <div className="overlay-content">
        <h1 className="song-title">{currentSong.track_name || currentSong.title}</h1>
        <p className="song-artist">{currentSong.artist_name || currentSong.artist}</p>

        <div className="related-section">
          <h4>Related Music</h4>
          {relatedSongs.length > 0 ? (
            relatedSongs.map((track) => (
              <div key={track.id} className="video-card">
                <img
                  src={track.cover_url}
                  alt={track.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default_cover.jpg";
                  }}
                />
                <div className="track-info">
                  <p
                    className="track-title"
                    onClick={() => playSongFrom(track.id)}
                    title="Bấm để phát bài này"
                  >
                    {track.title}
                  </p>
                  <span className="track-artist">{track.artist}</span>
                  {/* <FaPlay
                    className="play-icon-row"
                    title="Phát bài này"
                    onClick={() => playSongFrom(track.id)}
                  /> */}
                </div>
              </div>
            ))
          ) : (
            <p>Không có bài hát liên quan.</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightContent;
