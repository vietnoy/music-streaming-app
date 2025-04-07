import React from "react";
import "../styles/RightContent.css";

const RightContent = ({ currentSong }) => {
  return (
    <aside className="right-content">
      <h3>Now Playing</h3>
      <img src={currentSong.image} alt="cover" />
      <div className="info">
        <p className="title">{currentSong.song}</p>
        <p className="artist">{currentSong.artist}</p>
      </div>

      <div className="section">
        <h4>Related Music Videos</h4>
        <div className="video-card">
          <img src="/default_cover.jpg" alt="video" />
          <span>Drive – SZA</span>
        </div>
      </div>

      <div className="section">
        <h4>About the Artist</h4>
        <div className="artist-card">
          <img src="/default_cover.jpg" alt="artist" />
          <span>SZA • 86,933,085 followers</span>
        </div>
      </div>
    </aside>
  );
};

export default RightContent;