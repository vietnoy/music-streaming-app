import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";
import { API_ENDPOINTS } from '../config';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);

  const playSong = (song, remainingQueue = []) => {
    if (currentSong) {
      setHistory((prev) => [...prev, currentSong]); 
    }
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

    if (currentSong) {
      setHistory((prev) => [...prev, currentSong]);
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.MUSIC.MP3_URL}/${encodeURIComponent(next.track_name)}`);
      const data = await res.json();
      const enrichedNext = { ...next, mp3_url: data.url };

      setCurrentSong(enrichedNext);
      setQueue(rest);
      setIsPlaying(true);
    } catch (err) {
      console.error("Error fetching next song URL", err);
    }
  };

  const prevSong = async () => {
    if (history.length === 0) {
      console.log("No previous song to play.");
      return;
    }

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1); 
    const newQueue = currentSong ? [currentSong, ...queue] : queue;

    try {
      const res = await fetch(`${API_ENDPOINTS.MUSIC.MP3_URL}/${encodeURIComponent(previous.track_name)}`);
      const data = await res.json();
      const enrichedPrev = { ...previous, mp3_url: data.url };

      setCurrentSong(enrichedPrev);
      setQueue(newQueue);
      setHistory(newHistory);
      setIsPlaying(true);
    } catch (err) {
      console.error("Error fetching previous song URL", err);
    }
  };

  const removeFromQueue = (trackId) => {
    setQueue(prevQueue => prevQueue.filter(track => track.id !== trackId));
  };

  useEffect(() => {
  console.log("Current song in context:", currentSong);
}, [currentSong]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        history,
        isPlaying,
        playSong,
        setQueue,
        stop,
        nextSong,
        prevSong,
        removeFromQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
