/**
 * Parses a section of lyrics and chords, aligning them for display.
 * Handles dynamic chord alignment and optional line breaks based on screen width.
 * 
 * @param {Object} section - Contains `lyrics` (string) and `chords` (array) for a song section.
 * @param {number} screenWidth - The width of the display in pixels, used for responsive formatting.
 * @returns {Array} - An array of formatted strings, each containing aligned chords and lyrics.
 */
export function parseLyricsAndChords(section, screenWidth) {
    const { chords, lyrics } = section;
    let currentLine = '';       // Stores the current line of lyrics
    let chordLine = '';         // Stores the corresponding line of chords
    let chordIndex = 0;         // Tracks the current chord to be applied
    let skip = 0;               // Skip counter to align chords with lyrics
    const parsedLyrics = [];    // Final result: Array of aligned lyrics and chords

    let charIndex = 0;          // Tracks character position for processing

    // Iterate over each character in the lyrics
    for (let char of lyrics) {
        if (char === '|') {
            /**
             * Handle chord insertion at designated positions (|).
             * The chord is aligned with the current position in the chord line.
             */
            if (chords[chordIndex][0] === '[' && chordLine.length > 0) {
                chordLine = chordLine.slice(0, -1); // if the chord starts with a measure indicator, remove the last space
            }
            chordLine += chords[chordIndex] || '';         // Add the current chord
            skip = chords[chordIndex].length;              // Set skip to the length of the chord
            chordIndex = (chordIndex + 1) % chords.length; // Loop chords
        } else if (char === '{') {
            /**
             * Handle optional line breaks ({) for responsive formatting.
             * A break is added if the current line exceeds the screen width.
             */
            if (currentLine.length*12 >= screenWidth) {  // Approximation: 12px per character
                parsedLyrics.push({ chords: chordLine.trimEnd(), lyrics: currentLine.trimEnd() });
                currentLine = ''; // Reset lines for the next segment
                chordLine = '';   
            }
        } else if (char === '\n') {
            /**
             * Handle explicit line breaks (\n) in the lyrics.
             * Push the current line and reset for the next one.
             */
            parsedLyrics.push({ chords: chordLine.trimEnd(), lyrics: currentLine.trimEnd() });
            currentLine = ''; // Reset lines for the next segment
            chordLine = '';   
        } else {
            /**
             * Handle regular characters in the lyrics.
             * Add the character to the lyrics and spaces to the chord line if no skip is active.
             */
            currentLine += char;
            if (skip > 0) { // Decrease skip counter to align following characters
                skip--;
            } else {
                chordLine += ' ';    
            }
            
        }
        charIndex++;
    }

    // Push any remaining content after the loop
    if (currentLine) {
        parsedLyrics.push({ chords: chordLine.trimEnd(), lyrics: currentLine.trimEnd() });
    }

    // Interleave chords and lyrics for final output
    return parsedLyrics.map(line => {
       const lyricsWithChords = [];        
       lyricsWithChords.push(line.chords); // Add the chord line
       lyricsWithChords.push(line.lyrics); // Add the corresponding lyrics line
       return lyricsWithChords.join('\n'); // Combine them with a newline for display
    });
}
