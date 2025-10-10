// features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firebaseUid: null,
  email: null,
  name: null,
  resumeSummary: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { firebaseUid, email, name, resumeSummary } = action.payload;
      state.firebaseUid = firebaseUid;
      state.email = email;
      state.name = name;
      state.resumeSummary = resumeSummary || null;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
