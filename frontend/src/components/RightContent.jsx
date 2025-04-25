import React from "react";
import "../styles/RightContent.css";

const RightContent = ({ currentSong }) => {
  if (!currentSong) return null;

  return (
    <aside className="right-content-cover">
      <img
        className="cover-image"
        src={currentSong.image_url}
        alt={currentSong.track_name}
      />
      <div className="overlay-content">
        <h1 className="song-title">{currentSong.track_name}</h1>
        <p className="song-artist">{currentSong.artist_name}</p>

        <div className="related-section">
          <h4>Related Music</h4>
          <div className="video-card">
            <img src="/default_cover.jpg" alt="related" />
            <span>{currentSong.track_name} (Live)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightContent;