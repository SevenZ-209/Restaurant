import { configureStore } from '@reduxjs/toolkit';
import dishesReducer from './dishesSlice';

// Cấu hình Redux store
const store = configureStore({
  reducer: {
    dishes: dishesReducer,
  },
});

export default store;