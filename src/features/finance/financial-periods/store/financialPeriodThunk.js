import { createAsyncThunk } from "@reduxjs/toolkit";

import financialPeriodService from "../services/financialPeriodService";

import { getErrorMessage } from "@/utils";

// Create Financial Period
export const createFinancialPeriod = createAsyncThunk(
  "financialPeriod/createFinancialPeriod",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await financialPeriodService.createFinancialPeriod(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Financial Periods
export const getFinancialPeriods = createAsyncThunk(
  "financialPeriod/getFinancialPeriods",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await financialPeriodService.getFinancialPeriods(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Current Financial Period
export const getCurrentFinancialPeriod = createAsyncThunk(
  "financialPeriod/getCurrentFinancialPeriod",
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialPeriodService.getCurrentFinancialPeriod();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Update Financial Period Status
export const updateFinancialPeriodStatus = createAsyncThunk(
  "financialPeriod/updateFinancialPeriodStatus",
  async ({ periodId, payload }, { rejectWithValue }) => {
    try {
      const response = await financialPeriodService.updateFinancialPeriodStatus(
        periodId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
