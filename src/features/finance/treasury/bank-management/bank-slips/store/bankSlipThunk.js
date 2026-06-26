import { createAsyncThunk } from "@reduxjs/toolkit";

import bankSlipService from "../services/bankSlipService";

import { getErrorMessage } from "@/utils";

// Create Bank Slip
export const createBankSlip = createAsyncThunk(
  "bankSlip/createBankSlip",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await bankSlipService.createBankSlip(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Bank Slips
export const getBankSlips = createAsyncThunk(
  "bankSlip/getBankSlips",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bankSlipService.getBankSlips(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Bank Slip By Id
export const getBankSlipById = createAsyncThunk(
  "bankSlip/getBankSlipById",
  async (bankSlipId, { rejectWithValue }) => {
    try {
      const response = await bankSlipService.getBankSlipById(bankSlipId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Submit Bank Slip
export const submitBankSlip = createAsyncThunk(
  "bankSlip/submitBankSlip",
  async ({ bankSlipId, payload }, { rejectWithValue }) => {
    try {
      const response = await bankSlipService.submitBankSlip(
        bankSlipId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Confirm Bank Slip
export const confirmBankSlip = createAsyncThunk(
  "bankSlip/confirmBankSlip",
  async ({ bankSlipId, payload }, { rejectWithValue }) => {
    try {
      const response = await bankSlipService.confirmBankSlip(
        bankSlipId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Reject Bank Slip
export const rejectBankSlip = createAsyncThunk(
  "bankSlip/rejectBankSlip",
  async ({ bankSlipId, payload }, { rejectWithValue }) => {
    try {
      const response = await bankSlipService.rejectBankSlip(
        bankSlipId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Bank Slip
export const cancelBankSlip = createAsyncThunk(
  "bankSlip/cancelBankSlip",
  async ({ bankSlipId, payload }, { rejectWithValue }) => {
    try {
      const response = await bankSlipService.cancelBankSlip(
        bankSlipId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
