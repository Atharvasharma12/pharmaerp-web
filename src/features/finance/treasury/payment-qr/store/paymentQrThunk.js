import { createAsyncThunk } from "@reduxjs/toolkit";

import paymentQrService from "../services/paymentQrService";

import { getErrorMessage } from "@/utils";

// Create Payment QR
export const createPaymentQr = createAsyncThunk(
  "paymentQr/createPaymentQr",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentQrService.createPaymentQr(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Payment QRs
export const getPaymentQrs = createAsyncThunk(
  "paymentQr/getPaymentQrs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await paymentQrService.getPaymentQrs(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Payment QR By Id
export const getPaymentQrById = createAsyncThunk(
  "paymentQr/getPaymentQrById",
  async (paymentQrId, { rejectWithValue }) => {
    try {
      const response = await paymentQrService.getPaymentQrById(paymentQrId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Update Payment QR
export const updatePaymentQr = createAsyncThunk(
  "paymentQr/updatePaymentQr",
  async ({ paymentQrId, payload }, { rejectWithValue }) => {
    try {
      const response = await paymentQrService.updatePaymentQr(
        paymentQrId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Delete Payment QR
export const deletePaymentQr = createAsyncThunk(
  "paymentQr/deletePaymentQr",
  async (paymentQrId, { rejectWithValue }) => {
    try {
      const response = await paymentQrService.deletePaymentQr(paymentQrId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Set Primary Payment QR
export const setPrimaryPaymentQr = createAsyncThunk(
  "paymentQr/setPrimaryPaymentQr",
  async (paymentQrId, { rejectWithValue }) => {
    try {
      const response = await paymentQrService.setPrimaryPaymentQr(paymentQrId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
