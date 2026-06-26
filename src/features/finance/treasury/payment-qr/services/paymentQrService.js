import { apiClient, ENDPOINTS } from "@/services";

const paymentQrService = {
  createPaymentQr(payload) {
    return apiClient.post(ENDPOINTS.PAYMENT_QR.CREATE, payload);
  },

  getPaymentQrs(params = {}) {
    return apiClient.get(ENDPOINTS.PAYMENT_QR.LIST, {
      params,
    });
  },

  getPaymentQrById(paymentQrId) {
    return apiClient.get(ENDPOINTS.PAYMENT_QR.BY_ID(paymentQrId));
  },

  updatePaymentQr(paymentQrId, payload) {
    return apiClient.patch(ENDPOINTS.PAYMENT_QR.BY_ID(paymentQrId), payload);
  },

  deletePaymentQr(paymentQrId) {
    return apiClient.delete(ENDPOINTS.PAYMENT_QR.BY_ID(paymentQrId));
  },

  setPrimaryPaymentQr(paymentQrId) {
    return apiClient.post(ENDPOINTS.PAYMENT_QR.SET_PRIMARY(paymentQrId));
  },
};

export default paymentQrService;
