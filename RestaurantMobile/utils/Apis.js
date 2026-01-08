import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  DISHES: `${BASE_URL}/dishes/`,
  CATEGORIES: `${BASE_URL}/categories/`,
  USERS: `${BASE_URL}/users/`,
};

// Dishes API
export const fetchDishes = async (params = {}) => {
  try {
    const response = await axios.get(API_ENDPOINTS.DISHES, { params });
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching dishes:', error.message);
    throw error;
  }
};

export const fetchDishById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.DISHES}${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dish ${id}:`, error.message);
    throw error;
  }
};

// Categories API
export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.CATEGORIES);
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
};

// Featured dishes (extra: get top-rated or special dishes)
export const fetchFeaturedDishes = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.DISHES, { 
      params: { ordering: '-rating', limit: 3 } 
    });
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching featured dishes:', error.message);
    throw error;
  }
};

// About/Project Info - Static data
export const fetchAboutInfo = async () => {
  try {
    return {
      students: [
        {
          name: 'Bui Trong Nghia',
          studentId: '2351010136',
          role: 'Full Stack Developer',
        },
        {
          name: 'Le Minh Dang Khoa',
          studentId: '[MSSV]',
          role: 'Full Stack Developer',
        },
      ],
      techStack: {
        frontend: ['React', 'React Native', 'Redux Toolkit', 'React Navigation'],
        backend: ['Django REST API', 'PostgreSQL', 'JWT Auth'],
        tools: ['Expo', 'Git', 'VS Code', 'Postman'],
      },
      links: [
        {
          name: 'GitHub',
          url: 'https://github.com/ziu222/Restaurant',
        },
        {
          name: 'LinkedIn',
          url: 'https://linkedin.com',
        },
        {
          name: 'Portfolio',
          url: 'https://portfolio.example.com',
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching about info:', error.message);
    throw error;
  }
};
