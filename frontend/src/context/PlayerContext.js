import React, { createContext, useState, useContext } from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song, remainingQueue = []) => {
    setCurrentSong(song);
    setQueue(remainingQueue);
    setIsPlaying(true);
  };

  const stop = () => {
    setIsPlaying(false);
  };

  const nextSong = async () => {
    if (queue.length === 0) {
      setIsPlaying(false);
      return;
    }
    const [next, ...rest] = queue;
    const res = await fetch(`http://localhost:8000/api/music/mp3url/${encodeURIComponent(next.track_name)}`);
    const data = await res.json();
    const enrichedNext = { ...next, mp3_url: data.url };
  
    setCurrentSong(enrichedNext);
    setQueue(rest);
    setIsPlaying(true);
  };

  const prevSong = () => {
    console.log("Previous song clicked (not implemented yet)");
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        playSong,
        setQueue,
        stop,
        nextSong,
        prevSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};