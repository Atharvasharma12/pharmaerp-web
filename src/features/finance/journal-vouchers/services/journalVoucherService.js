import { apiClient, ENDPOINTS } from "@/services";

const journalVoucherService = {
  createJournalVoucher(payload) {
    return apiClient.post(ENDPOINTS.JOURNAL_VOUCHER.CREATE, payload);
  },

  getJournalVouchers(params = {}) {
    return apiClient.get(ENDPOINTS.JOURNAL_VOUCHER.LIST, {
      params,
    });
  },

  getJournalVoucherById(voucherId) {
    return apiClient.get(ENDPOINTS.JOURNAL_VOUCHER.BY_ID(voucherId));
  },

  updateJournalVoucher(voucherId, payload) {
    return apiClient.patch(ENDPOINTS.JOURNAL_VOUCHER.BY_ID(voucherId), payload);
  },

  postJournalVoucher(voucherId) {
    return apiClient.post(ENDPOINTS.JOURNAL_VOUCHER.POST(voucherId));
  },

  cancelJournalVoucher(voucherId) {
    return apiClient.post(ENDPOINTS.JOURNAL_VOUCHER.CANCEL(voucherId));
  },

  submitJournalVoucherApproval(voucherId) {
    return apiClient.post(ENDPOINTS.JOURNAL_VOUCHER.SUBMIT_APPROVAL(voucherId));
  },

  approveJournalVoucher(voucherId) {
    return apiClient.post(ENDPOINTS.JOURNAL_VOUCHER.APPROVE(voucherId));
  },

  reverseJournalVoucher(voucherId) {
    return apiClient.post(ENDPOINTS.JOURNAL_VOUCHER.REVERSE(voucherId));
  },
};

export default journalVoucherService;
