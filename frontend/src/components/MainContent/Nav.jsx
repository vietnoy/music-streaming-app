import React from "react";
import {Link} from "react-router-dom"

const Nav = () => {
  return (
    
      <nav style={{ position: "sticky", top: 0 }}>
        <Link to="/" className="nav-btn">All</Link>
        <Link to="/music" className="nav-btn">Music</Link> 
      </nav>
    
  );
};

export default Nav;