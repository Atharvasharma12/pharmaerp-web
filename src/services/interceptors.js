// src/services/interceptors.js

import {
  TOKEN_KEY,
  WORKSPACE_STORAGE_KEY,
  COMPANY_STORAGE_KEY,
  BRANCH_STORAGE_KEY,
} from "../constants";

import { storage, getErrorMessage } from "../utils";

export const setupInterceptors = (apiClient) => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = storage.get(TOKEN_KEY);

      const workspaceId = storage.get(WORKSPACE_STORAGE_KEY);
      const companyId = storage.get(COMPANY_STORAGE_KEY);
      const branchId = storage.get(BRANCH_STORAGE_KEY);

      config.headers = config.headers || {};

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (workspaceId) {
        config.headers["x-workspace-id"] = workspaceId;
      }

      if (companyId) {
        config.headers["x-company-id"] = companyId;
      }

      if (branchId) {
        config.headers["x-branch-id"] = branchId;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const statusCode = error?.response?.status;

      if (statusCode === 401) {
        storage.remove(TOKEN_KEY);
      }

      error.message = getErrorMessage(error);

      return Promise.reject(error);
    },
  );
};
