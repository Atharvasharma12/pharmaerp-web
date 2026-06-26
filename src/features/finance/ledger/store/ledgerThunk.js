import { createAsyncThunk } from "@reduxjs/toolkit";

import ledgerService from "../services/ledgerService";

import { getErrorMessage } from "@/utils";

// Get Ledger Entries
export const getLedger = createAsyncThunk(
  "ledger/getLedger",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await ledgerService.getLedger(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Recalculate Ledger
export const recalculateLedger = createAsyncThunk(
  "ledger/recalculateLedger",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ledgerService.recalculateLedger(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
