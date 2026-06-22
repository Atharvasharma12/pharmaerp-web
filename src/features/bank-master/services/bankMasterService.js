import { apiClient, ENDPOINTS } from "@/services";

const bankMasterService = {
  /**
   * Get Bank Masters (List)
   * GET /catalog/bank-master
   *
   * Query Params:
   * {
   *   isActive,
   *   search,
   *   page,
   *   limit
   * }
   */
  getBankMasters(params = {}) {
    return apiClient.get(ENDPOINTS.BANK_MASTER.LIST, {
      params,
    });
  },

  /**
   * Get Bank Master By Id
   * GET /catalog/bank-master/:bankId
   */
  getBankMasterById(bankId) {
    return apiClient.get(ENDPOINTS.BANK_MASTER.BY_ID(bankId));
  },

  /**
   * Get Bank Master By Name
   * GET /catalog/bank-master/name/:name
   */
  getBankMasterByName(name) {
    return apiClient.get(ENDPOINTS.BANK_MASTER.BY_NAME(name));
  },
};

export default bankMasterService;
