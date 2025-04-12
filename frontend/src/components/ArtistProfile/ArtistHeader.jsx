import React from 'react';
// import { FaCheck } from 'react-icons/fa';
import '../../css/artistProfile.css';

const ArtistHeader = ({ name, monthlyListeners }) => {
    return (
        <div className="artist-header">
            {/* <div className="verified-badge">
                <FaCheck /> Verified Artist
            </div> */}
            <h1 className="artist-name">{name}</h1>
            <div className="monthly-listeners">
                {monthlyListeners} monthly listeners
            </div>
        </div>
    );
};

export default ArtistHeader; 