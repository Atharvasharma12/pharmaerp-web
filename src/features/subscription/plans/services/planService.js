import { apiClient, ENDPOINTS } from "@/services";

const planService = {
  // ─── Public Read ──────────────────────────────────────────────────────────────

  getPlans(params = {}) {
    return apiClient.get(ENDPOINTS.PLAN.LIST, { params });
  },

  getActivePlans() {
    return apiClient.get(ENDPOINTS.PLAN.ACTIVE);
  },

  getPlanById(planId) {
    return apiClient.get(ENDPOINTS.PLAN.BY_ID(planId));
  },

  // ─── Admin Write ──────────────────────────────────────────────────────────────

  createPlan(payload) {
    return apiClient.post(ENDPOINTS.PLAN.CREATE, payload);
  },

  updatePlan(planId, payload) {
    return apiClient.patch(ENDPOINTS.PLAN.UPDATE(planId), payload);
  },

  archivePlan(planId) {
    return apiClient.patch(ENDPOINTS.PLAN.ARCHIVE(planId));
  },

  restorePlan(planId) {
    return apiClient.patch(ENDPOINTS.PLAN.RESTORE(planId));
  },

  deletePlan(planId) {
    return apiClient.delete(ENDPOINTS.PLAN.DELETE(planId));
  },
};

export default planService;
