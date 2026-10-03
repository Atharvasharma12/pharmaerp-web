import { createAsyncThunk } from "@reduxjs/toolkit";

import accountGroupService from "../services/accountGroupService";

import { getErrorMessage } from "@/utils";

// Create Account Group
export const createAccountGroup = createAsyncThunk(
  "accountGroup/createAccountGroup",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await accountGroupService.createAccountGroup(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Account Groups
export const getAccountGroups = createAsyncThunk(
  "accountGroup/getAccountGroups",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await accountGroupService.getAccountGroups(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Account Group By Id
export const getAccountGroupById = createAsyncThunk(
  "accountGroup/getAccountGroupById",
  async (accountGroupId, { rejectWithValue }) => {
    try {
      const response =
        await accountGroupService.getAccountGroupById(accountGroupId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Update Account Group
export const updateAccountGroup = createAsyncThunk(
  "accountGroup/updateAccountGroup",
  async ({ accountGroupId, payload }, { rejectWithValue }) => {
    try {
      const response = await accountGroupService.updateAccountGroup(
        accountGroupId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Delete Account Group
export const deleteAccountGroup = createAsyncThunk(
  "accountGroup/deleteAccountGroup",
  async (accountGroupId, { rejectWithValue }) => {
    try {
      const response =
        await accountGroupService.deleteAccountGroup(accountGroupId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
