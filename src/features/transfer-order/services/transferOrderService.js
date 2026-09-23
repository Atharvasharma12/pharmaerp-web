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
}

export default new TransferOrderService();
