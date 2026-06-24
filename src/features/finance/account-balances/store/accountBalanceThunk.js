import { createAsyncThunk } from "@reduxjs/toolkit";

import accountBalanceService from "../services/accountBalanceService";

import { getErrorMessage } from "@/utils";

// Get Account Balances
export const getAccountBalances = createAsyncThunk(
  "accountBalance/getAccountBalances",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await accountBalanceService.getAccountBalances(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Account Balance By Account Id
export const getAccountBalanceByAccountId = createAsyncThunk(
  "accountBalance/getAccountBalanceByAccountId",
  async (accountId, { rejectWithValue }) => {
    try {
      const response =
        await accountBalanceService.getAccountBalanceByAccountId(accountId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Recalculate Account Balance
export const recalculateAccountBalance = createAsyncThunk(
  "accountBalance/recalculateAccountBalance",
  async (accountId, { rejectWithValue }) => {
    try {
      const response =
        await accountBalanceService.recalculateAccountBalance(accountId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
