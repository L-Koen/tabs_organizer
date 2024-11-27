import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Logout = () => {
  const { logout } = useContext(AuthContext); // Access the logout function from AuthContext
  const navigate = useNavigate(); // For navigation

  // Handle logout confirmation
  const handleConfirmLogout = async () => {
    try {
      await logout(); // Call the logout function to clear authentication state
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error); // Handle errors, if any
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Are you sure you want to log out?</h1>
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={handleConfirmLogout}
          style={{
            padding: '0.5rem 1rem',
            margin: '0.5rem',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Yes, log out
        </button>
        <button
          onClick={handleCancel}
          style={{
            padding: '0.5rem 1rem',
            margin: '0.5rem',
            backgroundColor: 'gray',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Logout;
