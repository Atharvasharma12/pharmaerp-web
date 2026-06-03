import { apiClient, ENDPOINTS } from "@/services";

const accessControlService = {
  // Permissions
  getAvailablePermissions() {
    return apiClient.get(ENDPOINTS.ACCESS_CONTROL.PERMISSIONS);
  },

  // Roles
  createRole(payload) {
    return apiClient.post(ENDPOINTS.ACCESS_CONTROL.ROLES, payload);
  },

  getWorkspaceRoles() {
    return apiClient.get(ENDPOINTS.ACCESS_CONTROL.ROLES);
  },

  getRoleById(roleId) {
    return apiClient.get(ENDPOINTS.ACCESS_CONTROL.ROLE_BY_ID(roleId));
  },

  updateRole(roleId, payload) {
    return apiClient.patch(
      ENDPOINTS.ACCESS_CONTROL.ROLE_BY_ID(roleId),
      payload,
    );
  },

  deleteRole(roleId) {
    return apiClient.delete(ENDPOINTS.ACCESS_CONTROL.ROLE_BY_ID(roleId));
  },

  assignRoleToMember(payload) {
    return apiClient.post(
      ENDPOINTS.ACCESS_CONTROL.ASSIGN_ROLE_TO_MEMBER,
      payload,
    );
  },

  // Member Access
  getWorkspaceMemberAccessList() {
    return apiClient.get(ENDPOINTS.ACCESS_CONTROL.MEMBER_ACCESS);
  },

  getMemberAccess(memberUserId) {
    return apiClient.get(
      ENDPOINTS.ACCESS_CONTROL.MEMBER_ACCESS_BY_USER_ID(memberUserId),
    );
  },

  updateMemberAccess(memberUserId, payload) {
    return apiClient.patch(
      ENDPOINTS.ACCESS_CONTROL.MEMBER_ACCESS_BY_USER_ID(memberUserId),
      payload,
    );
  },

  // Access Checks
  checkCompanyAccess(companyId) {
    return apiClient.get(ENDPOINTS.ACCESS_CONTROL.CHECK_COMPANY(companyId));
  },

  checkBranchAccess(branchId) {
    return apiClient.get(ENDPOINTS.ACCESS_CONTROL.CHECK_BRANCH(branchId));
  },
};

export default accessControlService;
