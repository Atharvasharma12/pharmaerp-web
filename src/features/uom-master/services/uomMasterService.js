import { apiClient, ENDPOINTS } from "@/services";

const uomMasterService = {
  /**
   * Get UOM Masters (List)
   * GET /catalog/uom-master
   *
   * Query Params:
   * {
   *   isActive,
   *   search,
   *   page,
   *   limit
   * }
   */
  getUomMasters(params = {}) {
    return apiClient.get(ENDPOINTS.UOM_MASTER.LIST, {
      params,
    });
  },

  /**
   * Get UOM Master By Id
   * GET /catalog/uom-master/:uomId
   */
  getUomMasterById(uomId) {
    return apiClient.get(ENDPOINTS.UOM_MASTER.BY_ID(uomId));
  },
};

export default uomMasterService;
