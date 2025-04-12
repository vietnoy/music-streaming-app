import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import '../../css/artistProfile.css';

const PopularSongs = ({ songs, setCurrentSong }) => {
    return (
        <div className="popular-section">
            <h2>Popular</h2>
            <div className="songs-list">
                {songs.map((song, index) => (
                    <div key={song.id} className="song-row">
                        <div className="song-number">{index + 1}</div>
                        <FaPlay 
                            className="popular-play-btn" 
                            onClick={() => setCurrentSong({
                                song: song.title,
                                artist: "Kendrick Lamar",
                                image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg"
                            })}
                        />
                        <div className="song-cover">
                            <img src={`https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg`} alt={song.title} />
                        </div>
                        <div className="song-info">
                            <div className="song-title">
                                {song.title}
                                <div className="song-badges">
                                    {song.isExplicit && <span className="badge explicit">E</span>}
                                    {song.isVideo && <span className="badge video">VIDEO</span>}
                                </div>
                            </div>
                            <div className="song-plays">{song.plays}</div>
                        </div>
                        <div className="song-actions">
                            <FiPlusCircle className="popular-add-btn" />
                            <span className="song-duration">{song.duration}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularSongs; 