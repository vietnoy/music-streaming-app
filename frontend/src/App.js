import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import MainContent from "./components/MainContent/MainContent";
import PlaylistPage from "./components/MainContent/PlaylistPage";
import AlbumPage from "./components/MainContent/AlbumPage";
import ArtistPage from "./components/MainContent/ArtistPage";
import SearchPage from "./components/MainContent/SearchPage";

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected layout */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route index element={<MainContent />} />
            <Route path="playlist/:playlistId" element={<PlaylistPage />} />
            <Route path="album/:albumId" element={<AlbumPage />} />
            <Route path="artist/:artistId" element={<ArtistPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

export default App;