import React from "react";
import Nav from './Nav';
import PlaylistGrid from "./PlaylistGrid";
import PlaylistScroll from "./PlaylistScroll";
import MusicCollection from "./MusicCollection";
import { Route, Routes } from "react-router-dom";
import SongDetail from "../SongDetail/SongDetail";
import ArtistScroll from "./Artist";


const Content = ({ setCurrentSong, setCurrentSongView }) =>{
    return (
        <div style={{padding: "20px"}}>
        <h1>Part1</h1>
        <PlaylistGrid />
        <h1>Part2</h1>
        <PlaylistScroll setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView} customClass="song" />
        <h1>Part3</h1>
        <PlaylistScroll setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView} customClass="song" />
        <h1>Part4</h1>
        <ArtistScroll setCurrentSongView={setCurrentSongView} customClass="artist" />
      </div>
    );
};
const MainContent = ({ currentSongView, setCurrentSong, setCurrentSongView }) => {
    return (
        <Routes>
            <Route path="/" element={<>
                <Nav />
                <Content setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView} />
            </>} />
            <Route path="/music" element={<>
                <Nav />
                <MusicCollection setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView}/>
            </>} /> 
            <Route path="/song" element={<SongDetail currentSongView={currentSongView} setCurrentSong={setCurrentSong}/>} />
        </Routes>
    );
};

export default MainContent;