import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchFilters = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    q: '',
    minPrice: '',
    maxPrice: '',
    minPrepare: '',
    maxPrepare: '',
    chefId: '',
    ordering: 'name'
  });

  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios.get('http://127.0.0.1:8000/chefs/')
      .then(res => {
        if (!mounted) return;
        setChefs([{ id: '', username: 'All Chefs' }, ...res.data]);
      })
      .catch(() => {
        if (!mounted) return;
        setChefs([{ id: '', username: 'All Chefs' }]);
      });
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      q: '',
      minPrice: '',
      maxPrice: '',
      minPrepare: '',
      maxPrepare: '',
      chefId: '',
      ordering: 'name'
    });
    onReset();
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Search & Filters</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Search by Dish Name
          </label>
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Enter dish name..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Price range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Min Price ($)
            </label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="0"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Max Price ($)
            </label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="100"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Prepare time range */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Min Prepare Time (min)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="minPrepare"
              value={filters.minPrepare}
              onChange={handleChange}
              placeholder="0"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Max Prepare Time (min)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="maxPrepare"
              value={filters.maxPrepare}
              onChange={handleChange}
              placeholder="60"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Chef selection */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Chef In Charge
          </label>
          <select
            name="chefId"
            value={filters.chefId}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            {chefs.map(c => (
              <option key={String(c.id)} value={c.id}>{c.username}</option>
            ))}
          </select>
        </div>

        {/* Sort by */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Sort By
          </label>
          <select
            name="ordering"
            value={filters.ordering}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="name">Name (A-Z)</option>
            <option value="-name">Name (Z-A)</option>
            <option value="price">Price (Low to High)</option>
            <option value="-price">Price (High to Low)</option>
            <option value="prepare_time">Prepare Time (Short to Long)</option>
            <option value="-prepare_time">Prepare Time (Long to Short)</option>
            <option value="rating">Rating (Low to High)</option>
            <option value="-rating">Rating (High to Low)</option>
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
