// Songbook.js
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SongBook.css';


const SongBook = () => {
  const [songs, setSongs] = useState([]); // Store the list of songs here
  const [currentPage, setCurrentPage] = useState(1); // Keep track of the current page
  const navigate = useNavigate();

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

  const handleSongClick = (song) => {
    navigate(`/song/${song.id}`); // Navigate to SongDetails page
  };

  return (
    <div className="songbook-container">
      <h2>Songbook</h2>
      <ul>
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <li key={index}>
              <button onClick={() => handleSongClick(song)}>
              {song.artist.name} - {song.title}
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



  

export default SongBook;
