import { apiClient, ENDPOINTS } from "@/services";

const companyService = {
  createCompany(payload) {
    return apiClient.post(ENDPOINTS.COMPANY.CREATE, payload);
  },

  getWorkspaceCompanies() {
    return apiClient.get(ENDPOINTS.COMPANY.LIST);
  },

  getCompanyById(companyId) {
    return apiClient.get(ENDPOINTS.COMPANY.BY_ID(companyId));
  },

  updateCompany(companyId, payload) {
    return apiClient.patch(ENDPOINTS.COMPANY.BY_ID(companyId), payload);
  },

  deleteCompany(companyId) {
    return apiClient.delete(ENDPOINTS.COMPANY.BY_ID(companyId));
  },
};

export default companyService;
