import { apiClient, ENDPOINTS } from "@/services";

const reportsService = {
  getTrialBalance(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.TRIAL_BALANCE, { params });
  },

  getGeneralLedger(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.GENERAL_LEDGER, { params });
  },

  getCustomerLedger(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.CUSTOMER_LEDGER, { params });
  },

  getSupplierLedger(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.SUPPLIER_LEDGER, { params });
  },

  getCashBook(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.CASH_BOOK, { params });
  },

  getBankBook(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.BANK_BOOK, { params });
  },

  getProfitLoss(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.PROFIT_LOSS, { params });
  },

  getBalanceSheet(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.BALANCE_SHEET, { params });
  },

  getGstReport(params = {}) {
    return apiClient.get(ENDPOINTS.REPORTS.GST_REPORT, { params });
  },
};

export default reportsService;
