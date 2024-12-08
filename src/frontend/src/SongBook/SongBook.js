// Songbook.js
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigating to other pages
import './SongBook.css'; // Import styles for this component


/**
 * SongBook Component
 * Displays a paginated list of songs fetched from the backend.
 * Allows navigation to a song's detail page by clicking on a song.
 */
const SongBook = () => {
  const [songs, setSongs] = useState([]); // Store the list of songs here
  const [currentPage, setCurrentPage] = useState(1); // Keep track of the current page
  const navigate = useNavigate(); // React Router hook for navigating between pages

  /**
   * Fetch songs from the backend API based on the current page.
   * The useCallback hook ensures the function is memoized and doesn't
   * change unless `currentPage` changes.
   */
  const fetchSongs = useCallback(async () => {
    try {
      const response = await fetch(`https://developpi.local:8000/songbook/songs/?page=${currentPage}`);
      const data = await response.json(); // parse JSON response
      //console.log(data)
      setSongs(data.results); // Update state with fetched songs
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  }, [currentPage]); // Dependency array ensures this function is recreated when `currentPage` changes

  /**
   * Effect to fetch songs when the component mounts or when `currentPage` changes.
   */
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]); // Dependency array ensures this runs when `fetchSongs` changes

  /**
   * Handle click event for a song.
   * Navigates to the details page of the selected song.
   * @param {Object} song - The song object containing its ID and details
   */
  const handleSongClick = (song) => {
    navigate(`/song/${song.id}`); // Navigate to SongDetails page
  };

  return (
    <div className="songbook-container">
      <h2>Songbook</h2>

      {/* List of songs */}
      <ul>
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <li key={index}>
              {/* Button to navigate to the song's details page */}
              <button onClick={() => handleSongClick(song)}>
              {song.artist.name} - {song.title}
              </button>
            </li>
          ))
        ) : (
          // Display a fallback message if no songs are available
          <p>No songs available</p>
        )}
      </ul>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};



  

export default SongBook;
