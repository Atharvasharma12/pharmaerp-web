// src/services/interceptors.js

import { TOKEN_KEY } from "../constants";
import { storage, getErrorMessage } from "../utils";

const WORKSPACE_KEY = "workspaceId";

export const setupInterceptors = (apiClient) => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = storage.get(TOKEN_KEY);
      const workspaceId = storage.get(WORKSPACE_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (workspaceId) {
        config.headers["x-workspace-id"] = workspaceId;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
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
