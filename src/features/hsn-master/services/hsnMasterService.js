import { apiClient, ENDPOINTS } from "@/services";

const hsnMasterService = {
  /**
   * Get HSN Masters (List)
   * GET /catalog/hsn-master
   *
   * Query Params:
   * {
   * isActive,
   * gstRate,
   * search,
   * page,
   * limit
   * }
   */
  getHsnMasters(params = {}) {
    return apiClient.get(ENDPOINTS.HSN_MASTER.LIST, {
      params,
    });
  },

  /**
   * Get HSN Master By Id
   * GET /catalog/hsn-master/:hsnId
   */
  getHsnMasterById(hsnId) {
    return apiClient.get(ENDPOINTS.HSN_MASTER.BY_ID(hsnId));
  },

  /**
   * Get HSN Master By Code
   * GET /catalog/hsn-master/code/:hsnCode
   */
  getHsnMasterByCode(hsnCode) {
    return apiClient.get(ENDPOINTS.HSN_MASTER.BY_CODE(hsnCode));
  },
};

export default hsnMasterService;
