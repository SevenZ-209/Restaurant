import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#2c3e6f', marginBottom: '1.5rem', fontSize: '2.5rem' }}>
          More Information
        </h1>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Welcome to Restaurant App</h2>
                   
          <h3 style={{ color: '#667eea', marginTop: '2rem', marginBottom: '1rem' }}>Tech Stack </h3>
          <ul style={{ fontSize: '0.95rem', lineHeight: '2', color: '#555', marginBottom: '1.5rem' }}>
            <li><strong>React:</strong> Component-based UI with JSX</li>
            <li><strong>Hooks:</strong> useState, useEffect, useSelector, useDispatch</li>
            <li><strong>Events:</strong> Form handling and user interactions</li>
            <li><strong>React Router:</strong> Multi-page navigation</li>
            <li><strong>Cookies:</strong> Client-side data persistence</li>
            <li><strong>Context API:</strong> Theme management</li>
            <li><strong>React.memo:</strong> Performance optimization</li>
            <li><strong>Axios:</strong> HTTP requests to Django REST API</li>
            <li><strong>Redux Toolkit:</strong> Global state management</li>
          </ul>

          <h3 style={{ color: '#667eea', marginTop: '2rem', marginBottom: '1rem' }}>Student Information</h3>
          <ul style={{ fontSize: '0.95rem', lineHeight: '2', color: '#555' }}>
            <li>
              <strong>Name:</strong> Bui Trong Nghia</li>
            <li><strong>MSSV:</strong> 2351010136 </li>
           <li><strong>Name:</strong> Le Minh Dang Khoa</li>
           <li><strong>MSSV:</strong> ...
            </li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
          }}
        >
          ← Back to Menu
        </button>
      </div>
    </Layout>
  );
};

export default About;