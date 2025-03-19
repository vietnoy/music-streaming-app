import React from 'react';
import { FaSpotify, FaSearch, FaUserCircle } from 'react-icons/fa';
import { CiHome } from "react-icons/ci";
import { IoSettingsSharp } from 'react-icons/io5';
import '../css/style.css';

const Navbar = () => {
  // const navigate = useNavigate();
  return (
    <div className='navbar'>
      <FaSpotify size={30} style={{ color: 'white' }}/>
      
      <div className='center-group'>
        <CiHome size={30} className='home-icon' style={{ color: 'white' }} />
        <div className='input-container'>
          <FaSearch className='input-icon' style={{ color: 'white' }} />
          <input type="text" className='search' placeholder='Search...' />
        </div>
      </div>
      
      <FaUserCircle size={30} style={{ color: 'white' }} />
    </div>
  );
};


export default Navbar;
