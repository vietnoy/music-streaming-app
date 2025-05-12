import React, { useEffect, useState } from "react";
import SectionScroller from "./SectionScroller";
import "../../styles/MainContent/MainContent.css";
import { jwtDecode } from "jwt-decode";

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
        const res = await fetch(`http://localhost:8000/api/music/user_playlist?user_id=${userId}`);
        const data = await res.json();

        const formatted = await Promise.all(data.map(async (item) => {
          try {
            let image = item.cover_image_url;
            let title = item.name;
        
            if (item.type === "artist") {
              const res = await fetch(`http://localhost:8000/api/music/artist/${item.id}`);
              const data = await res.json();
              image = data.profile_image_url;
              title = data.name;
            } else if (item.type === "single" || item.type === "composite") {
              const res = await fetch(`http://localhost:8000/api/music/album/${item.id}`);
              const data = await res.json();
              image = data.cover_image_url;
              title = data.name;
            }
        
            return {
              id: item.id,
              title: title,
              subtitle: item.owner_name || "",
              image: image,
              type: item.type,
              created_at: item.created_at,
            };
          } catch (err) {
            console.error("Failed to fetch user library:", err);
            return null;
          }
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
    </div>
  );
};

export default MainContent;