import { createAsyncThunk } from "@reduxjs/toolkit";

import chequeService from "../services/chequeService";

import { getErrorMessage } from "@/utils";

// Create Cheque
export const createCheque = createAsyncThunk(
  "cheque/createCheque",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await chequeService.createCheque(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cheques
export const getCheques = createAsyncThunk(
  "cheque/getCheques",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await chequeService.getCheques(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Cheque By Id
export const getChequeById = createAsyncThunk(
  "cheque/getChequeById",
  async (chequeId, { rejectWithValue }) => {
    try {
      const response = await chequeService.getChequeById(chequeId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Deposit Cheque
export const depositCheque = createAsyncThunk(
  "cheque/depositCheque",
  async (chequeId, { rejectWithValue }) => {
    try {
      const response = await chequeService.depositCheque(chequeId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Clear Cheque
export const clearCheque = createAsyncThunk(
  "cheque/clearCheque",
  async ({ chequeId, payload }, { rejectWithValue }) => {
    try {
      const response = await chequeService.clearCheque(chequeId, payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Bounce Cheque
export const bounceCheque = createAsyncThunk(
  "cheque/bounceCheque",
  async ({ chequeId, payload }, { rejectWithValue }) => {
    try {
      const response = await chequeService.bounceCheque(chequeId, payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Cheque
export const cancelCheque = createAsyncThunk(
  "cheque/cancelCheque",
  async ({ chequeId, payload }, { rejectWithValue }) => {
    try {
      const response = await chequeService.cancelCheque(chequeId, payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
