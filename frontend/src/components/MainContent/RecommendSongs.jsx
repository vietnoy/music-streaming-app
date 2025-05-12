// import React, { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import "../../styles/MainContent/RecommendSongs.css";
// import { usePlayer } from "../../context/PlayerContext";
// import { authFetch } from '../../utils/authFetch';

// const RecommendSongs = ({ title }) => {
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { playSong } = usePlayer();

//   const fetchMp3Url = async (trackName) => {
//     try {
//       const res = await fetch(`http://localhost:8000/api/music/mp3url/${encodeURIComponent(trackName)}`);
//       const data = await res.json();
//       return data.url;
//     } catch (err) {
//       console.error("Lỗi lấy mp3:", err);
//       return null;
//     }
//   };

//   const handlePlaySong = async (trackId) => {
//     const track = songs.find((t) => t.id === trackId);
//     if (!track) return;

//     const rest = songs.filter((t) => t.id !== trackId);

//     try {
//       const mp3Url = await fetchMp3Url(track.title);
//       const enrichedTrack = { ...track, mp3_url: mp3Url };

//       playSong(enrichedTrack, rest);
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const userId = jwtDecode(token).sub;

//     const fetchRecommendations = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const res = await authFetch(`http://localhost:8000/api/music/recommendations/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         setSongs(data);
//       } catch (err) {
//         console.error(err);
//         setError("Oops! Unable to load recommendations 😥");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecommendations();
//   }, []);

//   return (
//     <div className="recommend-section">
//       <h3 className="recommend-title">{title}</h3>

//       {loading && <p style={{ color: "#aaa" }}>🎧 Loading...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loading && !error && (
//         songs.length > 0 ? (
//             <div className="scroll-container">
//             {songs.map((item, index) => (
//                 <div
//                 key={index}
//                 className="music-card"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//                 onClick={() => handlePlaySong(item.id)}
//                 title="Click to play this song"
//                 >
//                 <img src={item.cover_url} alt={item.title} />
//                 <p className="title">{item.title}</p>
//                 <p className="subtitle">{item.artist}</p>
//                 </div>
//             ))}
//             </div>
//         ) : (
//             <p style={{ color: "#ccc" }}>No recommendations available. Try searching for some songs 🎵</p>
//         )
//         )}

//     </div>
//   );
// };

// export default RecommendSongs;
