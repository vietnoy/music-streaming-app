import React, { useState } from "react";
import '../css/MusicPlayer.css'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedo } from 'react-icons/fa';
import { HiOutlineQueueList } from "react-icons/hi2";
import { MdDevices } from "react-icons/md";

const MusicPlayer = ({ currentSong }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);

    return (
        <div className="musicPlayer">
            <div className="left">
                <img src={currentSong.image} alt="" />
                <div className="text-content">
                    <span className="song-name">{currentSong.song}</span>
                    <span className="artist-name">{currentSong.artist}</span>
                </div>
            </div>
            <div className="center">
                <div className="controls">
                    <div className="control-buttons">
                        <button className="control-btn">
                            <FaRandom />
                        </button>
                        <button className="control-btn">
                            <FaStepBackward />
                        </button>
                        <button className="control-btn play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        <button className="control-btn">
                            <FaStepForward />
                        </button>
                        <button className="control-btn">
                            <FaRedo />
                        </button>
                    </div>
                    <div className="progress-bar">
                        <span className="time-text">0:00</span>
                        <div className="progress">
                            <div className="progress-filled"></div>
                        </div>
                        <span className="time-text">0:00</span>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="volume-control">
                    <FaVolumeUp  size={20}/>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="volume-slider"
                    />
                </div>
                <div>
                    <button className="queue-btn"><HiOutlineQueueList size={20} /></button>
                    <button className="queue-btn"><MdDevices size={20} /></button>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;