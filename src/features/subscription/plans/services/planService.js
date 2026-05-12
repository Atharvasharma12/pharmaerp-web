import { apiClient, ENDPOINTS } from "@/services";

const planService = {
  createPlan(payload) {
    return apiClient.post(ENDPOINTS.PLAN.CREATE, payload);
  },

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

  updatePlan(planId, payload) {
    return apiClient.patch(ENDPOINTS.PLAN.BY_ID(planId), payload);
  },

  deletePlan(planId) {
    return apiClient.delete(ENDPOINTS.PLAN.BY_ID(planId));
  },
};

export default planService;
