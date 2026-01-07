import React from 'react';

// Base Layout component - provides common structure for all pages
const Layout = ({ children }) => {
  return (
    <div className="layout" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Main content area */}
      <main style={{
        flex: 1,
        padding: '2rem',
        backgroundColor: '#f5f5f5'
      }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #2c3e6f 0%, #1a2744 100%)',
        color: 'white',
        padding: '3rem 2rem 1.5rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* About Section - Left */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
              🍽️ Restaurant App
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              Discover amazing dishes from our talented chefs. Filter, search, and order your favorites with ease.
            </p>
          </div>

          {/* Quick Links - Center */}
          <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            <a href="/about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.2s', padding: '0.5rem 1rem', borderRadius: '8px', display: 'inline-block' }}
               onMouseEnter={(e) => { e.target.style.color = '#fff'; e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)'; }}
               onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.8)'; e.target.style.backgroundColor = 'transparent'; }}>
              ℹ️ More Information
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
            Ho Chi Minh City Open UniVersity - Restaurant App © 2026. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;