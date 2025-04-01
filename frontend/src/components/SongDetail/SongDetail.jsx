import React from 'react';
import SongHeader from './SongHeader';
import SongControls from './SongControls';


const SongDetail = ({ currentSongView, setCurrentSong}) => {
  return (
      <div>
        <SongHeader currentSongView={currentSongView}/>
        <SongControls currentSongView={currentSongView} setCurrentSong={setCurrentSong}/>
      </div>
  );
};

export default SongDetail;