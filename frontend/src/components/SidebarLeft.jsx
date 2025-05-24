import React, {useEffect, useState, useRef} from "react";
import "../styles/SidebarLeft.css";
import { FaPlus, FaAngleRight, FaAngleLeft, FaSearch, FaChevronDown} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const SidebarLeft = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [components, setComponents] = useState([]); // Store fetched playlists
  const [filter, setFilter] = useState(null);
  const [sortType, setSortType] = useState("created_at");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "", coverImage: null });
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // optional: close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const sidebarRef = useRef(null);
  const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
  
        const res = await authFetch(`${API_BASE}/api/music/user_playlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error("Failed to fetch playlists");
  
        const data = await res.json();
  
        const processed = await Promise.all(
          data.map(async (item) => {
            // If it's a regular user-created playlist
            if (item.type === "playlist") {
              return {
                id: item.id,
                name: item.name,
                type: item.type,
                owner: item.owner_name,
                image: item.cover_image_url,
                created_at: item.created_at,
              };
            }
        
            // If it's artist/single/composite → fetch additional info
            let name = item.name;
            let owner = item.owner_name;
            let image = item.cover_image_url
        
            try {
              if (item.type === "artist") {
                const res = await fetch(`${API_BASE}/api/music/artist/${item.id}`);
                const artistData = await res.json();
                name = artistData.name;
                owner = artistData.name;
                image = artistData.profile_image_url;
              } else if (item.type === "single" || item.type === "composite") {
                const res = await fetch(`${API_BASE}/api/music/album/${item.id}`);
                const albumData = await res.json();
                name = albumData.name;
                owner = albumData.artist_name;
                image = albumData.cover_image_url;
              }
            } catch (err) {
              console.error(`Failed to fetch ${item.type} info for ID ${item.id}`, err);
            }
        
            return {
              id: item.id,
              name,
              type: item.type,
              owner,
              image: image || "/default_cover.jpg",
              created_at: item.created_at,
            };
          })
        );
  
        setComponents(processed);
      } catch (err) {
        console.error("Error loading playlists:", err);
      }
    };
  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
  
      // Close search only if it's empty
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        searchTerm.trim() === ""
      ) {
        setShowSearchBox(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchTerm]);

  const filteredComponents = components.filter((item) => {
    const bool1 = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const bool2 = filter
      ? filter === "album"
        ? item.type.toLowerCase().includes("single") || item.type.toLowerCase().includes("composite")
        : item.type.toLowerCase().includes(filter)
      : true;
    return bool1 && bool2;
  })
  .sort((a, b) => {
    if (sortType === "created_at") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  console.log(filteredComponents)

  const handleCreatePlaylist = async () => {
    const formData = new FormData();
    formData.append("name", newPlaylist.name);
    formData.append("description", newPlaylist.description || "");

    if (newPlaylist.coverImage) {
      formData.append("cover_image", newPlaylist.coverImage);
    }

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const res = await authFetch(`${API_BASE}/api/music/user/create_playlist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!res.ok) throw new Error("Failed to create playlist");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      alert("Playlist created!");
      setShowCreateForm(false);
      setNewPlaylist({ name: "", description: "", coverImage: null });
      fetchPlaylists();
      // window.location.reload();
    } catch (err) {
      console.error("Create playlist error:", err);
      alert("Failed to create playlist");
    }
};


  return (
    <aside
      ref={sidebarRef}
      className={`sidebar-left ${expanded ? "expanded" : ""}`}
    >
      <div className={"library-header"}>
        <h2>Your Library</h2>
        <div className="header-actions">
          <button className="create-button" onClick={() => setShowCreateForm(true)}>
            <FaPlus />
            <span>Create</span>
          </button>
          <button
            className="expand-toggle"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? "Show less" : "Show more"}
          >
            {expanded ? <FaAngleLeft /> : <FaAngleRight />}
          </button>
        </div>
      </div>
      {showCreateForm && (
        <div className="create-playlist-modal">
          <div className="modal-content">
            <h3>Create Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
            />
            <label className="custom-file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPlaylist({ ...newPlaylist, coverImage: e.target.files[0] })}
              />
              Upload Cover Image
            </label>
            <button onClick={handleCreatePlaylist}>Create</button>
            <button onClick={() => setShowCreateForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {!expanded ? (
        <div className="filters">
            <button
              className={`filter-btn ${filter === "playlist" ? "active" : ""}`}
              onClick={() => setFilter(filter === "playlist" ? null : "playlist")}
            >
              Playlists
            </button>
            <button
              className={`filter-btn ${filter === "artist" ? "active" : ""}`}
              onClick={() => setFilter(filter === "artist" ? null : "artist")}
            >
              Artists
            </button>

            <button
              className={`filter-btn ${filter === "album" ? "active" : ""}`}
              onClick={() => setFilter(filter === "album" ? null : "album")}
            >
              Albums
            </button>
        </div>
      ) : (
        <div className="filters">
          <button
            className={`filter-btn ${filter === "playlist" ? "active" : ""}`}
            onClick={() => setFilter(filter === "playlist" ? null : "playlist")}
          >
            Playlists
          </button>
          <button
            className={`filter-btn ${filter === "artist" ? "active" : ""}`}
            onClick={() => setFilter(filter === "artist" ? null : "artist")}
          >
            Artists
          </button>

          <button
            className={`filter-btn ${filter === "album" ? "active" : ""}`}
            onClick={() => setFilter(filter === "album" ? null : "album")}
          >
            Albums
          </button>
          <div className="search-container" ref={searchRef}>
            <button
              className="search-toggle"
              onClick={() => setShowSearchBox(true)}
            >
              <FaSearch className="search-icon" />
            </button>
            <input
              type="text"
              className={`library-search expanded-input ${showSearchBox ? "active" : ""}`}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {expanded ? (
        <div className="library-table">
          <div className="library-table-header">
            <span>Title</span>
            <span>Date Added</span>
            <span>Played</span>
          </div>
          <div className="library-table-body">
            {filteredComponents.map((item, index) => (
              <div 
                className="library-row" key={index}
                onClick={() =>
                  navigate(
                    `/${item.type === "playlist" ? "playlist" : item.type === "artist" ? "artist" : "album"}/${item.id}`
                  )
                } 
                style={{ cursor: "pointer" }}
              >
                <div className="library-title">
                  {item.image ? 
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                  :
                  (<p className="picture-alt">{item.name[0]}</p>)}
                  <div>
                    <div className="playlist-name">{item.name}</div>
                    <div className="playlist-type">
                      {item.type} · {item.owner}
                    </div>
                  </div>
                </div>
                <span className="library-date">
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
                <span className="library-played">{index + 1} hours ago</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="search-icon-row" ref={searchRef}>
            <button
              className="search-toggle"
              onClick={() => setShowSearchBox(true)}
            >
              <FaSearch className="search-icon" />
            </button>
            <input
              type="text"
              className={`library-search collapsed ${showSearchBox ? "active" : ""}`}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="sort-selection" ref={dropdownRef}>
              <div
                className="sort-dropdown"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                <span>sort by</span>
                <FaChevronDown
                  className={`dropdown-icon ${showSortDropdown ? "reverse" : ""}`}
                />
              </div>

              {showSortDropdown && (
                <div className="dropdown-options">
                  <div
                    className={`dropdown-option ${sortType === "created_at" ? "active" : ""}`}
                    onClick={() => {
                      setSortType("created_at");
                      setShowSortDropdown(false);
                    }}
                  >
                    Date Added
                  </div>
                  <div
                    className={`dropdown-option ${sortType === "played" ? "active" : ""}`}
                    onClick={() => {
                      setSortType("played");
                      setShowSortDropdown(false);
                    }}
                  >
                    Played
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="playlist-list">
            {filteredComponents.map((item, index) => (
              <div className="playlist-row" key={index} 
              onClick={() =>
                navigate(
                  `/${item.type === "playlist" ? "playlist" : item.type === "artist" ? "artist" : "album"}/${item.id}`
                )
              } 
              style={{ cursor: "pointer" }}> 
                <div className="playlist-item1" >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <p className="picture-alt">{item.name[0]}</p>
                  )}
                  <div className="playlist-info">
                    <div className="playlist-name">{item.name}</div>
                    <div className="playlist-type">
                      {item.type} · {item.owner}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default SidebarLeft;