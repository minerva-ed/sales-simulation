import React, { createContext, useContext, useState } from 'react';

// Create the context
const SubtitlesContext = createContext();

// Export a hook for easy context access
export const useSubtitles = () => useContext(SubtitlesContext);

// Context Provider component
export const SubtitlesProvider = ({ children }) => {
    const [subtitles, setSubtitles] = useState([]);

    return (
        <SubtitlesContext.Provider value={{ subtitles, setSubtitles }}>
            {children}
        </SubtitlesContext.Provider>
    );
};
