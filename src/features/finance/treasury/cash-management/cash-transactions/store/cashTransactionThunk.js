import { createAsyncThunk } from "@reduxjs/toolkit";

import cashTransactionService from "../services/cashTransactionService";

import { getErrorMessage } from "@/utils";

// Create Cash Transaction
export const createCashTransaction = createAsyncThunk(
  "cashTransaction/createCashTransaction",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await cashTransactionService.createCashTransaction(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cash Transactions
export const getCashTransactions = createAsyncThunk(
  "cashTransaction/getCashTransactions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await cashTransactionService.getCashTransactions(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cash Transaction By Id
export const getCashTransactionById = createAsyncThunk(
  "cashTransaction/getCashTransactionById",
  async (cashTransactionId, { rejectWithValue }) => {
    try {
      const response =
        await cashTransactionService.getCashTransactionById(cashTransactionId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Cash Transaction
export const cancelCashTransaction = createAsyncThunk(
  "cashTransaction/cancelCashTransaction",
  async ({ cashTransactionId, payload }, { rejectWithValue }) => {
    try {
      const response = await cashTransactionService.cancelCashTransaction(
        cashTransactionId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
