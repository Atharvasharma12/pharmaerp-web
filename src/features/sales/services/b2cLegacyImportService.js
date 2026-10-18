import { apiClient, ENDPOINTS } from "@/services";

const b2cLegacyImportService = {
  uploadFile(file, options = {}) {
    const formData = new FormData();
    formData.append("file", file);
    if (options.sheetName) formData.append("sheetName", options.sheetName);
    if (options.chunkSize) formData.append("chunkSize", options.chunkSize);

    return apiClient.post(ENDPOINTS.SALES.LEGACY_IMPORT.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  startImport(migrationId, columnMapping = {}) {
    return apiClient.post(ENDPOINTS.SALES.LEGACY_IMPORT.START(migrationId), {
      columnMapping,
    });
  },

  pauseImport(migrationId) {
    return apiClient.post(ENDPOINTS.SALES.LEGACY_IMPORT.PAUSE(migrationId));
  },

  resumeImport(migrationId) {
    return apiClient.post(ENDPOINTS.SALES.LEGACY_IMPORT.RESUME(migrationId));
  },

  getStatus(migrationId) {
    return apiClient.get(ENDPOINTS.SALES.LEGACY_IMPORT.STATUS(migrationId));
  },

  getReport(migrationId) {
    return apiClient.get(ENDPOINTS.SALES.LEGACY_IMPORT.REPORT(migrationId));
  },
};

export default b2cLegacyImportService;
