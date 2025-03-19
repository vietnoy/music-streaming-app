import React from "react"
import '../css/style.css'

const RightContent = ( { currentSong } ) =>{
    return (
        <div>
            <img src={currentSong.image} alt="" />
            <div className="text-content">
                <span className="song-name">{currentSong.song}</span>
                <span className="artist-name">{currentSong.artist}</span>
            </div>
        </div>
    );
}

export default RightContent;