// SongDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SongDetails.css';
import { parseLyricsAndChords } from './parse';

const SongDetails = () => {
  const { id } = useParams(); // Extract song ID from URL
  const [song, setSong] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Fetch song details when component mounts or ID changes
  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/songbook/songs/${id}`);
        const data = await response.json();
        setSong(data);
      } catch (error) {
        console.error('Error fetching song details:', error);
      }
    };
    fetchSongDetails();
  }, [id]);

  // Update screen width when the window is resized
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show a loading message if song details haven't loaded yet
  if (!song) {
    return <p>Loading song details...</p>;
  }

  return (
    <div className="song-detail-container">
      <div className="song-title-section">
        <h1 className="song-title">{song.title}</h1>
        <p className="artist-name">by {song.artist.name}</p>
      </div>
      <div className="song-content">
        {song.structure.split(',').map((sectionName, index) => (
          <div key={index} className="lyrics-section">
            <h3>{sectionName}</h3>
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
