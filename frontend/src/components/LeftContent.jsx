import React from "react";
import { LuLibraryBig } from "react-icons/lu";
// import { GoPlus } from "react-icons/go";
import "../css/LeftContent.css"
import { Link } from "react-router-dom";

const playlists = [
  { id: 1, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 2, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 3, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 4, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 5, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 6, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 7, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 8, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 9, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 6, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 7, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 8, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
  { id: 9, image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" },
];

const LeftContent = () => {
  return (
    <>
      <Link to="/library">
        <div className="icon-lib">
          <LuLibraryBig size={30} color="white" />
        </div>
      </Link>
      <div className="icon-plus">
        {/* <GoPlus size={24} color="white" /> */}
      </div>
      <div className="playlist-section">
        {playlists.map((playlist) => (
          <img
            key={playlist.id}
            src={playlist.image}
            alt={`Playlist ${playlist.id}`}
            className="playlist-img"
          />
        ))}
      </div>
      </>
  );
};

export default LeftContent;
