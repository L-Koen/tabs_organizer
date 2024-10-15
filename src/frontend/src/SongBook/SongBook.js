// Songbook.js
import React, { useEffect, useCallback, useState } from 'react';
//import axios from 'axios';
import './SongBook.css';


const SongBook = () => {
  const [songs, setSongs] = useState([]); // Store the list of songs here
  const [currentPage, setCurrentPage] = useState(1); // Keep track of the current page

  // Fetch songs from the backend
  const fetchSongs = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/songbook/songs/?page=${currentPage}`);
      const data = await response.json();
      console.log(data)
      setSongs(data.results); // Assuming your DRF sends results in data.results
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  }, [currentPage]); // Add currentPage to dependencies so fetch runs when page changes

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]); // Run fetchSongs when the component mounts or when currentPage changes

  return (
    <div className="songbook-container">
      <h2>Songbook</h2>
      <ul>
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <li key={index}>
              <button onClick={() => handleSongClick(song)}>
                {song.title} - {song.artist.name}
              </button>
            </li>
          ))
        ) : (
          <p>No songs available</p>
        )}
      </ul>

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


const handleSongClick = (song) => {
    // Here, you'll want to load the cheat sheet for the song.
    // For now, we can just log the song details.
    console.log("Selected song:", song);
    // You can later add logic here to fetch and show the song's details/cheat sheet.
  };
  

export default SongBook;
