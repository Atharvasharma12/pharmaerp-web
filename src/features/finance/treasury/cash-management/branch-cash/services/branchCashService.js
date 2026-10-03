import { apiClient, ENDPOINTS } from "@/services";

const branchCashService = {
  /** List all branches' cash for the current company. */
  getAllBranchCash(params = {}) {
    return apiClient.get(ENDPOINTS.BRANCH_CASH.LIST, { params });
  },

  /** Get running + frozen cash and denomination balance for a specific branch. */
  getBranchCash(branchId) {
    return apiClient.get(ENDPOINTS.BRANCH_CASH.BY_BRANCH(branchId));
  },

  /**
   * Initialize BranchCash with an opening balance.
   * All denominations go to RUNNING. No shift required.
   * @param {{ branchId, openingAmount, openingDenominations, narration? }} payload
   */
  initializeBranchCash(payload) {
    return apiClient.post(ENDPOINTS.BRANCH_CASH.INITIALIZE, payload);
  },

  /**
   * Deposit external cash into the RUNNING partition. Shift must be open.
   * @param {{ branchId, amount, denominations, narration? }} payload
   */
  depositCash(payload) {
    return apiClient.post(ENDPOINTS.BRANCH_CASH.DEPOSIT, payload);
  },

  /**
   * Withdraw cash from running, frozen, or a bank slip.
   * @param {{ branchId, source, slipId?, amount, denominations, narration? }} payload
   */
  withdrawCash(payload) {
    return apiClient.post(ENDPOINTS.BRANCH_CASH.WITHDRAW, payload);
  },
};

export default branchCashService;
