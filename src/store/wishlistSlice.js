import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromStorage = () => {
  try {
    const wishlist = localStorage.getItem("market-haven-wishlist");
    return wishlist ? JSON.parse(wishlist) : { productIds: [], addedDates: {} };
  } catch {
    return { productIds: [], addedDates: {} };
  }
};

const saveWishlistToStorage = (wishlist) => {
  localStorage.setItem("market-haven-wishlist", JSON.stringify(wishlist));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: loadWishlistFromStorage(),
  reducers: {
    addToWishlist: (state, action) => {
      const productId = action.payload;
      if (!state.productIds.includes(productId)) {
        state.productIds.push(productId);
        state.addedDates[productId] = new Date().toISOString();
        saveWishlistToStorage(state);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.productIds = state.productIds.filter(id => id !== productId);
      delete state.addedDates[productId];
      saveWishlistToStorage(state);
    },
    clearWishlist: (state) => {
      state.productIds = [];
      state.addedDates = {};
      saveWishlistToStorage(state);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;