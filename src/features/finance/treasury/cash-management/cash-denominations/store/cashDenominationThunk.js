import { createAsyncThunk } from "@reduxjs/toolkit";

import cashDenominationService from "../services/cashDenominationService";

import { getErrorMessage } from "@/utils";

// Create Cash Denomination
export const createCashDenomination = createAsyncThunk(
  "cashDenomination/createCashDenomination",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await cashDenominationService.createCashDenomination(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cash Denominations
export const getCashDenominations = createAsyncThunk(
  "cashDenomination/getCashDenominations",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await cashDenominationService.getCashDenominations(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cash Denomination By Id
export const getCashDenominationById = createAsyncThunk(
  "cashDenomination/getCashDenominationById",
  async (cashDenominationId, { rejectWithValue }) => {
    try {
      const response =
        await cashDenominationService.getCashDenominationById(
          cashDenominationId,
        );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Confirm Cash Denomination
export const confirmCashDenomination = createAsyncThunk(
  "cashDenomination/confirmCashDenomination",
  async ({ cashDenominationId, payload }, { rejectWithValue }) => {
    try {
      const response = await cashDenominationService.confirmCashDenomination(
        cashDenominationId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Cash Denomination
export const cancelCashDenomination = createAsyncThunk(
  "cashDenomination/cancelCashDenomination",
  async ({ cashDenominationId, payload }, { rejectWithValue }) => {
    try {
      const response = await cashDenominationService.cancelCashDenomination(
        cashDenominationId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
