import { apiClient } from "@/services";

const dayClosingService = {
  createDayClosing(payload) {
    return apiClient.post("/operations/day-closings", payload);
  },
  listDayClosings(params) {
    return apiClient.get("/operations/day-closings", { params });
  },
  getDayClosingById(id) {
    return apiClient.get(`/operations/day-closings/${id}`);
  },
  updateDayClosingStatus(id, payload) {
    return apiClient.patch(`/operations/day-closings/${id}/status`, payload);
  },
  cancelDayClosing(id, payload) {
    return apiClient.patch(`/operations/day-closings/${id}/cancel`, payload);
  },
};

export default dayClosingService;
