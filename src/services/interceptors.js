// src/services/interceptors.js

import { TOKEN_KEY } from "../constants";
import { storage, getErrorMessage } from "../utils";

const WORKSPACE_KEY = "workspaceId";
const COMPANY_KEY = "companyId";

export const setupInterceptors = (apiClient) => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = storage.get(TOKEN_KEY);
      const workspaceId = storage.get(WORKSPACE_KEY);
      const companyId = storage.get(COMPANY_KEY);

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
