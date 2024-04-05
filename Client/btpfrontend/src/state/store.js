// store.js
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./userslice";
import { activeReducer } from "./activeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        active: activeReducer,
    },
});

export default store;
