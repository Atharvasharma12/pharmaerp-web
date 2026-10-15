import { apiClient, ENDPOINTS } from "@/services";

const doctorService = {
  createDoctor(payload) {
    return apiClient.post(ENDPOINTS.DOCTOR.CREATE, payload);
  },

  getDoctors(params = {}) {
    return apiClient.get(ENDPOINTS.DOCTOR.LIST, {
      params,
    });
  },

  getDoctorById(doctorId) {
    return apiClient.get(ENDPOINTS.DOCTOR.BY_ID(doctorId));
  },

  updateDoctor(doctorId, payload) {
    return apiClient.patch(ENDPOINTS.DOCTOR.BY_ID(doctorId), payload);
  },

  deleteDoctor(doctorId) {
    return apiClient.delete(ENDPOINTS.DOCTOR.BY_ID(doctorId));
  },
};

export default doctorService;
