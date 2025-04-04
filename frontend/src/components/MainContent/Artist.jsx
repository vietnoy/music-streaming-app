import React, { useEffect, useState, useRef } from 'react';
import '../../css/style.css';
import { Link } from 'react-router-dom';


const ArtistScroll = ({setCurrentSongView ,customClass}) => {
  const [playlists, setPlaylists] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const sampleData = [
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 1', artist: 'Artist A' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 2', artist: 'Artist B' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 3', artist: 'Artist C' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 4', artist: 'Artist D' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 5', artist: 'Artist E' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 6', artist: 'Artist F' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 7', artist: 'Artist G' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 8', artist: 'Artist H' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 9', artist: 'Artist I' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', song: 'Song 10', artist: 'Artist J' }
    ];    
    setPlaylists(sampleData);
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 500, behavior: 'smooth' });
  };

  return (
    <div className={`playlist-wrapper ${customClass}`}>
      <button className="scroll-btn left-btn" onClick={scrollLeft}>←</button>
      <div className="scroll-container" ref={scrollContainerRef}>
        {playlists.map((playlist, index) => (
          <Link to="/song">
            <div 
            key={index} 
            className="playlist-item" 
            onClick={() => setCurrentSongView({
              song: playlist.song,
              artist: playlist.artist,
              image: playlist.image
            })}
            >
              <div className='image-container'>
                <img src={playlist.image} alt={playlist.song} className="playlist-image" />
              </div>
              <div className="text-content">  
                <span className="playlist-title">{playlist.song}</span>
                <span className="playlist-description">{playlist.artist}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <button className="scroll-btn right-btn" onClick={scrollRight}>→</button>
    </div>
  );
};

export default ArtistScroll;
