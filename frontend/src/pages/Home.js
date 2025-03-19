import React, { useState } from "react";
import MusicPlayer from '../components/MusicPlayer';
import Navbar from '../components/Navbar';
import '../css/style.css';
import PlaylistGrid from '../components/PlaylistGrid';
import PlaylistScroll from '../components/PlaylistScroll'
import RightContent from '../components/RightContent';


const Home = () => {
  const [currentSong, setCurrentSong] = useState({
    song: "No song playing",
    artist: "",
    image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg"
  });
  return (
      <div className='home_style'>
        <Navbar />
        <div className='content'>
          <div className="left-content"> 
            {Array.from({ length: 30 }).map((_, index) => (
              <p key={index}>Left Sidebar item {index + 1}</p>
            ))}
          </div>

          <div className="center-content">
            <h1>Part1</h1>
            <PlaylistGrid />
            <h1>Part2</h1>
            <PlaylistScroll setCurrentSong={setCurrentSong} customClass="song"/>
            <h1>Part3</h1>
            <PlaylistScroll setCurrentSong={setCurrentSong} customClass="song"/>
            <h1>Part4</h1>
            <PlaylistScroll setCurrentSong={setCurrentSong} customClass="artist"/>
          </div>

          <div className="right-content">
            <RightContent currentSong={currentSong}/>
          </div>
        </div>
        <MusicPlayer currentSong={currentSong}/>
      </div>
  );
};

export default Home;
