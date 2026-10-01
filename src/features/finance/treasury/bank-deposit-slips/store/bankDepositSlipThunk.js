import { createAsyncThunk } from "@reduxjs/toolkit";

import bankDepositSlipService from "../services/bankDepositSlipService";

import { getErrorMessage } from "@/utils";

const extractData = (response) => {
  const body = response?.data;
  if (!body) return null;
  // If body.data is an object, that's our payload
  if (body.data && typeof body.data === "object") return body.data;
  // If body.message is an object (e.g. { bankDepositSlips: [...], total }), fallback to it
  if (body.message && typeof body.message === "object") return body.message;
  return body.data ?? body;
};

// Create Bank Deposit Slip
export const createBankDepositSlip = createAsyncThunk(
  "bankDepositSlip/createBankDepositSlip",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await bankDepositSlipService.createBankDepositSlip(payload);

      return extractData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Bank Deposit Slips
export const getBankDepositSlips = createAsyncThunk(
  "bankDepositSlip/getBankDepositSlips",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bankDepositSlipService.getBankDepositSlips(params);

      return extractData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Bank Deposit Slip By Id
export const getBankDepositSlipById = createAsyncThunk(
  "bankDepositSlip/getBankDepositSlipById",
  async (slipId, { rejectWithValue }) => {
    try {
      const response = await bankDepositSlipService.getBankDepositSlipById(slipId);

      return extractData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Confirm Deposit
export const confirmDeposit = createAsyncThunk(
  "bankDepositSlip/confirmDeposit",
  async ({ slipId, payload }, { rejectWithValue }) => {
    try {
      const response = await bankDepositSlipService.confirmDeposit(slipId, payload);

      return extractData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Bank Deposit Slip
export const cancelBankDepositSlip = createAsyncThunk(
  "bankDepositSlip/cancelBankDepositSlip",
  async ({ slipId, payload }, { rejectWithValue }) => {
    try {
      const response = await bankDepositSlipService.cancelBankDepositSlip(slipId, payload);

      return extractData(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
