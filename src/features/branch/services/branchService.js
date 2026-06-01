import { apiClient, ENDPOINTS } from "@/services";

const branchService = {
  createBranch(payload) {
    return apiClient.post(ENDPOINTS.BRANCH.CREATE, payload);
  },

  getCompanyBranches() {
    return apiClient.get(ENDPOINTS.BRANCH.LIST);
  },

  getBranchById(branchId) {
    return apiClient.get(ENDPOINTS.BRANCH.BY_ID(branchId));
  },

  updateBranch(branchId, payload) {
    return apiClient.patch(ENDPOINTS.BRANCH.BY_ID(branchId), payload);
  },

  deleteBranch(branchId) {
    return apiClient.delete(ENDPOINTS.BRANCH.BY_ID(branchId));
  },
};

export default branchService;
