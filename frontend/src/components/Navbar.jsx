import React from 'react';
import { FaSpotify, FaSearch, FaUserCircle } from 'react-icons/fa';
import { CiHome } from "react-icons/ci";
import '../css/style.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // const navigate = useNavigate();
  return (
      <div className='navbar'>
        <FaSpotify size={30} style={{ color: 'white', marginLeft: '15px' }}/>
        
        <div className='center-group'>
          <Link to="/" className='home-link'>
            <CiHome size={30} className='home-icon' style={{ color: 'white' }} />
          </Link>
          <div className='input-container'>
            <FaSearch className='input-icon' style={{ color: 'white' }} />
            <input type="text" className='search' placeholder='Search...' />
          </div>
        </div>
        
        <FaUserCircle size={30} style={{ color: 'white',marginRight: '15px' }} />
      </div>
  );
};


export default Navbar;
