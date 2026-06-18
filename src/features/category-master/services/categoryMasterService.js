import { apiClient, ENDPOINTS } from "@/services";

const categoryMasterService = {
  /**
   * Get Category Masters (List)
   * GET /catalog/category-master
   *
   * Query Params:
   * {
   *   isActive,
   *   parentCategory,
   *   level,
   *   search,
   *   page,
   *   limit
   * }
   */
  getCategoryMasters(params = {}) {
    return apiClient.get(ENDPOINTS.CATEGORY_MASTER.LIST, {
      params,
    });
  },

  /**
   * Get Category Master By Id
   * GET /catalog/category-master/:categoryId
   */
  getCategoryMasterById(categoryId) {
    return apiClient.get(ENDPOINTS.CATEGORY_MASTER.BY_ID(categoryId));
  },

  /**
   * Get Category Master By Slug
   * GET /catalog/category-master/slug/:slug
   */
  getCategoryMasterBySlug(slug) {
    return apiClient.get(ENDPOINTS.CATEGORY_MASTER.BY_SLUG(slug));
  },
};

export default categoryMasterService;
