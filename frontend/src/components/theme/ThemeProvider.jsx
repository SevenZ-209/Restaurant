import React, { useState } from 'react';

// Context cho chủ đề
export const ThemeContext = React.createContext();

// Thành phần ThemeProvider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;