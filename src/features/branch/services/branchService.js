import { apiClient, ENDPOINTS } from "@/services";

const branchService = {
  createBranch(payload) {
    return apiClient.post(ENDPOINTS.BRANCH.CREATE, payload);
  },

  getCompanyBranches() {
    return apiClient.get(ENDPOINTS.BRANCH.LIST);
  },

  getWorkspaceBranches() {
    return apiClient.get(ENDPOINTS.BRANCH.WORKSPACE_LIST);
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

  async getBranchEmployees(branchId) {
    try {
      const response = await apiClient.get(ENDPOINTS.BRANCH.EMPLOYEES(branchId));
      if (response && (response.data || Array.isArray(response))) {
        return response;
      }
    } catch {
      // Fallback through member access query
    }

    try {
      const accessResponse = await apiClient.get(ENDPOINTS.ACCESS_CONTROL.MEMBER_ACCESS);
      const members = accessResponse?.data || accessResponse || [];
      if (Array.isArray(members)) {
        const filtered = members.filter((m) => {
          if (m.isOwner || m.accessAllBranches) return true;
          if (Array.isArray(m.branchIds)) {
            return m.branchIds.some(
              (bId) => String(bId._id || bId) === String(branchId)
            );
          }
          if (Array.isArray(m.branches)) {
            return m.branches.some(
              (b) => String(b._id || b) === String(branchId)
            );
          }
          return false;
        });
        return { data: filtered, success: true };
      }
    } catch {
      // Regulated by store selectors
    }

    return { data: [], success: true };
  },
};

export default branchService;
