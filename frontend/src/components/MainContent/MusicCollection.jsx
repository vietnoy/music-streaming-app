import React from "react";
import PlaylistGrid from "./PlaylistGrid";
import PlaylistScroll from "./PlaylistScroll";

const MusicCollection = ({ setCurrentSong, setCurrentSongView }) => {
    return (
      <div style={{padding: "0px 20px 20px 20px"}}>
        <h1>Part1</h1>
        <PlaylistGrid />
        <h1>Part2</h1>
        <PlaylistScroll setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView} customClass="song" />
      </div>
    );
  };

export default MusicCollection;