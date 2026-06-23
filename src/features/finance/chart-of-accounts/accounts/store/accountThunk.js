import { createAsyncThunk } from "@reduxjs/toolkit";

import accountService from "../services/accountService";

import { getErrorMessage } from "@/utils";

// Create Account
export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await accountService.createAccount(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Accounts
export const getAccounts = createAsyncThunk(
  "account/getAccounts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await accountService.getAccounts(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Account By Id
export const getAccountById = createAsyncThunk(
  "account/getAccountById",
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await accountService.getAccountById(accountId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Update Account
export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async ({ accountId, payload }, { rejectWithValue }) => {
    try {
      const response = await accountService.updateAccount(accountId, payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Delete Account
export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await accountService.deleteAccount(accountId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
