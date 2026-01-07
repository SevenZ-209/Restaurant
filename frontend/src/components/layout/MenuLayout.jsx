import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import axios from 'axios';

// Layout Menu mở rộng - mở rộng Layout với các tính năng cụ thể cho menu
const MenuLayout = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios.get('http://127.0.0.1:8000/categories/')
      .then(res => {
        if (!mounted) return;
      
        setCategories([{ id: null, name: 'All Dishes' }, ...res.data]);
      })
      .catch(() => {
        if (!mounted) return;
        // p dự phòng với các danh mục mặc định
        setCategories([{ id: null, name: 'All Dishes' }]);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <Layout>
      <div className="menu-layout" style={{
        display: 'flex',
        gap: '2rem'
      }}>
        {/* Thanh bên với các danh mục */}
        <aside style={{
          width: '260px',
          backgroundColor: 'white',
          padding: 0,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          height: 'fit-content',
          position: 'sticky',
          top: '1rem',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.25rem',
            color: 'white'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '600' }}>📋 Categories</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: '1rem', margin: 0 }}>
            {categories.map(category => (
              <li key={String(category.id)} style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: selectedCategory === category.id 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : '#f8f9fa',
                    color: selectedCategory === category.id ? 'white' : '#2c3e50',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s',
                    fontWeight: selectedCategory === category.id ? '600' : '500',
                    fontSize: '0.95rem',
                    boxShadow: selectedCategory === category.id ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.target.style.backgroundColor = '#e9ecef';
                      e.target.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div style={{ flex: 1 }}>
          {React.cloneElement(children, { selectedCategory, categories })}
        </div>
      </div>
    </Layout>
  );
};

export default MenuLayout;