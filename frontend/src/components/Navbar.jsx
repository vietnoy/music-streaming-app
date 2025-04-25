import React, { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";
import { FaBell, FaUserCircle, FaChevronDown, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = ({ username, profilePicture }) => {

  // inside Navbar component
  const location = useLocation();

  // Clear search input if route changes away from `/search`
  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      setSearchTerm("");
    }
  }, [location]);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchType, setSearchType] = useState("Track");
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef();
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "";

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/signin";
  };

  const handleDropdownClick = (type) => {
    setSearchType(type);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchTerm.trim()) return;

    debounceRef.current = setTimeout(() => {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}&filter_by=${searchType.toLowerCase()}`);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, searchType, navigate]);

  return (
    <header className="navbar">
      <div className="nav-left">
        <img src="/spotify-logo.png" alt="Spotify" className="spotify-logo" />
        <button className="home-button" onClick={() => navigate("/")}>
          <FaHome /> 
        </button>
      </div>

      <div className="nav-center">
        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder={`What do you want to play?`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              window.history.pushState(null, "", `/search?query=${encodeURIComponent(e.target.value)}&filter_by=${searchType.toLowerCase()}`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                navigate(`/search?query=${encodeURIComponent(searchTerm)}&filter_by=${searchType.toLowerCase()}`);
              }
            }}
          />
          <div className="search-filter-wrapper" ref={dropdownRef}>
            <div
              className={`search-filter-button ${showDropdown ? "open" : ""}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Search by {searchType} <FaChevronDown className="arrow-icon" />
            </div>
            <div className={`search-filter-dropdown ${showDropdown ? "show" : ""}`}>
              {["Track", "Artist", "Album"].map((type) => (
                <div
                  key={type}
                  className="dropdown-item"
                  onClick={() => handleDropdownClick(type)}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="nav-right">
        <FaBell className="nav-icon" />
        <div
          className="profile-wrapper"
          ref={menuRef}
          onClick={() => setShowMenu(!showMenu)}
        >
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="profile-pic" />
          ) : username ? (
            <div className="profile-initial">{getInitial(username)}</div>
          ) : (
            <FaUserCircle className="nav-icon" />
          )}
          <div className={`dropdown-menu ${showMenu ? "show" : ""}`}>
            <button className="button" onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;