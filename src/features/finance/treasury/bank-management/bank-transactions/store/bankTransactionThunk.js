import { createAsyncThunk } from "@reduxjs/toolkit";

import bankTransactionService from "../services/bankTransactionService";

import { getErrorMessage } from "@/utils";

// Create Bank Transaction
export const createBankTransaction = createAsyncThunk(
  "bankTransaction/createBankTransaction",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await bankTransactionService.createBankTransaction(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Bank Transactions
export const getBankTransactions = createAsyncThunk(
  "bankTransaction/getBankTransactions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bankTransactionService.getBankTransactions(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Bank Transaction By Id
export const getBankTransactionById = createAsyncThunk(
  "bankTransaction/getBankTransactionById",
  async (bankTransactionId, { rejectWithValue }) => {
    try {
      const response =
        await bankTransactionService.getBankTransactionById(bankTransactionId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Bank Transaction
export const cancelBankTransaction = createAsyncThunk(
  "bankTransaction/cancelBankTransaction",
  async ({ bankTransactionId, payload }, { rejectWithValue }) => {
    try {
      const response = await bankTransactionService.cancelBankTransaction(
        bankTransactionId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
