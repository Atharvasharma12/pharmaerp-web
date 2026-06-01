import { apiClient, ENDPOINTS } from "@/services";

const workspaceService = {
  createWorkspace(payload) {
    return apiClient.post(ENDPOINTS.WORKSPACE.CREATE, payload);
  },

  getMyWorkspaces() {
    return apiClient.get(ENDPOINTS.WORKSPACE.LIST);
  },

  getWorkspaceById(workspaceId) {
    return apiClient.get(ENDPOINTS.WORKSPACE.BY_ID(workspaceId));
  },

  updateWorkspace(workspaceId, payload) {
    return apiClient.patch(ENDPOINTS.WORKSPACE.BY_ID(workspaceId), payload);
  },

  deleteWorkspace(workspaceId) {
    return apiClient.delete(ENDPOINTS.WORKSPACE.BY_ID(workspaceId));
  },

  getWorkspaceMembers(workspaceId) {
    return apiClient.get(ENDPOINTS.WORKSPACE.MEMBERS(workspaceId));
  },

  addWorkspaceMember(workspaceId, payload) {
    return apiClient.post(ENDPOINTS.WORKSPACE.MEMBERS(workspaceId), payload);
  },

  updateWorkspaceMemberStatus(workspaceId, memberUserId, payload) {
    return apiClient.patch(
      ENDPOINTS.WORKSPACE.MEMBER_STATUS(workspaceId, memberUserId),
      payload,
    );
  },

  removeWorkspaceMember(workspaceId, memberUserId) {
    return apiClient.delete(
      ENDPOINTS.WORKSPACE.MEMBER_BY_USER_ID(workspaceId, memberUserId),
    );
  },
};

export default workspaceService;
