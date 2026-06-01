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

export const addWorkspaceMember = createAsyncThunk(
  "workspace/addWorkspaceMember",
  async ({ workspaceId, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.addWorkspaceMember(
        workspaceId,
        payload,
      );

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
