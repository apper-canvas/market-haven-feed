import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    searchQuery: "",
    category: "",
    subcategory: "",
    priceRange: [0, 1000],
    brands: [],
    minRating: 0,
    inStockOnly: false,
    sortBy: "featured",
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.subcategory = "";
    },
    setSubcategory: (state, action) => {
      state.subcategory = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    toggleBrand: (state, action) => {
      const brand = action.payload;
      if (state.brands.includes(brand)) {
        state.brands = state.brands.filter(b => b !== brand);
      } else {
        state.brands.push(brand);
      }
    },
    setMinRating: (state, action) => {
      state.minRating = action.payload;
    },
    setInStockOnly: (state, action) => {
      state.inStockOnly = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.category = "";
      state.subcategory = "";
      state.priceRange = [0, 1000];
      state.brands = [];
      state.minRating = 0;
      state.inStockOnly = false;
      state.sortBy = "featured";
    },
  },
});

export const {
  setSearchQuery,
  setCategory,
  setSubcategory,
  setPriceRange,
  toggleBrand,
  setMinRating,
  setInStockOnly,
  setSortBy,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;