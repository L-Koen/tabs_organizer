import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import MainContent from './Main/MainContent';
import About from './About/About';
import Blog from './Blog/Blog';
import SongBook from './SongBook/SongBook';
import './App.css';

function App() {
  return (
    <Router>
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
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;