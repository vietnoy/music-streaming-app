export const API_BASE_URL = "https://backend-music-streaming-app-615268981826.asia-northeast1.run.app";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE_URL}/api/auth/signin`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh-token`,
  },
  USER: {
    ME: `${API_BASE_URL}/api/user/me`,
  },
  MUSIC: {
    SEARCH: `${API_BASE_URL}/api/music/search`,
    MP3_URL: `${API_BASE_URL}/api/music/mp3url`,
    RECOMMENDATIONS: `${API_BASE_URL}/api/music/recommendations`,
    EMOTION_RECOMMENDATIONS: `${API_BASE_URL}/api/music/recommendations/emotion`,
    ARTIST: `${API_BASE_URL}/api/music/artist`,
    ALBUM: `${API_BASE_URL}/api/music/album`,
    USER_PLAYLIST: `${API_BASE_URL}/api/music/user_playlist`,
    CREATE_PLAYLIST: `${API_BASE_URL}/api/music/user/create_playlist`,
    PLAYLIST: `${API_BASE_URL}/api/music/playlist`,
    LIKED_TRACKS_IDS: `${API_BASE_URL}/api/music/user/liked_track_ids`,
    LIKED_TRACKS: `${API_BASE_URL}/api/music/user/liked_track`, 
    ADD_TO_PLAYLIST: `${API_BASE_URL}/api/music/user/add_track_to_playlist`,
    ASK: `${API_BASE_URL}/api/music/ask`,
    LIBRARY: `${API_BASE_URL}/api/music/library`,
    ADD_TO_LIBRARY: `${API_BASE_URL}/api/music/add_to_library`,
    REMOVE_FROM_LIBRARY: `${API_BASE_URL}/api/music/remove_from_library`,
    RELATED: `${API_BASE_URL}/api/music/related`,
  },

  DATABASE: {
    BASE: `${API_BASE_URL}/api/database`,
    TABLES: `${API_BASE_URL}/api/database/tables`,
    OVERVIEW: `${API_BASE_URL}/api/database/overview`,
  },
}; 