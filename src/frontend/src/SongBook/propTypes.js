import PropTypes from 'prop-types';


export const ArtistPropType = PropTypes.shape({
  id: PropTypes.number, // Optional ID for the artist
  name: PropTypes.string.isRequired, // Required artist name
});


export const SongPropType = PropTypes.shape({
  id: PropTypes.number, // Optional ID for the song
  title: PropTypes.string.isRequired, // Required title
  artist: ArtistPropType.isRequired, // Artist object is required
  lyrics_and_chords: PropTypes.objectOf(
    PropTypes.shape({
      lyrics: PropTypes.string.isRequired, // Required lyrics
      chords: PropTypes.arrayOf(PropTypes.string).isRequired, // required commaseparated string of chords
    })
  ).isRequired, // Required object mapping section names to details
  structure: PropTypes.string.isRequired, // Required comma separated string of section names
});
