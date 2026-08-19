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

  inviteWorkspaceMember(workspaceId, payload) {
    return apiClient.post(
      ENDPOINTS.WORKSPACE.INVITATIONS(workspaceId),
      payload,
    );
  },

  getWorkspaceInvitations(workspaceId) {
    return apiClient.get(ENDPOINTS.WORKSPACE.INVITATIONS(workspaceId));
  },

  cancelWorkspaceInvitation(workspaceId, invitationId) {
    return apiClient.patch(
      ENDPOINTS.WORKSPACE.CANCEL_INVITATION(workspaceId, invitationId),
    );
  },

  resendWorkspaceInvitation(workspaceId, invitationId) {
    return apiClient.post(
      ENDPOINTS.WORKSPACE.RESEND_INVITATION(workspaceId, invitationId),
    );
  },

  updateWorkspaceInvitation(workspaceId, invitationId, payload) {
    return apiClient.patch(
      ENDPOINTS.WORKSPACE.UPDATE_INVITATION(workspaceId, invitationId),
      payload,
    );
  },

  acceptWorkspaceInvitation(token) {
    return apiClient.post(ENDPOINTS.WORKSPACE.ACCEPT_INVITATION(token));
  },

  acceptWorkspaceInvitationSignup(token, payload) {
    return apiClient.post(
      ENDPOINTS.WORKSPACE.ACCEPT_INVITATION_SIGNUP(token),
      payload,
    );
  },

  getPublicInvitationDetails(token) {
    return apiClient.get(ENDPOINTS.WORKSPACE.PUBLIC_INVITATION_DETAILS(token));
  },

  // --- NEW USER PROFILE INCOMING INVITATIONS API ENDPOINT MAP ---

  getIncomingUserInvitations() {
    return apiClient.get(ENDPOINTS.WORKSPACE.USER_INBOX_INVITATIONS);
  },
};

export default workspaceService;
