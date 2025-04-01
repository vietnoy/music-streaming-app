import React from "react";
import '../../css/style.css';
import { FaPlay } from "react-icons/fa";

const SongControls = ({ currentSongView ,setCurrentSong }) => {
    return (
        <div className="song-controls">
            <div className="play-icon">
                <FaPlay 
                onClick={() => {
                    setCurrentSong({
                        song: currentSongView.song,
                        artist: currentSongView.artist,
                        image: currentSongView.image
                    });
                }}
                />
            </div>
        </div>
    );
}

export default SongControls;

