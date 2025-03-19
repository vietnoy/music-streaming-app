import React from "react";
import '../css/style.css'

const MusicPlayer = ({ currentSong }) => {
    return (
        <div className="musicPlayer">
            <div className="left">
                <img src={currentSong.image} alt="" />
                <div className="text-content">
                    <span className="song-name">{currentSong.song}</span>
                    <span className="artist-name">{currentSong.artist}</span>
                </div>
            </div>
            <div className="center">Center</div>
            <div className="right">Right</div>
        </div>
    );
}

export default MusicPlayer;