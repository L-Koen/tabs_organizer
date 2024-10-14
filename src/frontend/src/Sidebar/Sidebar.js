import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './Sidebar.css';

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li>  {/* Link to the home route */}
        <li><Link to="/songbook">SongBook</Link></li>  {/* Link to the songbook */}
        <li><Link to="/about">About</Link></li>  {/* Link to the about page */}
        <li><Link to="/blog">Blog</Link></li>  {/* Link to the blog page */}
      </ul>
    </nav>
  );
}

export default Sidebar;
