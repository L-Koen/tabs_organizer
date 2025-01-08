import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SongDetails from '../SongDetails/SongDetails'; // Base component
import './FinalSongReview.css'; // Add styles for Final Review

const FinalSongReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { song } = location.state || {};

  if (!song) {
    return <p>No song data available. Please return to the create/edit page.</p>;
  }

  /**
   * Submit the song to the backend.
   */
  const handleSubmit = async () => {
    const url = song.id
      ? `https://developpi.local:8000/songs/${song.id}/`
      : 'https://developpi.local:8000/songs/';
    const method = song.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      });

      if (!response.ok) {
        throw new Error('Failed to save the song.');
      }

      alert('Song saved successfully!');
      navigate('/'); // Redirect to the homepage or a confirmation page
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving the song.');
    }
  };

  /**
   * Navigate back to the CreateSong page for edits.
   */
  const goBackToEdit = () => {
    navigate('/create-song', { state: { song } });
  };

  return (
    <div className="final-review-container">
      {/* Render the SongDetails component */}
      <SongDetails passedSong={song} />

      {/* Action Buttons */}
      <div className="review-buttons">
        <button onClick={goBackToEdit}>Edit Song</button>
        <button onClick={handleSubmit}>Submit Song</button>
      </div>
    </div>
  );
};

export default FinalSongReview;
