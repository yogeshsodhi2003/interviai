import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  email: null,
  name: null,
  resumeSummary: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { email, name } = action.payload;
      state.email = email;
      state.name = name;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      Object.assign(state, initialState);
    },
    updateResumeSummary(state, action) {
      state.resumeSummary = action.payload;
    },
  },
});

export const { setUser, clearUser, updateResumeSummary } = userSlice.actions;
export default userSlice.reducer;
