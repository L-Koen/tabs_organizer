export function parseLyricsAndChords(section, screenWidth) {
    const { chords, lyrics } = section;
    let currentLine = '';       // Keeps track of the lyrics line
    let chordLine = '';         // Keeps track of the chords line
    let chordIndex = 0;         // Tracks which chord to use
    let skip = 0;               // Skip counter. After adding a chord, we need to skip spacers
    const parsedLyrics = [];    // Array to store the final result (lyrics with chords)

    let charIndex = 0;  // Track character position

    // Process each character in the lyrics
    for (let char of lyrics) {
        if (char === '|') {
            // Insert the current chord into the chord line at the | position
            if (chords[chordIndex][0] === '[' && chordLine.length > 0) {
                chordLine = chordLine.slice(0, -1); // if the chord starts with a measure indicator, pemove the last space
            }
            chordLine += chords[chordIndex] || '';
            skip = chords[chordIndex].length;
            chordIndex = (chordIndex + 1) % chords.length; // Loop chords
        } else if (char === '{') {
            // This is where we consider optional line breaks based on screen width
            if (currentLine.length*12 >= screenWidth) {
                parsedLyrics.push({ chords: chordLine.trimEnd(), lyrics: currentLine.trimEnd() });
                currentLine = ''; // Reset currentLine after adding it
                chordLine = '';   // Reset chordLine as well
            }
        } else if (char === '\n') {
            // Handle explicit line breaks
            parsedLyrics.push({ chords: chordLine.trimEnd(), lyrics: currentLine.trimEnd() });
            currentLine = ''; // Reset currentLine for next line
            chordLine = '';   // Reset chordLine as well
        } else {
            // Add regular characters to the current line
            currentLine += char;
            if (skip > 0) { // If skip > 0, do not add spaces
                skip--;
            } else {
                chordLine += ' ';    
            }
            
        }
        charIndex++;
    }

    // After loop, push the last remaining line if any
    if (currentLine) {
        parsedLyrics.push({ chords: chordLine.trimEnd(), lyrics: currentLine.trimEnd() });
    }

    // Now format the chords and lyrics interleaved
    return parsedLyrics.map(line => {
       const lyricsWithChords = [];
        
       lyricsWithChords.push(line.chords);
       lyricsWithChords.push(line.lyrics);
       return lyricsWithChords.join('\n');
    });
}
