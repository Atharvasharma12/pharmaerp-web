import { createAsyncThunk } from "@reduxjs/toolkit";

import cashExchangeService from "../services/cashExchangeService";
import { getErrorMessage } from "@/utils";

// Create Cash Exchange
export const createCashExchange = createAsyncThunk(
  "cashExchange/createCashExchange",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cashExchangeService.createCashExchange(payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cash Exchanges
export const getCashExchanges = createAsyncThunk(
  "cashExchange/getCashExchanges",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await cashExchangeService.getCashExchanges(params);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cash Exchange By Id
export const getCashExchangeById = createAsyncThunk(
  "cashExchange/getCashExchangeById",
  async (cashExchangeId, { rejectWithValue }) => {
    try {
      const response =
        await cashExchangeService.getCashExchangeById(cashExchangeId);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Cash Exchange
export const cancelCashExchange = createAsyncThunk(
  "cashExchange/cancelCashExchange",
  async ({ cashExchangeId, payload }, { rejectWithValue }) => {
    try {
      const response = await cashExchangeService.cancelCashExchange(
        cashExchangeId,
        payload,
      );
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
