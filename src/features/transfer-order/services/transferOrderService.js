import { apiClient } from "@/services";

class TransferOrderService {
  async createTransferOrder(data) {
    return apiClient.post("/transfer-orders", data);
  }

  async getTransferOrders(params) {
    return apiClient.get("/transfer-orders", { params });
  }

  async getTransferOrderById(id) {
    return apiClient.get(`/transfer-orders/${id}`);
  }

  async receiveTransferOrder(id) {
    return apiClient.post(`/transfer-orders/${id}/receive`);
  }

  async cancelTransferOrder(id, data = {}) {
    return apiClient.post(`/transfer-orders/${id}/cancel`, data);
  }

  async updateTransferOrder(id, data) {
    return apiClient.put(`/transfer-orders/${id}`, data);
  }
}

export default new TransferOrderService();
