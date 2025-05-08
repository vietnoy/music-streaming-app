import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome, FaUserCog, FaMusic, FaPlusCircle,
  FaCompactDisc, FaUserAlt, FaTags, FaListAlt
} from 'react-icons/fa';
import '../styles/Sidebar.css'; // Ensure you have this CSS file for styling

const Sidebar = () => (
  <div className="sidebar">
    <h2>🎧 Music Admin</h2>
    <ul>
      <li><FaHome /><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
      <li><FaUserCog /><NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>User Management</NavLink></li>
      <li><FaMusic /><NavLink to="/songs" className={({ isActive }) => isActive ? 'active' : ''}>Song Management</NavLink></li>
      <li><FaPlusCircle /><NavLink to="/songs/add" className={({ isActive }) => isActive ? 'active' : ''}>Add Song</NavLink></li>
      <li><FaCompactDisc /><NavLink to="/albums" className={({ isActive }) => isActive ? 'active' : ''}>Album Management</NavLink></li>
      <li><FaUserAlt /><NavLink to="/artists" className={({ isActive }) => isActive ? 'active' : ''}>Artist Management</NavLink></li>
      <li><FaTags /><NavLink to="/genres" className={({ isActive }) => isActive ? 'active' : ''}>Genre Management</NavLink></li>
      <li><FaListAlt /><NavLink to="/playlists" className={({ isActive }) => isActive ? 'active' : ''}>Playlist Management</NavLink></li>
    </ul>
  </div>
);

export default Sidebar;
