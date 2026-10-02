import { apiClient, ENDPOINTS } from "@/services";

const branchCashService = {
  /**
   * List all branches' cash for the current company.
   */
  getAllBranchCash(params = {}) {
    return apiClient.get(ENDPOINTS.BRANCH_CASH.LIST, { params });
  },

  /**
   * Get running + frozen cash and denomination balance for a specific branch.
   */
  getBranchCash(branchId) {
    return apiClient.get(ENDPOINTS.BRANCH_CASH.BY_BRANCH(branchId));
  },

  /**
   * Deposit external cash into the RUNNING partition.
   * Shift must be open.
   * @param {object} payload { branchId, amount, denominations, narration }
   */
  depositCash(payload) {
    return apiClient.post(ENDPOINTS.BRANCH_CASH.DEPOSIT, payload);
  },

  /**
   * Withdraw cash from the FROZEN partition.
   * No shift requirement.
   * @param {object} payload { branchId, amount, denominations, narration }
   */
  withdrawCash(payload) {
    return apiClient.post(ENDPOINTS.BRANCH_CASH.WITHDRAW, payload);
  },
};

export default branchCashService;
