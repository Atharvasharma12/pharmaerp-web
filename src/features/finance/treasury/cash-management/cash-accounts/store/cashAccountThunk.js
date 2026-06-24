import { createAsyncThunk } from "@reduxjs/toolkit";

import cashAccountService from "../services/cashAccountService";

import { getErrorMessage } from "@/utils";

// Create Cash Account
export const createCashAccount = createAsyncThunk(
  "cashAccount/createCashAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cashAccountService.createCashAccount(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cash Accounts
export const getCashAccounts = createAsyncThunk(
  "cashAccount/getCashAccounts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await cashAccountService.getCashAccounts(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cash Account By Id
export const getCashAccountById = createAsyncThunk(
  "cashAccount/getCashAccountById",
  async (cashAccountId, { rejectWithValue }) => {
    try {
      const response =
        await cashAccountService.getCashAccountById(cashAccountId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Update Cash Account
export const updateCashAccount = createAsyncThunk(
  "cashAccount/updateCashAccount",
  async ({ cashAccountId, payload }, { rejectWithValue }) => {
    try {
      const response = await cashAccountService.updateCashAccount(
        cashAccountId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Delete Cash Account
export const deleteCashAccount = createAsyncThunk(
  "cashAccount/deleteCashAccount",
  async (cashAccountId, { rejectWithValue }) => {
    try {
      const response =
        await cashAccountService.deleteCashAccount(cashAccountId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Set Primary Cash Account
export const setPrimaryCashAccount = createAsyncThunk(
  "cashAccount/setPrimaryCashAccount",
  async (cashAccountId, { rejectWithValue }) => {
    try {
      const response =
        await cashAccountService.setPrimaryCashAccount(cashAccountId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
