import { createAsyncThunk } from "@reduxjs/toolkit";

import accessControlService from "../services/accessControlService";

import { getErrorMessage } from "@/utils";

// Permissions
export const getAvailablePermissions = createAsyncThunk(
  "accessControl/getAvailablePermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlService.getAvailablePermissions();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Roles
export const createRole = createAsyncThunk(
  "accessControl/createRole",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await accessControlService.createRole(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getWorkspaceRoles = createAsyncThunk(
  "accessControl/getWorkspaceRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlService.getWorkspaceRoles();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getRoleById = createAsyncThunk(
  "accessControl/getRoleById",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await accessControlService.getRoleById(roleId);

      return response?.data?.data || response?.data || response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
export const updateRole = createAsyncThunk(
  "accessControl/updateRole",
  async ({ roleId, payload }, { rejectWithValue }) => {
    try {
      const response = await accessControlService.updateRole(roleId, payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteRole = createAsyncThunk(
  "accessControl/deleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await accessControlService.deleteRole(roleId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const assignRoleToMember = createAsyncThunk(
  "accessControl/assignRoleToMember",
  async ({ memberUserId, payload }, { rejectWithValue }) => {
    try {
      const response = await accessControlService.assignRoleToMember(
        memberUserId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Member Access
export const getWorkspaceMemberAccessList = createAsyncThunk(
  "accessControl/getWorkspaceMemberAccessList",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await accessControlService.getWorkspaceMemberAccessList();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getMemberAccess = createAsyncThunk(
  "accessControl/getMemberAccess",
  async (memberUserId, { rejectWithValue }) => {
    try {
      const response = await accessControlService.getMemberAccess(memberUserId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getMyAccess = createAsyncThunk(
  "accessControl/getMyAccess",
  async (_, { rejectWithValue }) => {
    try {
      const response = await accessControlService.getMyAccess();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateMemberAccess = createAsyncThunk(
  "accessControl/updateMemberAccess",
  async ({ memberUserId, payload }, { rejectWithValue }) => {
    try {
      const response = await accessControlService.updateMemberAccess(
        memberUserId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Access Checks
export const checkCompanyAccess = createAsyncThunk(
  "accessControl/checkCompanyAccess",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await accessControlService.checkCompanyAccess(companyId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const checkBranchAccess = createAsyncThunk(
  "accessControl/checkBranchAccess",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await accessControlService.checkBranchAccess(branchId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
