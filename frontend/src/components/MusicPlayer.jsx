import React, { useState } from "react";
import '../css/style.css'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedo } from 'react-icons/fa';

const MusicPlayer = ({ currentSong }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);

    const styles = {
        controls: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
        },
        controlButtons: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        controlBtn: {
            background: 'none',
            border: 'none',
            color: '#b3b3b3',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px',
            transition: 'color 0.2s'
        },
        playBtn: {
            color: '#fff',
            fontSize: '24px'
        },
        progressBar: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            width: '100%',
            maxWidth: '400px'
        },
        progress: {
            flex: 1,
            height: '3px',
            background: '#404040',
            borderRadius: '2px',
            cursor: 'pointer'
        },
        progressFilled: {
            width: '30%',
            height: '100%',
            background: '#1db954',
            borderRadius: '2px'
        },
        timeText: {
            color: '#b3b3b3',
            fontSize: '10px',
            minWidth: '30px'
        },
        volumeControl: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#b3b3b3'
        },
        volumeSlider: {
            width: '80px',
            height: '3px',
            WebkitAppearance: 'none',
            background: '#404040',
            borderRadius: '2px',
            cursor: 'pointer'
        },
        volumeSliderThumb: {
            WebkitAppearance: 'none',
            width: '8px',
            height: '8px',
            background: '#fff',
            borderRadius: '50%',
            cursor: 'pointer'
        },
        queueBtn: {
            background: 'none',
            border: 'none',
            color: '#b3b3b3',
            cursor: 'pointer',
            fontSize: '12px',
            padding: '4px',
            transition: 'color 0.2s'
        }
    };

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
                <div style={styles.controls}>
                    <div style={styles.controlButtons}>
                        <button style={styles.controlBtn}>
                            <FaRandom />
                        </button>
                        <button style={styles.controlBtn}>
                            <FaStepBackward />
                        </button>
                        <button style={{...styles.controlBtn, ...styles.playBtn}} onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        <button style={styles.controlBtn}>
                            <FaStepForward />
                        </button>
                        <button style={styles.controlBtn}>
                            <FaRedo />
                        </button>
                    </div>
                    <div style={styles.progressBar}>
                        <span style={styles.timeText}>0:00</span>
                        <div style={styles.progress}>
                            <div style={styles.progressFilled}></div>
                        </div>
                        <span style={styles.timeText}>0:00</span>
                    </div>
                </div>
            </div>
            <div className="right">
                <div style={styles.volumeControl}>
                    <FaVolumeUp />
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        style={styles.volumeSlider}
                    />
                </div>
                <button style={styles.queueBtn}>Queue</button>
                <button style={styles.queueBtn}>Devices</button>
            </div>
        </div>
    );
}

export default MusicPlayer;