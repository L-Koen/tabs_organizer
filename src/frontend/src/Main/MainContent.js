import React from 'react';
import './MainContent.css'; // Import the CSS file for styling

/**
 * MainContent Component
 * 
 * This component represents the main content area of the website.
 * It serves as the primary section where key information or features
 * are displayed.
 */
function MainContent() {
  return (
    // The main HTML5 element to semantically define the primary content of the page
    <main className="main-content">
      {/* A simple paragraph to welcome users */}
      <p>Welcome to my website! This is the main content area.</p>
    </main>
  );
}

export default MainContent; // Export the component for use in other parts of the application
