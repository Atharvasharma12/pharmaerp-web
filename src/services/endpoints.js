// src/services/endpoints.js

export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/core/auth/register",
    LOGIN: "/core/auth/login",
    LOGOUT: "/core/auth/logout",
    FORGOT_PASSWORD: "/core/auth/forgot-password",
    RESET_PASSWORD: "/core/auth/reset-password",
    CHANGE_PASSWORD: "/core/auth/change-password",
  },

  USER: {
    PROFILE: "/core/users/profile",
    UPDATE_PROFILE: "/core/users/profile",
  },
};

export default ENDPOINTS;
