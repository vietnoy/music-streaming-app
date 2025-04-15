import React, { useEffect } from "react";
import Nav from './Nav';
import PlaylistGrid from "./PlaylistGrid";
import PlaylistScroll from "./PlaylistScroll";
import MusicCollection from "./MusicCollection";
import { Route, Routes, useLocation } from "react-router-dom";
import SongDetail from "../SongDetail/SongDetail";
import ArtistScroll from "./Artist";
import ArtistProfile from "../ArtistProfile/ArtistProfile";
import ScrollToTop from "../ScrollToTop";
const Content = ({ setCurrentSong, setCurrentSongView }) =>{
    // const location = useLocation();
    
    // useEffect(() => {
    //     document.documentElement.scrollTop = 0;
    //     document.body.scrollTop = 0;
    // }, [location]);

    return (
        <div style={{padding: "0px 20px 20px 20px"}}>
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
        <>
            <ScrollToTop />
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
                <Route path="/artist" element={<ArtistProfile currentSongView={currentSongView} setCurrentSong={setCurrentSong}/>} />
            </Routes>
        </>
    );
};


export default MainContent;