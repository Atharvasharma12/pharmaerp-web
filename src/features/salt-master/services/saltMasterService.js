import { apiClient, ENDPOINTS } from "@/services";

const saltMasterService = {
  /**
   * Get Salt Masters (List)
   * GET /catalog/salt-master
   *
   * Query Params:
   * {
   *   isActive,
   *   search,
   *   page,
   *   limit
   * }
   */
  getSaltMasters(params = {}) {
    return apiClient.get(ENDPOINTS.SALT_MASTER.LIST, {
      params,
    });
  },

  /**
   * Get Salt Master By Id
   * GET /catalog/salt-master/:saltId
   */
  getSaltMasterById(saltId) {
    return apiClient.get(ENDPOINTS.SALT_MASTER.BY_ID(saltId));
  },

  /**
   * Get Salt Master By Name
   * GET /catalog/salt-master/name/:name
   */
  getSaltMasterByName(name) {
    return apiClient.get(ENDPOINTS.SALT_MASTER.BY_NAME(name));
  },
};

export default saltMasterService;
