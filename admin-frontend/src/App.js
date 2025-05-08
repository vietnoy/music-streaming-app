import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import SongManagement from './pages/SongManagement';
import AddSong from './pages/AddSong';
import AlbumManagement from './pages/AlbumManagement';
import ArtistManagement from './pages/ArtistManagement';
import GenreManagement from './pages/GenreManagement';
import PlaylistManagement from './pages/PlaylistManagement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/songs" element={<SongManagement />} />
            <Route path="/songs/add" element={<AddSong />} />
            <Route path="/albums" element={<AlbumManagement />} />
            <Route path="/artists" element={<ArtistManagement />} />
            <Route path="/genres" element={<GenreManagement />} />
            <Route path="/playlists" element={<PlaylistManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;