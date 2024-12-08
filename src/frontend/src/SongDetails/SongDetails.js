// SongDetails.js
import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom'; // React Router hook for accessing URL parameters
import './SongDetails.css'; // Import styles for this component
import { parseLyricsAndChords } from './parse';// Helper function to format lyrics and chords


/**
 * SongDetails Component
 * Displays detailed information about a song, including its title, artist,
 * and formatted lyrics with chords. Adapts to screen width for responsive display.
 */
const SongDetails = () => {
  const { id } = useParams(); // Extract song ID from the URL parameters
  const [song, setSong] = useState(null); // State to hold the song's details
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);// Track screen width for responsive rendering

  /**
   * Fetch song details from the backend when the component mounts or when the `id` changes.
   */
  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await fetch(`https://developpi.local:8000/songbook/songs/${id}`);
        const data = await response.json(); // Parse JSON response
        setSong(data); // Store the song details in state
      } catch (error) {
        console.error('Error fetching song details:', error);
      }
    };
    fetchSongDetails(); // Trigger the API call
  }, [id]); // Dependency array ensures this runs when `id` changes

  /**
   * Update the screen width in state whenever the window is resized.
   */
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth); // Update state with the new screen width
    window.addEventListener("resize", handleResize); // Attach resize event listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup on component unmount
  }, []);  // Empty dependency array ensures this runs only once on mount

  /**
   * Show a loading message while the song details are being fetched.
   */
  if (!song) {
    return <p>Loading song details...</p>;
  }

  return (
    <div className="song-detail-container">
      <div className="song-title-section">
        {/* Section for displaying the song's title and artist */}
        <h1 className="song-title">{song.title}</h1>
        <p className="artist-name">by {song.artist.name}</p>
      </div>

      {/* Section for displaying the song's lyrics and chords */}
      <div className="song-content">
        {/* Iterate over the song's structure to render each section */}
        {song.structure.split(',').map((sectionName, index) => (
          <div key={index} className="lyrics-section">
            <h3>{sectionName}</h3>
            {/* Render parsed lyrics and chords dynamically */}
            {parseLyricsAndChords(song.lyrics_and_chords[sectionName], screenWidth-400).map((line, i) => (
              <pre key={i}>{line}</pre>  // Using <pre> to keep formatting
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongDetails;
