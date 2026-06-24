import { createAsyncThunk } from "@reduxjs/toolkit";

import openingBalanceService from "../services/openingBalanceService";

import { getErrorMessage } from "@/utils";

// Account Opening Balance
export const setAccountOpeningBalance = createAsyncThunk(
  "openingBalance/setAccountOpeningBalance",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await openingBalanceService.setAccountOpeningBalance(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Customer Opening Balance
export const setCustomerOpeningBalance = createAsyncThunk(
  "openingBalance/setCustomerOpeningBalance",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await openingBalanceService.setCustomerOpeningBalance(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Supplier Opening Balance
export const setSupplierOpeningBalance = createAsyncThunk(
  "openingBalance/setSupplierOpeningBalance",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await openingBalanceService.setSupplierOpeningBalance(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
