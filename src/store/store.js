// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./rootReducer";
import { middlewares } from "./middlewares";
import { injectStore } from "../services/apiClient"; // IMPORT THIS: The runtime injection bridge

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
  devTools: import.meta.env.DEV,
});

// CRITICAL ACTION: Inject the living store instance straight into Axios interceptors
injectStore(store);

export default store;
