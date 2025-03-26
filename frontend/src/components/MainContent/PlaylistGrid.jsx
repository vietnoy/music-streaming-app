import React, { useEffect, useState } from 'react';
import '../../css/style.css';

const PlaylistGrid = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const sampleData = [
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', name: 'Playlist 1', subtitle: 'Subtitle 1' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', name: 'Playlist 2', subtitle: 'Subtitle 2' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', name: 'Playlist 3', subtitle: 'Subtitle 3' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', name: 'Playlist 4', subtitle: 'Subtitle 4' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', name: 'Playlist 1', subtitle: 'Subtitle 1' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', name: 'Playlist 2', subtitle: 'Subtitle 2' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', name: 'Playlist 3', subtitle: 'Subtitle 3' },
      { image: 'https://i.pinimg.com/736x/d5/62/d4/d562d4205927c8d1ca5eed0adcaaa25d.jpg', name: 'Playlist 4', subtitle: 'Subtitle 4' },
    ];
    setPlaylists(sampleData);
  }, []);

  return (
    <div className="grid-container">
      {playlists.map((playlist, index) => (
        <div key={index} className="grid-item">
          <img src={playlist.image} alt={playlist.name} />
          <div className="text-content">
            <span className="title">{playlist.name}</span>
            <span className="subtitle">{playlist.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistGrid;
