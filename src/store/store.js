// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./rootReducer";
import { middlewares } from "./middlewares";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
  devTools: import.meta.env.DEV,
});

export default store;
