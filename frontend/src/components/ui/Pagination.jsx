import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, hasNext, hasPrevious }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '2rem',
      padding: '1rem'
    }}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: hasPrevious ? '#667eea' : '#e9ecef',
          cursor: hasPrevious ? 'pointer' : 'not-allowed',
          color: hasPrevious ? 'white' : '#adb5bd',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s',
          boxShadow: hasPrevious ? '0 2px 6px rgba(102, 126, 234, 0.3)' : 'none'
        }}
        onMouseEnter={(e) => {
          if (hasPrevious) e.target.style.backgroundColor = '#5568d3';
        }}
        onMouseLeave={(e) => {
          if (hasPrevious) e.target.style.backgroundColor = '#667eea';
        }}
      >
        ← Previous
      </button>

      {/* Page numbers */}
      {currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          >
            1
          </button>
          {currentPage > 4 && <span style={{ padding: '0 8px', color: '#adb5bd' }}>...</span>}
        </>
      )}

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '10px 14px',
            border: 'none',
            borderRadius: '8px',
            background: page === currentPage 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
              : '#f8f9fa',
            color: page === currentPage ? 'white' : '#2c3e50',
            cursor: 'pointer',
            fontWeight: page === currentPage ? '700' : '600',
            fontSize: '14px',
            transition: 'all 0.2s',
            boxShadow: page === currentPage ? '0 2px 6px rgba(102, 126, 234, 0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage) e.target.style.backgroundColor = '#e9ecef';
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage) e.target.style.backgroundColor = '#f8f9fa';
          }}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span style={{ padding: '0 8px', color: '#adb5bd' }}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: hasNext ? '#667eea' : '#e9ecef',
          cursor: hasNext ? 'pointer' : 'not-allowed',
          color: hasNext ? 'white' : '#adb5bd',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s',
          boxShadow: hasNext ? '0 2px 6px rgba(102, 126, 234, 0.3)' : 'none'
        }}
        onMouseEnter={(e) => {
          if (hasNext) e.target.style.backgroundColor = '#5568d3';
        }}
        onMouseLeave={(e) => {
          if (hasNext) e.target.style.backgroundColor = '#667eea';
        }}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
