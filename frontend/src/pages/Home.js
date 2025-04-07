import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SidebarLeft from "../components/SidebarLeft";
import MainContent from "../components/MainContent/MainContent";
import RightContent from "../components/RightContent";
import MusicPlayer from "../components/MusicPlayer";
import "../styles/MainContent/Home.css";

const Home = () => {
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
    <div className="home">
      <Navbar />
      <div className="home-content">
        <SidebarLeft />
        <MainContent
          currentSongView={currentSongView}
          setCurrentSong={setCurrentSong}
          setCurrentSongView={setCurrentSongView}
        />
        <RightContent currentSong={currentSong} />
      </div>
      <MusicPlayer currentSong={currentSong} />
    </div>
  );
};

export default Home;