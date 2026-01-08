import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchDishes = createAsyncThunk('dishes/fetchDishes', async () => {
  const response = await axios.get(`${API_BASE_URL}/dishes/`);
  return response.data;
});

const dishesSlice = createSlice({
  name: 'dishes',
  initialState: {
    dishes: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.loading = false;
        state.dishes = action.payload.results || action.payload;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dishesSlice.reducer;
