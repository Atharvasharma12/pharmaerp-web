// src/features/auth/services/authService.js

import { apiClient, ENDPOINTS } from "@/services";

const authService = {
  register(payload) {
    return apiClient.post(ENDPOINTS.AUTH.REGISTER, payload);
  },

  login(payload) {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, payload);
  },

  logout() {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  forgotPassword(payload) {
    return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  },

  resetPassword(payload) {
    return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  },

  changePassword(payload) {
    return apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  },
};

export default authService;
