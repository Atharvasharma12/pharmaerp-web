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

  async getCompanyEmployees(companyId) {
    try {
      const res = await apiClient.get(ENDPOINTS.COMPANY.MEMBERS(companyId));
      return res;
    } catch {
      // Fallback to member access query filtered by companyId
      const fallbackRes = await apiClient.get(ENDPOINTS.ACCESS_CONTROL.MEMBER_ACCESS);
      const allMembers = fallbackRes.data?.data || [];
      const companyMembers = allMembers.filter((m) => {
        if (m.accessAllCompanies) return true;
        const compIds = (m.companyIds || m.companies || []).map((c) =>
          String(c?._id || c),
        );
        return compIds.includes(String(companyId));
      });
      return { data: { data: companyMembers } };
    }
  },
};

export default companyService;
