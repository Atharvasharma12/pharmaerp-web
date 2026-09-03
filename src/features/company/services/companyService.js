import { apiClient, ENDPOINTS } from "@/services";

const companyService = {
  createCompany(payload) {
    return apiClient.post(ENDPOINTS.COMPANY.CREATE, payload);
  },

  getWorkspaceCompanies() {
    return apiClient.get(ENDPOINTS.COMPANY.LIST);
  },

  getCompanyById(companyId) {
    return apiClient.get(ENDPOINTS.COMPANY.BY_ID(companyId));
  },

  updateCompany(companyId, payload) {
    return apiClient.patch(ENDPOINTS.COMPANY.BY_ID(companyId), payload);
  },

  deleteCompany(companyId) {
    return apiClient.delete(ENDPOINTS.COMPANY.BY_ID(companyId));
  },

  async getCompanyEmployees(companyId) {
    try {
      const res = await apiClient.get(ENDPOINTS.COMPANY.MEMBERS(companyId));
      if (res?.data?.data || Array.isArray(res?.data)) {
        return res;
      }
    } catch {
      // Fallback
    }

    try {
      const fallbackRes = await apiClient.get(
        ENDPOINTS.ACCESS_CONTROL.MEMBER_ACCESS,
      );
      const allMembers = fallbackRes.data?.data || fallbackRes.data || [];
      const companyMembers = allMembers
        .filter((m) => {
          if (m.isOwner || m.accessAllCompanies) return true;
          const compIds = (m.companyIds || m.companies || []).map((c) =>
            String(c?._id || c),
          );
          return compIds.includes(String(companyId));
        })
        .map((m, idx) => {
          const userObj = m.userId && typeof m.userId === "object" ? m.userId : null;
          const roleObj =
            m.workspaceMemberId?.roleId && typeof m.workspaceMemberId.roleId === "object"
              ? m.workspaceMemberId.roleId
              : m.roleId && typeof m.roleId === "object"
                ? m.roleId
                : null;

          return {
            _id: m._id || m.workspaceMemberId?._id || `member-${idx}`,
            id: m._id || m.workspaceMemberId?._id || `member-${idx}`,
            user: userObj || m.user || null,
            displayName:
              userObj?.name ||
              userObj?.fullName ||
              m.user?.name ||
              m.name ||
              `Member #${idx + 1}`,
            displayEmail: userObj?.email || m.user?.email || m.email || "-",
            displayPhone: userObj?.phone || userObj?.mobile || m.user?.phone || "-",
            role: roleObj || m.role || null,
            roleName:
              m.isOwner || m.workspaceMemberId?.isOwner
                ? "Owner"
                : roleObj?.name || m.roleName || m.role?.name || "Staff Member",
            status: m.status || m.workspaceMemberId?.status || "active",
            isOwner: Boolean(m.isOwner || m.workspaceMemberId?.isOwner),
            accessAllCompanies: Boolean(m.accessAllCompanies || m.isOwner),
          };
        });

      return { data: { data: companyMembers } };
    } catch {
      return { data: { data: [] } };
    }
  },
};

export default companyService;
