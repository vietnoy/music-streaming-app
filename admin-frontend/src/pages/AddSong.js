import React from 'react';

const AddSong = () => (
  <div className="content">
    <h2>Add New Song</h2>
    <form className="song-form">
      <input type="text" placeholder="Song Name" />
      <input type="text" placeholder="Artist Name" />
      <input type="text" placeholder="Album Name" />
      <input type="text" placeholder="Genre" />
      <input type="file" accept="audio/*" />
      <button type="submit">Submit</button>
    </form>
  </div>
);

export default AddSong;
