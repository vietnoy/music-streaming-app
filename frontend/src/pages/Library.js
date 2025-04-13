import React, { useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import Navbar from "../components/Navbar";
import RightContent from "../components/RightContent";
import LibraryContent from "../components/LibraryContent";
import LeftContent from "../components/LeftContent";


const Library = () => {
  const [currentSong, setCurrentSong] = useState({
    song: "No song playing",
    artist: "",
    image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg",
  });

  const [currentSongView, setCurrentSongView] = useState({
    song: "No song playing",
    artist: "",
    image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg",
  });

  return (
    <div className="home_style">
      <Navbar />
      <div className="content">
        <div className="left-content">
          <LeftContent />
        </div>

        <div className="center-content">
          <LibraryContent currentSongView={currentSongView} setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView}/>
          {/* <MainContent currentSongView={currentSongView} setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView}/> */}
        </div>

        <div className="right-content">
          <RightContent currentSong={currentSong} />
        </div>
      </div>

      <MusicPlayer currentSong={currentSong} />
    </div>
  );
};

export default Library;
