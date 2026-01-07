import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import ThemeProvider from './components/theme/ThemeProvider';
import Navigation from './components/ui/Navigation';
import MenuPage from './pages/Menu';
import About from './pages/About';
import './styles/App.css';

// Thành phần App chính
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/" element={<MenuPage />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
