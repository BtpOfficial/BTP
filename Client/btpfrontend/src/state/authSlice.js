import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    id: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setId: (state, action) => {
            console.log(state, action)
            state.id = action.payload;
        }
    },
});

export const { setLogin, setLogout, setId } = authSlice.actions;
export default authSlice.reducer;