import React from "react";
import PlaylistScroll from "./MainContent/PlaylistScroll";
import { Route, Routes } from "react-router-dom";
import SongDetail from "./SongDetail/SongDetail";
import ArtistScroll from "./MainContent/Artist";
import ArtistProfile from "./ArtistProfile/ArtistProfile";
import ScrollToTop from "./ScrollToTop";
const Content = ({ setCurrentSong, setCurrentSongView }) =>{

    return (
        <div style={{padding: "20px"}}>
            <h1>Liked Songs</h1>
            <PlaylistScroll setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView} customClass="song" />
            <h1>Albums</h1>
            <PlaylistScroll setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView} customClass="song" />
            <h1>Artists</h1>
            <ArtistScroll setCurrentSongView={setCurrentSongView} customClass="artist" />
        </div>
    );
};

const LibraryContent = ({ currentSongView, setCurrentSong, setCurrentSongView }) => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<>
                    <Content setCurrentSong={setCurrentSong} setCurrentSongView={setCurrentSongView} />
                </>} />

                <Route path="/song" element={<SongDetail currentSongView={currentSongView} setCurrentSong={setCurrentSong}/>} />
                <Route path="/artist" element={<ArtistProfile currentSongView={currentSongView} setCurrentSong={setCurrentSong}/>} />
            </Routes>
        </>
    );
};


export default LibraryContent;