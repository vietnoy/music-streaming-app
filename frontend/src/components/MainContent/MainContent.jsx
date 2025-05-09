import React, { useEffect, useState } from "react";
import SectionScroller from "./SectionScroller";
import RecommendSongs from "./RecommendSongs";
import "../../styles/MainContent/MainContent.css";
import { jwtDecode } from "jwt-decode";
import { authFetch } from '../../utils/authFetch';

const MainContent = () => {
  const [playlists, setPlaylists] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [likedArtists, setLikedArtists] = useState([]);
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).sub : null;

  useEffect(() => {
    if (!userId) return;

    const fetchPlaylists = async () => {
      try {
        const res = await authFetch(`http://localhost:8000/api/music/user_playlist?user_id=${userId}`);
        const data = await res.json();

        // Separate data by type
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.name,
          subtitle: item.owner_name || "",
          image: item.cover_image_url || "/default_cover.jpg",
          type: item.type,
          created_at: item.created_at,
        }));

        setPlaylists(formatted.filter((item) => item.type === "playlist"));
        setSavedAlbums(formatted.filter((item) => item.type === "single" || item.type === "composite"));
        setLikedArtists(formatted.filter((item) => item.type === "artist"));
      } catch (err) {
        console.error("Failed to fetch user library:", err);
      }
    };

    fetchPlaylists();
  }, [userId]);

  return (
    <div className="main-content">
      {playlists.length > 0 && <SectionScroller title="💽 Your Playlists" items={playlists} />}
      {savedAlbums.length > 0 && <SectionScroller title="🎼 Albums You Saved" items={savedAlbums} />}
      {likedArtists.length > 0 && <SectionScroller title="🔥 Artists You Like" items={likedArtists} />}
      <RecommendSongs title="🎵 Recommended for You" />
    </div>
  );
};

export default MainContent;