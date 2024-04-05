import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});



const initialActiveState = {
  active: null,
};

export const activeSlice = createSlice({
  name: "active",
  initialState: initialActiveState,
  reducers: {
    setActive: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { setActive } = activeSlice.actions;
export const activeReducer = activeSlice.reducer;
export const { setLogin, setLogout } = authSlice.actions;
export const authReducer = authSlice.reducer;