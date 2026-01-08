import React from 'react';
import pizzaImg from '../assets/pizza.avif';
import spaghettiImg from '../assets/spagheti.avif';
import burgerImg from '../assets/chees-burger.avif';

// Thành phần DishCard - được tối ưu hóa với memo để cải thiện hiệu suất
const DishCard = React.memo(({ dish }) => {
  console.log(`Rendering dish: ${dish.name}`);

  const pickImage = () => {
    const name = (dish.name || '').toLowerCase();
    if (name.includes('pizza')) return pizzaImg;
    if (name.includes('spaghetti') || name.includes('pasta')) return spaghettiImg;
    if (name.includes('burger') || name.includes('cheese')) return burgerImg;
    return pizzaImg;
  };

  const imgSrc = dish.image || pickImage();

  return (
    <div className="dish-card" style={{
      border: 'none',
      padding: '1.25rem',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      overflow: 'hidden',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    }}>
      <img src={imgSrc} alt={dish.name} style={{ 
        float: 'right', 
        width: '150px', 
        height: '110px', 
        objectFit: 'cover', 
        borderRadius: '10px', 
        marginLeft: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }} />
      <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#2c3e50', fontSize: '1.15rem' }}>{dish.name}</h3>
      <p style={{ color: '#7f8c8d', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '0.75rem' }}>{dish.description}</p>
      <p style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '1.1rem', margin: '0.5rem 0' }}>${dish.price}</p>
      <p style={{ fontSize: '0.8rem', color: '#95a5a6', margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <span style={{ color: '#e67e22' }}>⏱</span> {dish.prepare_time} min
      </p>
      <p style={{ fontSize: '0.78rem', color: '#95a5a6', margin: '0.25rem 0' }}>
        <span style={{ fontWeight: '500' }}>Category:</span> {dish.category_name || dish.category || 'Uncategorized'}
      </p>
      <p style={{ fontSize: '0.78rem', color: '#95a5a6', margin: '0.25rem 0' }}>
        <span style={{ fontWeight: '500' }}>Chef:</span> {dish.chef_name || dish.chef || '—'}
      </p>

    </div>
  );
});

export default DishCard;