import { apiClient, ENDPOINTS } from "@/services";

const manufacturerMasterService = {
  /**
   * Get Manufacturer Masters (List)
   * GET /catalog/manufacturer-master
   *
   * Query Params:
   * {
   *   isActive,
   *   search,
   *   page,
   *   limit
   * }
   */
  getManufacturerMasters(params = {}) {
    return apiClient.get(ENDPOINTS.MANUFACTURER_MASTER.LIST, {
      params,
    });
  },

  /**
   * Get Manufacturer Master By Id
   * GET /catalog/manufacturer-master/:manufacturerId
   */
  getManufacturerMasterById(manufacturerId) {
    return apiClient.get(ENDPOINTS.MANUFACTURER_MASTER.BY_ID(manufacturerId));
  },

  /**
   * Get Manufacturer Master By Name
   * GET /catalog/manufacturer-master/name/:name
   */
  getManufacturerMasterByName(name) {
    return apiClient.get(ENDPOINTS.MANUFACTURER_MASTER.BY_NAME(name));
  },
};

export default manufacturerMasterService;
