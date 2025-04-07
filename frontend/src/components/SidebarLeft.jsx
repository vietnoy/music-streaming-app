import React from "react";
import "../styles/MainContent/SidebarLeft.css";

const SidebarLeft = () => {
  const playlists = ["Liked Songs", "Ed Sheeran", "Billie Eilish", "Adele", "Charlie Puth"];

  return (
    <aside className="sidebar-left">
      <h2>Your Library</h2>
      <div className="filters">
        <span>Playlists</span>
        <span>Albums</span>
        <span>Artists</span>
      </div>
      <div className="playlist-list">
        {playlists.map((item, index) => (
          <div key={index} className="playlist-item">
            <img src="/default_cover.jpg" alt="cover" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarLeft;