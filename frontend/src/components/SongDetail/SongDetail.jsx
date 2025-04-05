import React from 'react';
import SongHeader from './SongHeader';
import SongControls from './SongControls';
import SongList from './SongList';


const SongDetail = ({ currentSongView, setCurrentSong}) => {
  return (
      <div>
        <SongHeader currentSongView={currentSongView}/>
        <SongControls currentSongView={currentSongView} setCurrentSong={setCurrentSong}/>
        <SongList currentSongView={currentSongView} setCurrentSong={setCurrentSong}/>
      </div>
  );
};

export default SongDetail;