import React from "react";
import "../../css/style.css"

const SongHeader = ({ currentSongView }) =>{
    return (
        <div className="song-header">
            <img className="song-artwork" src="https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" alt="Album Artwork" />
            <div className="song-info">
                <h1 className="song-name">{currentSongView.song}</h1>
                <p className="song-artist">{currentSongView.artist}</p>
            </div>
        </div>
    );
}

export default SongHeader;