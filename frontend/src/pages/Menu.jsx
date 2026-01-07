import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDishes, setCurrentPage } from '../store/dishesSlice';
import MenuLayout from '../components/layout/MenuLayout';
import DishCard from '../components/ui/DishCard';
import SearchFilters from '../components/ui/SearchFilters';
import Pagination from '../components/ui/Pagination';

// Menu mở rộng MenuLayout hiển thị danh sách các món ăn
const Menu = ({ selectedCategory, categories = [] }) => {
  const dispatch = useDispatch();
  const { items, loading, error, count, next, previous, currentPage } = useSelector(state => state.dishes);
  const [searchParams, setSearchParams] = useState({});

  // Loci du lieu moi khi selectedCategory, searchParams hoac currentPage thay doi
  useEffect(() => {
    const params = { ...searchParams };
    if (selectedCategory) params.categoryId = selectedCategory;
    params.page = currentPage;
    dispatch(fetchDishes(params));
  }, [dispatch, selectedCategory, searchParams, currentPage]);


  const handleSearch = (filters) => {
    setSearchParams(filters);
    dispatch(setCurrentPage(1)); // Reset trang khi tim kiem moi
  };

  const handleReset = () => {
    setSearchParams({});
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(count / 20); // 20 item cho mot trang

  if (loading && items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading dishes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#d32f2f' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Restaurant Dishes</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#666', fontSize: '0.9rem' }}>
          <span> Total dishes: {count}</span>
          <span>•</span>
          <span>Showing: {selectedCategory ? (categories.find(c => c.id === selectedCategory)?.name || 'Category') : 'All Dishes'}</span>
        </div>
      </div>

      <SearchFilters onSearch={handleSearch} onReset={handleReset} />

      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
          Searching...
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem'
      }}>
        {items.map(dish => (
          <DishCard
            key={dish.id}
            dish={dish}
          />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginTop: '1.5rem'
        }}>
          <div style={{ fontSize: '1.2rem', color: '#666', marginBottom: '0.5rem' }}>
            No dishes found
          </div>
          <div style={{ fontSize: '0.9rem', color: '#999' }}>
            Try adjusting your search filters
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        hasNext={!!next}
        hasPrevious={!!previous}
      />
    </div>
  );
};

const MenuPage = () => {
  return (
    <MenuLayout>
      <Menu />
    </MenuLayout>
  );
};

export default MenuPage;