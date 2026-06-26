import { createAsyncThunk } from "@reduxjs/toolkit";

import fundTransferService from "../services/fundTransferService";

import { getErrorMessage } from "@/utils";

// Create Fund Transfer
export const createFundTransfer = createAsyncThunk(
  "fundTransfer/createFundTransfer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fundTransferService.createFundTransfer(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Fund Transfers
export const getFundTransfers = createAsyncThunk(
  "fundTransfer/getFundTransfers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fundTransferService.getFundTransfers(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Fund Transfer By Id
export const getFundTransferById = createAsyncThunk(
  "fundTransfer/getFundTransferById",
  async (fundTransferId, { rejectWithValue }) => {
    try {
      const response =
        await fundTransferService.getFundTransferById(fundTransferId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Fund Transfer
export const cancelFundTransfer = createAsyncThunk(
  "fundTransfer/cancelFundTransfer",
  async ({ fundTransferId, payload }, { rejectWithValue }) => {
    try {
      const response = await fundTransferService.cancelFundTransfer(
        fundTransferId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
