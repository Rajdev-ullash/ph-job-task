import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
    isLoading: false,
    user: null,
  },
  reducers: {
    // Actions
    //
    // Action: authLoading
    // Description: Set loading to true
    authLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { authLoading } = authSlice.actions;

export default authSlice.reducer;
