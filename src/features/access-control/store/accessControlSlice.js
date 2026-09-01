import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getAvailablePermissions,
  createRole,
  getWorkspaceRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignRoleToMember,
  getWorkspaceMemberAccessList,
  getMemberAccess,
  updateMemberAccess,
  checkCompanyAccess,
  checkBranchAccess,
  getMyAccess,
} from "./accessControlThunk";

const initialState = {
  roles: [],
  currentRole: null,

  permissions: [],

  memberAccessList: [],
  currentMemberAccess: null,

  companyAccessCheck: null,
  branchAccessCheck: null,

  myAccess: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createRoleStatus: API_STATUS.IDLE,
  getWorkspaceRolesStatus: API_STATUS.IDLE,
  getRoleStatus: API_STATUS.IDLE,
  updateRoleStatus: API_STATUS.IDLE,
  deleteRoleStatus: API_STATUS.IDLE,
  assignRoleToMemberStatus: API_STATUS.IDLE,

  getAvailablePermissionsStatus: API_STATUS.IDLE,

  getWorkspaceMemberAccessListStatus: API_STATUS.IDLE,
  getMemberAccessStatus: API_STATUS.IDLE,
  updateMemberAccessStatus: API_STATUS.IDLE,

  checkCompanyAccessStatus: API_STATUS.IDLE,
  checkBranchAccessStatus: API_STATUS.IDLE,

  getMyAccessStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
  state.message = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const accessControlSlice = createSlice({
  name: "accessControl",

  initialState,

  reducers: {
    clearAccessControlError(state) {
      state.error = null;
    },

    clearAccessControlMessage(state) {
      state.message = null;
    },

    clearCurrentRole(state) {
      state.currentRole = null;
    },

    clearCurrentMemberAccess(state) {
      state.currentMemberAccess = null;
    },

    clearMemberAccessCheck(state) {
      state.companyAccessCheck = null;
      state.branchAccessCheck = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET AVAILABLE PERMISSIONS
      .addCase(getAvailablePermissions.pending, (state) => {
        state.getAvailablePermissionsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getAvailablePermissions.fulfilled, (state, action) => {
        state.getAvailablePermissionsStatus = API_STATUS.SUCCESS;
        state.permissions = action.payload || [];
        state.message = "Permissions fetched successfully";
      })
      .addCase(getAvailablePermissions.rejected, (state, action) => {
        state.getAvailablePermissionsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch permissions";
      })

      // CREATE ROLE
      .addCase(createRole.pending, (state) => {
        state.createRoleStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.createRoleStatus = API_STATUS.SUCCESS;
        state.currentRole = action.payload || null;

        if (action.payload) {
          state.roles.unshift(action.payload);
        }

        state.message = "Role created successfully";
      })
      .addCase(createRole.rejected, (state, action) => {
        state.createRoleStatus = API_STATUS.ERROR;
        state.error = action.payload || "Role creation failed";
      })

      // GET WORKSPACE ROLES
      .addCase(getWorkspaceRoles.pending, (state) => {
        state.getWorkspaceRolesStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceRoles.fulfilled, (state, action) => {
        state.getWorkspaceRolesStatus = API_STATUS.SUCCESS;
        state.roles = action.payload || [];
        state.message = "Roles fetched successfully";
      })
      .addCase(getWorkspaceRoles.rejected, (state, action) => {
        state.getWorkspaceRolesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch roles";
      })

      // GET ROLE BY ID
      .addCase(getRoleById.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.getRoleStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getRoleStatus = API_STATUS.SUCCESS;

        state.currentRole = action.payload || null;

        state.message = "Role fetched successfully";
      })
      .addCase(getRoleById.rejected, (state, action) => {
        setRejected(state, action);
        state.getRoleStatus = API_STATUS.ERROR;
      })

      // UPDATE ROLE
      .addCase(updateRole.pending, (state) => {
        state.updateRoleStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.updateRoleStatus = API_STATUS.SUCCESS;

        state.currentRole = action.payload || state.currentRole;

        state.roles = state.roles.map((role) =>
          role?._id === action.payload?._id ? action.payload : role,
        );

        state.message = "Role updated successfully";
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.updateRoleStatus = API_STATUS.ERROR;
        state.error = action.payload || "Role update failed";
      })

      // DELETE ROLE
      .addCase(deleteRole.pending, (state) => {
        state.deleteRoleStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.deleteRoleStatus = API_STATUS.SUCCESS;

        state.roles = state.roles.filter(
          (role) => role?._id !== action.meta.arg,
        );

        if (state.currentRole?._id === action.meta.arg) {
          state.currentRole = null;
        }

        state.message = "Role deleted successfully";
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.deleteRoleStatus = API_STATUS.ERROR;
        state.error = action.payload || "Role delete failed";
      })

      // ASSIGN ROLE TO MEMBER
      .addCase(assignRoleToMember.pending, (state) => {
        state.assignRoleToMemberStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(assignRoleToMember.fulfilled, (state) => {
        state.assignRoleToMemberStatus = API_STATUS.SUCCESS;

        state.message = "Role assigned successfully";
      })
      .addCase(assignRoleToMember.rejected, (state, action) => {
        state.assignRoleToMemberStatus = API_STATUS.ERROR;
        state.error = action.payload || "Role assignment failed";
      })

      // GET MEMBER ACCESS LIST
      .addCase(getWorkspaceMemberAccessList.pending, (state) => {
        state.getWorkspaceMemberAccessListStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceMemberAccessList.fulfilled, (state, action) => {
        state.getWorkspaceMemberAccessListStatus = API_STATUS.SUCCESS;

        state.memberAccessList = action.payload || [];

        state.message = "Member access list fetched successfully";
      })
      .addCase(getWorkspaceMemberAccessList.rejected, (state, action) => {
        state.getWorkspaceMemberAccessListStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch member access list";
      })

      // GET MEMBER ACCESS
      .addCase(getMemberAccess.pending, (state) => {
        state.getMemberAccessStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getMemberAccess.fulfilled, (state, action) => {
        state.getMemberAccessStatus = API_STATUS.SUCCESS;

        state.currentMemberAccess = action.payload || null;

        state.message = "Member access fetched successfully";
      })
      .addCase(getMemberAccess.rejected, (state, action) => {
        state.getMemberAccessStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch member access";
      })

      // UPDATE MEMBER ACCESS
      .addCase(updateMemberAccess.pending, (state) => {
        state.updateMemberAccessStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateMemberAccess.fulfilled, (state, action) => {
        state.updateMemberAccessStatus = API_STATUS.SUCCESS;

        state.currentMemberAccess = action.payload || state.currentMemberAccess;

        state.memberAccessList = state.memberAccessList.map((item) =>
          item?._id === action.payload?._id ? action.payload : item,
        );

        state.message = "Member access updated successfully";
      })
      .addCase(updateMemberAccess.rejected, (state, action) => {
        state.updateMemberAccessStatus = API_STATUS.ERROR;
        state.error = action.payload || "Member access update failed";
      })

      // CHECK COMPANY ACCESS
      .addCase(checkCompanyAccess.pending, (state) => {
        state.checkCompanyAccessStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(checkCompanyAccess.fulfilled, (state, action) => {
        state.checkCompanyAccessStatus = API_STATUS.SUCCESS;

        state.companyAccessCheck = action.payload;

        state.message = "Company access checked successfully";
      })
      .addCase(checkCompanyAccess.rejected, (state, action) => {
        state.checkCompanyAccessStatus = API_STATUS.ERROR;
        state.error = action.payload || "Company access check failed";
      })

      // CHECK BRANCH ACCESS
      .addCase(checkBranchAccess.pending, (state) => {
        state.checkBranchAccessStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(checkBranchAccess.fulfilled, (state, action) => {
        state.checkBranchAccessStatus = API_STATUS.SUCCESS;

        state.branchAccessCheck = action.payload;

        state.message = "Branch access checked successfully";
      })
      .addCase(checkBranchAccess.rejected, (state, action) => {
        state.checkBranchAccessStatus = API_STATUS.ERROR;
        state.error = action.payload || "Branch access check failed";
      })

      // GET MY ACCESS (current logged-in user's own permissions)
      .addCase(getMyAccess.pending, (state) => {
        state.getMyAccessStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getMyAccess.fulfilled, (state, action) => {
        state.getMyAccessStatus = API_STATUS.SUCCESS;
        state.myAccess = action.payload || null;
      })
      .addCase(getMyAccess.rejected, (state, action) => {
        state.getMyAccessStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch your access permissions";
      });
  },
});

export const {
  clearAccessControlError,
  clearAccessControlMessage,
  clearCurrentRole,
  clearCurrentMemberAccess,
  clearMemberAccessCheck,
} = accessControlSlice.actions;

export default accessControlSlice.reducer;
