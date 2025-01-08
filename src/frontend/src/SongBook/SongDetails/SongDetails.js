import React, { useEffect, useState } from 'react'; 
import PropTypes from 'prop-types'; // Import PropTypes for type checking
import { useLocation, useParams } from 'react-router-dom'; // React Router hook for accessing URL parameters
import './SongDetails.css'; // Import styles for this component
import { parseLyricsAndChords } from './parse'; // Helper function to format lyrics and chords
import { SongPropType } from '../propTypes.js'; // Import the SongPropType

/**
 * SongDetails Component
 * Displays detailed information about a song, including its title, artist,
 * and formatted lyrics with chords. Adapts to screen width for responsive display.
 */

const SongDetails = () => {
  const location = useLocation(); // Access the location object
  const { id } = useParams(); // Access the song ID from the URL
  const { song: passedSong } = location.state || {}; // Destructure the song object from state

  // Track screen width for responsive rendering
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures this runs only once on mount

  if (!passedSong) {
    return <p>No song data passed from the previous page. Try refreshing or navigating back.</p>;
  }

  return (
    <div className="song-detail-container">
      <div className="song-title-section">
        {/* Section for displaying the song's title and artist */}
        <h1 className="song-title">{passedSong.title}</h1>
        <p className="artist-name">by {passedSong.artist.name}</p>
      </div>

      {/* Section for displaying the song's lyrics and chords */}
      <div className="song-content">
        {/* Iterate over the song's structure to render each section */}
        {passedSong.structure.split(',').map((sectionName, index) => (
          <div key={index} className="lyrics-section">
            <h3>{sectionName}</h3>
            {/* Render parsed lyrics and chords dynamically */}
            {parseLyricsAndChords(passedSong.lyrics_and_chords[sectionName], screenWidth - 400).map((line, i) => (
              <pre key={i}>{line}</pre> // Using <pre> to keep formatting
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Validate the song prop against SongPropType
SongDetails.propTypes = {
  passedSong: SongPropType, // Use SongPropType for validation
};

export default SongDetails;
