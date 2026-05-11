import { apiClient, ENDPOINTS } from "@/services";

const userService = {
  getProfile() {
    return apiClient.get(ENDPOINTS.USER.PROFILE);
  },

  updateProfile(payload) {
    return apiClient.patch(ENDPOINTS.USER.UPDATE_PROFILE, payload);
  },

  updateAvatar(payload) {
    return apiClient.patch(ENDPOINTS.USER.UPDATE_AVATAR, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteAvatar() {
    return apiClient.delete(ENDPOINTS.USER.DELETE_AVATAR);
  },

  deactivateAccount() {
    return apiClient.patch(ENDPOINTS.USER.DEACTIVATE_ACCOUNT);
  },
};

export default userService;
