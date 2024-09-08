"use client";
import { createSlice } from "@reduxjs/toolkit";
export const usernameSlice = createSlice({
  initialState: "",
  name: "username",
  reducers: {
    setUsername: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});
export const { setUsername } = usernameSlice.actions;
export default usernameSlice.reducer;
