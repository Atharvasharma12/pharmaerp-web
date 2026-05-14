import { apiClient, ENDPOINTS } from "@/services";

const planService = {
  getPlans(params = {}) {
    return apiClient.get(ENDPOINTS.PLAN.LIST, {
      params,
    });
  },

  getActivePlans() {
    return apiClient.get(ENDPOINTS.PLAN.ACTIVE);
  },

  getPlanById(planId) {
    return apiClient.get(ENDPOINTS.PLAN.BY_ID(planId));
  },
};

export default planService;
