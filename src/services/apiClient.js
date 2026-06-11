// src/services/apiClient.js

import axios from "axios";

import env from "../config/env";
import { setupInterceptors } from "./interceptors";

const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Set up interceptors with a null store initial value at load time
setupInterceptors(apiClient, null);

// FIXED: Export dynamic injection bridge to pass the store instance down without circular reference loops
export const injectStore = (store) => {
  setupInterceptors(apiClient, store);
};

export default apiClient;
