import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './AuthContext.js';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import MainContent from './Main/MainContent';
import About from './About/About';
import Blog from './Blog/Blog';
import SongBook from './SongBook/SongBook';
import SongDetails from './SongDetails/SongDetails';
import Login from './Authentication/Login';
import Logout from './Authentication/Logout';
import './App.css';


/**
 * PrivateRoute Component
 * 
 * Ensures that only authenticated users can access specific routes.
 * If the user is not authenticated, they are redirected to the login page.
 * 
 * @param {ReactNode} children - The child components to render if authenticated
 * @returns {JSX.Element} The children or a redirection to the login page
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Display a loading spinner or message
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};


/**
 * App Component
 * 
 * This is the main application component that sets up routing and provides global context.
 * It includes shared components like the Header, Sidebar, and routes for various pages.
 */
function App() {
  return (
    <Router>
      {/* AuthProvider ensures that authentication state is available throughout the app */}
      <AuthProvider>
        <div className="app-container">
          {/* Header displayed at the top of the app */}
          <div className="header-wrapper">
            <Header />
          </div>

          {/* Main content area with a Sidebar and dynamic content */}
          <div className="main-content">
            <Sidebar /> {/* Sidebar with clickable links */}

            {/* Content wrapper for all routes */}
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<MainContent />} />  {/* Route for Home */}
                <Route path="/songbook" element={<SongBook />} />  {/* Route for SongBook */}
                <Route path="/about" element={<About />} />  {/* Route for About */}
                <Route path="/blog" element={<Blog />} />  {/* Route for Blog */}

                {/* Routes not directly on the homepage */}
                <Route path="/song/:id" element={<SongDetails />} />  {/* Route for SongDetails */}
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route path="/logout" element={
                  <PrivateRoute>
                    <Logout />
                 </PrivateRoute>
                    }/>
              </Routes>
            </div>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;