import React, { useState } from 'react';
import { FaSpotify, FaSearch, FaUserCircle } from 'react-icons/fa';
import { CiHome } from "react-icons/ci";
import '../css/style.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.input-container')) {
      setIsSearchExpanded(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='navbar'>
      <FaSpotify size={30} style={{ color: 'white', marginLeft: '15px' }}/>
      
      <div className='center-group'>
        <Link to="/" className='home-link'>
          <CiHome size={30} className='home-icon' style={{ color: 'white' }} />
        </Link>
        <div className={`input-container ${isSearchExpanded ? 'expanded' : ''}`}>
          <FaSearch 
            className='input-icon' 
            style={{ color: 'white' }} 
            onClick={handleSearchClick}
          />
          <input 
            type="text" 
            className='search' 
            placeholder='Search...'
          />
        </div>
      </div>
      
      <FaUserCircle size={30} style={{ color: 'white', marginRight: '15px' }} />
    </div>
  );
};

export default Navbar;