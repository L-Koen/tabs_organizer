import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component to enable navigation between routes
import './Sidebar.css'; // Import the CSS file for styling the sidebar

/**
 * Sidebar Component
 * 
 * This component represents the sidebar navigation menu of the application.
 * It provides links to different sections of the website, allowing users to
 * navigate seamlessly between routes.
 */
function Sidebar() {
  return (
    // A <nav> element is used to define the navigation menu
    <nav className="sidebar">
      <ul>
        {/* Navigation links using <Link> for client-side routing */}
        <li>
          <Link to="/">Home</Link> {/* Navigate to the home page */}
        </li>
        <li>
          <Link to="/songbook">SongBook</Link> {/* Navigate to the SongBook page */}
        </li>
        <li>
          <Link to="/about">About</Link> {/* Navigate to the About page */}
        </li>
        <li>
          <Link to="/blog">Blog</Link> {/* Navigate to the Blog page */}
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar; // Export the Sidebar component for use in other parts of the application
