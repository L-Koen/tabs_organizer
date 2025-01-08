import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom'; // React Router hook for accessing location state
import { parseLyricsAndChords } from '../SongDetails/parse';
import { SongPropType } from '../propTypes';
import './CreateSong.css';

// Default song object for new creations
const defaultSong = {
  title: '',
  artist: { name: '' },
  sections: [{ name: 'Verse 1', lyrics: '', chords: [] }],
  structure: [],
};

const CreateSong = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const { song: passedSong } = location.state || {}; // Get the passed song from navigation
  const initialSong = passedSong || defaultSong; // Use passed song or default song

  // State for the song's title
  const [title, setTitle] = useState(initialSong.title);

  // State for the artist's name
  const [artist, setArtist] = useState(initialSong.artist.name);

  const [sections, setSections] = useState(() => {
  
    if (Array.isArray(initialSong.sections) && initialSong.sections.length > 0) {
      return initialSong.sections;
    } else if (initialSong.lyrics_and_chords && typeof initialSong.lyrics_and_chords === 'object') {
      const sections = Object.keys(initialSong.lyrics_and_chords).map((key) => ({
        name: key,
        lyrics: initialSong.lyrics_and_chords[key]?.lyrics || '',
        chords: initialSong.lyrics_and_chords[key]?.chords || [],
      }));
      return sections;
    }
  
    return defaultSong.sections;
  });

  // State for the song structure
  const [structure, setStructure] = useState(() => {
    if (Array.isArray(initialSong.structure)) {
      return initialSong.structure;
    } else if (typeof initialSong.structure === 'string') {
      return initialSong.structure.split(',');
    }
    return [];
  });

  // Track dropdown selection
  const [selectedSection, setSelectedSection] = useState(""); 

  // Update state when passedSong changes (useful if navigating directly with a song object)
  useEffect(() => {
    if (passedSong) {
      setTitle(passedSong.title || '');
      setArtist(passedSong.artist?.name || '');
      setSections(() => {
        if (Array.isArray(passedSong.sections)) {
          return passedSong.sections;
        } else if (passedSong.lyrics_and_chords) {
          return Object.entries(passedSong.lyrics_and_chords).map(([key, value]) => ({
            name: key,
            lyrics: typeof value.lyrics === 'string' ? value.lyrics : '',
            chords: Array.isArray(value.chords) ? value.chords : [],
          }));
        }
        return defaultSong.sections;
      });
      setStructure(() => {
        if (Array.isArray(passedSong.structure)) {
          return passedSong.structure;
        } else if (typeof passedSong.structure === 'string') {
          return passedSong.structure.split(',');
        }
        return [];
      });
    }
  }, [passedSong]);
  

  /**
   * Updates the lyrics of a specific section.
   */
  const handleLyricsChange = (index, newLyrics) => {
    const updatedSections = [...sections];
    updatedSections[index].lyrics = newLyrics.replace(/\\n/g, '\n');
    setSections(updatedSections);
  };

  /**
   * Updates the chords of a specific section.
   */
  const handleChordsChange = (index, newChords) => {
    const updatedSections = [...sections];
    updatedSections[index].chords = newChords.split(',');
    setSections(updatedSections);
  };

  /**
   * Updates the name of a specific section.
   */
  const handleSectionNameChange = (index, newName) => {
    const updatedSections = [...sections];
    updatedSections[index].name = newName;
    setSections(updatedSections);
  };

  /**
   * Adds a new section to the song.
   */
  const addSection = () => {
    setSections([...sections, { name: `Section ${sections.length + 1}`, lyrics: '', chords: [] }]);
  };

  /**
   * Removes a section by index.
   */
  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

   /**
   * Adds a section name to the song structure.
   */
   const addToStructure = (sectionName) => {
    if (!sectionName) return; // Prevent adding invalid entries
    setStructure([...structure, sectionName]);
    setSelectedSection(""); // Reset dropdown selection
  };

  /**
   * Removes a section from the structure by index.
   */
  const removeFromStructure = (index) => {
    setStructure(structure.filter((_, i) => i !== index));
  };

  /**
   * Generates the full preview of the song based on the structure.
   */
  const generateFullPreview = () => {
    return structure.map((sectionName, index) => {
      const section = sections.find((sec) => sec.name === sectionName);
      if (!section) return null;
      return (
        <div key={index} className="full-preview-section">
          <h4>{section.name}</h4>
          {parseLyricsAndChords({ chords: section.chords, lyrics: section.lyrics }, 600).map((line, i) => (
            <pre key={i}>{line}</pre>
          ))}
        </div>
      );
    });
  };

  /**
   * Navigate to the Final Review page.
   */
  const goToFinalReview = () => {
    // Construct lyrics_and_chords object from sections
    const lyricsAndChords = {};
    sections.forEach((section) => {
      lyricsAndChords[section.name] = {
        lyrics: section.lyrics,
        chords: section.chords,
      };
    });

    // Convert structure array to a comma-separated string
    const songStructure = structure.join(',');

    // Construct the song object
    const song = {
      title,
      artist: { name: artist },
      lyrics_and_chords: lyricsAndChords,
      structure: songStructure,
    };

    navigate('/songreview', { state: { song } }); // Pass the song object to Final Review
  };

  return (
    <div className="create-song-container">
      <h1>{passedSong ? 'Edit Song' : 'Create New Song'}</h1>

      {/* Title Input */}
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Artist Input */}
      <div>
        <label htmlFor="artist">Artist:</label>
        <input
          id="artist"
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <div key={index} className="section-container">
          {/* Section Name */}
          <label>
            Section Name:
            <input
              type="text"
              value={section.name}
              onChange={(e) => handleSectionNameChange(index, e.target.value)}
              placeholder="e.g., Verse 1, Chorus"
            />
          </label>

          {/* Chords Input */}
          <div>
            <label htmlFor={`chords-${index}`}>Chords (comma-separated):</label>
            <textarea
              className="wide-textarea"
              rows="1"
              id={`chords-${index}`}
              value={section.chords.join(',')}
              onChange={(e) => handleChordsChange(index, e.target.value)}
            ></textarea>
          </div>

          {/* Lyrics Input */}
          <div>
            <label htmlFor={`lyrics-${index}`}>Lyrics:</label>
            <textarea
              className="wide-textarea"
              rows="5"
              id={`lyrics-${index}`}
              value={section.lyrics}
              onChange={(e) => handleLyricsChange(index, e.target.value)}
            ></textarea>
          </div>

          {/* Section Preview */}
          <div className="preview">
            <h4>Preview:</h4>
            {parseLyricsAndChords(
              { chords: section.chords, lyrics: section.lyrics },
              600 // Assume a fixed screen width for now
            ).map((line, i) => (
              <pre key={i}>{line}</pre>
            ))}
          </div>

          {/* Remove Section Button */}
          <button type="button" onClick={() => removeSection(index)}>
            Remove Section
          </button>
        </div>
      ))}

      {/* Add Section Button */}
      <button type="button" onClick={addSection}>
        Add Section
      </button>
    
    {/* Structure Editor */}
    <div className="structure-editor">
        <h3>Song Structure</h3>
        <ul>
          {structure.map((sectionName, index) => (
            <li key={index}>
              {sectionName}
              <button onClick={() => removeFromStructure(index)}>Remove</button>
            </li>
          ))}
        </ul>
        <select
          value={selectedSection}
          onChange={(e) => {
            setSelectedSection(e.target.value); // Update selected section
            addToStructure(e.target.value); // Add the selected section
          }}
        >
          <option value="" disabled>
            Add Section
          </option>
          {sections.map((section, index) => (
            <option key={index} value={section.name}>
              {section.name}
            </option>
          ))}
        </select>
      </div>

      {/* Full Song Preview */}
      <div className="full-song-preview">
        <h3>Full Song Preview</h3>
        {generateFullPreview()}
      </div>

      {/* Final Review Button */}
      <button type="button" onClick={goToFinalReview}>
        Final Review
      </button>
    </div>
  );
};

CreateSong.propTypes = {
  song: SongPropType, // Validate song structure
};

export default CreateSong;
