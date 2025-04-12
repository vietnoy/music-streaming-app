import React from 'react';
import { FaPlay } from 'react-icons/fa';
// import { BsThreeDots } from 'react-icons/bs';
import '../../css/artistProfile.css';

const ArtistControls = () => {
    return (
        <div className="artist-controls">
            <button className="play-button">
                <FaPlay />
            </button>
            <button className="follow-button">
                Follow
            </button>
            {/* <button className="more-button">
                <BsThreeDots />
            </button> */}
        </div>
    );
};

export default ArtistControls; 