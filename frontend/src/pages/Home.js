import React, { useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import Navbar from "../components/Navbar";
import RightContent from "../components/RightContent";
import MainContent from "../components/MainContent/MainContent";

const Home = () => {
  const [currentSong, setCurrentSong] = useState({
    song: "No song playing",
    artist: "",
    image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg",
  });

  const [currentSongView, setCurrentSongView] = useState([]);

  return (
    <div className="home_style">
      <Navbar />
      <div className="content">
        <div className="left-content">
          {Array.from({ length: 30 }).map((_, index) => (
            <p key={index}>Left Sidebar item {index + 1}</p>
          ))}
        </div>

        <div className="center-content">
          <MainContent currentSongView={currentSongView} setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView}/>
        </div>

        <div className="right-content">
          <RightContent currentSong={currentSong} />
        </div>
      </div>

      <MusicPlayer currentSong={currentSong} />
    </div>
  );
};

export default Home;
