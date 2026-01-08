import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk để lấy danh sách các món ăn
export const fetchDishes = createAsyncThunk(
  'dishes/fetchDishes',
  // params: { categoryId, q, chefId, minPrice, maxPrice, ordering, page }
  async (params = {}, { rejectWithValue }) => {
    try {
      const { categoryId, q, chefId, minPrice, maxPrice, minPrepare, maxPrepare, ordering, page } = params;
      const url = new URL('http://127.0.0.1:8000/dishes/');
      if (categoryId) url.searchParams.append('category_id', categoryId);
      if (q) url.searchParams.append('q', q);
      if (chefId) url.searchParams.append('chef_id', chefId);
      if (minPrice) url.searchParams.append('min_price', minPrice);
      if (maxPrice) url.searchParams.append('max_price', maxPrice);
      if (minPrepare) url.searchParams.append('min_prepare', minPrepare);
      if (maxPrepare) url.searchParams.append('max_prepare', maxPrepare);
      if (ordering) url.searchParams.append('ordering', ordering);
      if (page) url.searchParams.append('page', page);
      
      const response = await axios.get(url.toString());
      return {
        items: response.data.results || response.data,
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dishes');
    }
  }
);

// Redux slice cho các món ăn
const dishesSlice = createSlice({
  name: 'dishes',
  initialState: { 
    items: [], 
    loading: false, 
    error: null,
    count: 0,
    next: null,
    previous: null,
    currentPage: 1
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage } = dishesSlice.actions;
export default dishesSlice.reducer;