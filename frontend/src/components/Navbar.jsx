import React from "react";
import "../styles/Navbar.css";
import {FaBell, FaUserCircle} from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="navbar">
        <div className="nav-left">
            <img src="/spotify-logo.png" alt="Spotify" className="spotify-logo" />
        </div>

        <div className="nav-center">
            <input type="text" className="search-input" placeholder="What do you want to play?" />
        </div>

        <div className="nav-right">
            <FaBell className="nav-icon" />
            <FaUserCircle className="nav-icon" />
        </div>
    </header>
  );
};

export default Navbar;