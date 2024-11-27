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


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Display a loading spinner or message
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <div className="header-wrapper">
            <Header />
          </div>
          <div className="main-content">
            <Sidebar /> {/* Sidebar with clickable links */}
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<MainContent />} />  {/* Route for Home */}
                <Route path="/songbook" element={<SongBook />} />  {/* Route for SongBook */}
                <Route path="/about" element={<About />} />  {/* Route for About */}
                <Route path="/blog" element={<Blog />} />  {/* Route for Blog */}

                {/* Hidden route for individual Song Details */}
                <Route path="/song/:id" element={<SongDetails />} />  {/* Route for SongDetails */}
                <Route path="/login" element={<Login />} />
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