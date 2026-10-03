// src/config/env.js

const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "ERP Frontend",

  NODE_ENV: import.meta.env.VITE_NODE_ENV || "development",

  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api/v1",

  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",

  TOKEN_KEY: import.meta.env.VITE_TOKEN_KEY || "access_token",

  REQUEST_TIMEOUT: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 30000),

  ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS === "true",

  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || "en",

  DEFAULT_THEME: import.meta.env.VITE_DEFAULT_THEME || "light",
};

export default env;
