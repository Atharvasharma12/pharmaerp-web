import { apiClient, ENDPOINTS } from "@/services";

const accountGroupService = {
  createAccountGroup(payload) {
    return apiClient.post(ENDPOINTS.ACCOUNT_GROUP.CREATE, payload);
  },

  getAccountGroups(params = {}) {
    return apiClient.get(ENDPOINTS.ACCOUNT_GROUP.LIST, {
      params,
    });
  },

  getAccountGroupById(accountGroupId) {
    return apiClient.get(ENDPOINTS.ACCOUNT_GROUP.BY_ID(accountGroupId));
  },

  updateAccountGroup(accountGroupId, payload) {
    return apiClient.patch(
      ENDPOINTS.ACCOUNT_GROUP.BY_ID(accountGroupId),
      payload,
    );
  },

  deleteAccountGroup(accountGroupId) {
    return apiClient.delete(ENDPOINTS.ACCOUNT_GROUP.BY_ID(accountGroupId));
  },
};

export default accountGroupService;
