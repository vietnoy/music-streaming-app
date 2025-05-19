import React, { useState, useRef, useEffect } from "react";
import "../styles/Navbar.css";
import { FaBell, FaUserCircle, FaChevronDown, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const Navbar = ({ username, profilePicture }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchType, setSearchType] = useState("Track");
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([]); 

  const menuRef = useRef();
  const dropdownRef = useRef();
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRoles = decoded.roles || [];
        setRoles(Array.isArray(userRoles) ? userRoles : [userRoles]);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      setSearchTerm("");
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchType === "Emotion") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchTerm.trim()) return;

    debounceRef.current = setTimeout(() => {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}&filter_by=${searchType.toLowerCase()}`);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, searchType, navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/signin";
  };

  const handleDropdownClick = (type) => {
    setSearchType(type);
    setShowDropdown(false);
  };
  const handleEmotionClick = (type) => {setShowDropdown(false);setSearchType(type);};

  return (
    <header className="navbar">
      <div className="nav-left">
        <img src="/spotify-logo.png" alt="Spotify" className="spotify-logo" />
        <button className="home-b" onClick={() => navigate("/")}>
          <FaHome /> 
        </button>
      </div>

      <div className="nav-center">
        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder={
              searchType === "Emotion"
                ? "How are you feeling today?"
                : "What do you want to play?"
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              window.history.pushState(null, "", `/search?query=${encodeURIComponent(e.target.value)}&filter_by=${searchType.toLowerCase()}`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchType.toLowerCase()=== "emotion") {
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
              {["Track", "Artist", "Album", "Emotion"].map((type) => (
                <div
                  key={type}
                  className="dropdown-item"
                  onClick={() =>
                    type === "Emotion"
                      ? handleEmotionClick(type)
                      : handleDropdownClick(type)
                  }
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
            <button className="button" onClick={() => navigate("/setting")}>Setting</button>
            {roles.includes("admin") && (
              <button className="button" onClick={() => navigate("/database")}>Database</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;