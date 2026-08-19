import { createAsyncThunk } from "@reduxjs/toolkit";

import workspaceService from "../services/workspaceService";

import { getErrorMessage } from "@/utils";

export const createWorkspace = createAsyncThunk(
  "workspace/createWorkspace",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await workspaceService.createWorkspace(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getMyWorkspaces = createAsyncThunk(
  "workspace/getMyWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getMyWorkspaces();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getWorkspaceById = createAsyncThunk(
  "workspace/getWorkspaceById",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getWorkspaceById(workspaceId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateWorkspace = createAsyncThunk(
  "workspace/updateWorkspace",
  async ({ workspaceId, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.updateWorkspace(
        workspaceId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteWorkspace = createAsyncThunk(
  "workspace/deleteWorkspace",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await workspaceService.deleteWorkspace(workspaceId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getWorkspaceMembers = createAsyncThunk(
  "workspace/getWorkspaceMembers",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getWorkspaceMembers(workspaceId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateWorkspaceMemberStatus = createAsyncThunk(
  "workspace/updateWorkspaceMemberStatus",
  async ({ workspaceId, memberUserId, status }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.updateWorkspaceMemberStatus(
        workspaceId,
        memberUserId,
        { status },
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const removeWorkspaceMember = createAsyncThunk(
  "workspace/removeWorkspaceMember",
  async ({ workspaceId, memberUserId }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.removeWorkspaceMember(
        workspaceId,
        memberUserId,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const directCreateWorkspaceMember = createAsyncThunk(
  "workspace/directCreateWorkspaceMember",
  async ({ workspaceId, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.directCreateWorkspaceMember(
        workspaceId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const resetMemberPassword = createAsyncThunk(
  "workspace/resetMemberPassword",
  async ({ workspaceId, memberUserId, password }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.resetMemberPassword(
        workspaceId,
        memberUserId,
        { password },
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const inviteWorkspaceMember = createAsyncThunk(
  "workspace/inviteWorkspaceMember",
  async ({ workspaceId, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.inviteWorkspaceMember(
        workspaceId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getWorkspaceInvitations = createAsyncThunk(
  "workspace/getWorkspaceInvitations",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response =
        await workspaceService.getWorkspaceInvitations(workspaceId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const cancelWorkspaceInvitation = createAsyncThunk(
  "workspace/cancelWorkspaceInvitation",
  async ({ workspaceId, invitationId }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.cancelWorkspaceInvitation(
        workspaceId,
        invitationId,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const resendWorkspaceInvitation = createAsyncThunk(
  "workspace/resendWorkspaceInvitation",
  async ({ workspaceId, invitationId }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.resendWorkspaceInvitation(
        workspaceId,
        invitationId,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateWorkspaceInvitation = createAsyncThunk(
  "workspace/updateWorkspaceInvitation",
  async ({ workspaceId, invitationId, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.updateWorkspaceInvitation(
        workspaceId,
        invitationId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const acceptWorkspaceInvitation = createAsyncThunk(
  "workspace/acceptWorkspaceInvitation",
  async (token, { rejectWithValue }) => {
    try {
      const response = await workspaceService.acceptWorkspaceInvitation(token);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const acceptWorkspaceInvitationSignup = createAsyncThunk(
  "workspace/acceptWorkspaceInvitationSignup",
  async ({ token, payload }, { rejectWithValue }) => {
    try {
      const response =
        await workspaceService.acceptWorkspaceInvitationSignup(token, payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getPublicInvitationDetails = createAsyncThunk(
  "workspace/getPublicInvitationDetails",
  async (token, { rejectWithValue }) => {
    try {
      const response =
        await workspaceService.getPublicInvitationDetails(token);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// --- NEW USER PROFILE DIRECT INBOX INTEGRATIONS ---

export const getIncomingUserInvitations = createAsyncThunk(
  "workspace/getIncomingUserInvitations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getIncomingUserInvitations();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const acceptIncomingInvitation = createAsyncThunk(
  "workspace/acceptIncomingInvitation",
  async (token, { rejectWithValue }) => {
    try {
      const response = await workspaceService.acceptWorkspaceInvitation(token);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
