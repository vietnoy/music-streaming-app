import React, { useEffect } from 'react';
import ArtistHeader from './ArtistHeader';
import ArtistControls from './ArtistControls';
import PopularSongs from './PopularSongs';
import '../../css/artistProfile.css';

const ArtistProfile = ({ setCurrentSong }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const popularSongs = [
        {
            id: 1,
            title: "luther (with sza)",
            plays: "746,387,556",
            duration: "2:57",
            isExplicit: true
        },
        {
            id: 2,
            title: "Not Like Us",
            plays: "1,374,832,126",
            duration: "4:34",
            isExplicit: true,
            isVideo: true
        },
        {
            id: 3,
            title: "All The Stars (with SZA)",
            plays: "2,225,439,267",
            duration: "3:52",
            isExplicit: true,
            isVideo: true
        },
        {
            id: 4,
            title: "tv off (feat. lefty gunplay)",
            plays: "467,762,307",
            duration: "3:40",
            isExplicit: true
        }
    ];

    return (
        <div className="artist-profile">
            <ArtistHeader 
                name="Kendrick Lamar"
                monthlyListeners="99,230,741"
            />
            <ArtistControls />
            <PopularSongs songs={popularSongs} setCurrentSong={setCurrentSong} />
        </div>
    );
};

export default ArtistProfile; 