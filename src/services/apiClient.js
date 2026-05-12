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

setupInterceptors(apiClient);

export default apiClient;
