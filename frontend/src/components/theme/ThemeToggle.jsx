import React from 'react';
import { ThemeContext } from './ThemeProvider';

// Theme toggle component
const ThemeToggle = () => {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      style={{
        padding: '8px 16px',
        backgroundColor: theme === 'light' ? '#333' : '#f0f0f0',
        color: theme === 'light' ? '#fff' : '#000',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '1rem'
      }}
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
};

export default ThemeToggle;