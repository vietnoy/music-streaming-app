import React from "react";
import '../../css/style.css';
import { FaPlay } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

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
            <div className="plus-icon">
                <FiPlusCircle />
            </div>
        </div>
    );
}

export default SongControls;

