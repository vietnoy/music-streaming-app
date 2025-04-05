import React from 'react';
import '../../css/style.css';
import '../../css/songDetail.css';
import { FaPlay } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';

const SongList = ({ setCurrentSong }) => {
    const songs = [
        { id: 1, title: "Khi anh nhớ", artist: "Hào", duration: "0:55" },
        { id: 2, title: "Lời hứa", artist: "Hào", duration: "2:36" },
        { id: 3, title: "Có khóc cũng thế thôi", artist: "Hào", duration: "4:15" },
        { id: 4, title: "Kính Cận", artist: "Hào", duration: "3:50" },
        { id: 5, title: "Lỡ nghe", artist: "Hào", duration: "3:09" },
        { id: 6, title: "Cỗ máy", artist: "Hào", duration: "5:15" },
        { id: 7, title: "Chúng Ta", artist: "Hào", duration: "4:20" }
    ];

    return (
        <div className="song-list">
            <div className="song-list-header">
                <div className="song-number">#</div>
                <div className="song-title">Title</div>
                <div className="song-duration">Duration</div>
            </div>
            {songs.map((song, index) => (
                <div key={song.id} className="song-item">
                    <div className="song-number">{index + 1}</div>
                    <div className="song-info">
                        <div className="song-title">{song.title}</div>
                        <div className="song-artist">{song.artist}</div>
                    </div>
                    <div className="song-actions">
                        <FaPlay className="play-btn" 
                            onClick={() => setCurrentSong({
                                song: song.title,
                                artist: song.artist,
                                image: "https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg" 
                            })}
                        />
                        <FiPlusCircle className="add-btn" />
                        <span className="song-duration">{song.duration}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SongList; 