import { apiClient, ENDPOINTS } from "@/services";

const financialPeriodService = {
  createFinancialPeriod(payload) {
    return apiClient.post(ENDPOINTS.FINANCIAL_PERIOD.CREATE, payload);
  },

  getFinancialPeriods(params = {}) {
    return apiClient.get(ENDPOINTS.FINANCIAL_PERIOD.LIST, {
      params,
    });
  },

  getCurrentFinancialPeriod() {
    return apiClient.get(ENDPOINTS.FINANCIAL_PERIOD.CURRENT);
  },

  updateFinancialPeriodStatus(periodId, payload) {
    return apiClient.patch(
      ENDPOINTS.FINANCIAL_PERIOD.UPDATE_STATUS(periodId),
      payload,
    );
  },
};

export default financialPeriodService;
