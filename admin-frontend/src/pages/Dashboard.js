import React from 'react';
import {
  FaUser,
  FaMusic,
  FaCompactDisc,
  FaUserAlt,
  FaTags,
  FaListAlt
} from 'react-icons/fa';

const Dashboard = () => {
  const stats = {
    users: 256,
    songs: 842,
    albums: 120,
    artists: 78,
    genres: 12,
    playlists: 35,
  };

  const cards = [
    { label: 'Users', value: stats.users, icon: <FaUser size={28} color="#00adb5" /> },
    { label: 'Songs', value: stats.songs, icon: <FaMusic size={28} color="#00adb5" /> },
    { label: 'Albums', value: stats.albums, icon: <FaCompactDisc size={28} color="#00adb5" /> },
    { label: 'Artists', value: stats.artists, icon: <FaUserAlt size={28} color="#00adb5" /> },
    { label: 'Genres', value: stats.genres, icon: <FaTags size={28} color="#00adb5" /> },
    { label: 'Playlists', value: stats.playlists, icon: <FaListAlt size={28} color="#00adb5" /> },
  ];

  return (
    <div className="content">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="icon">{card.icon}</div>
            <h3>{card.value}</h3>
            <p>{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
