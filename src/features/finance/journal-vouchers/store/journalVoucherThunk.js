import { createAsyncThunk } from "@reduxjs/toolkit";

import journalVoucherService from "../services/journalVoucherService";

import { getErrorMessage } from "@/utils";

// Create Journal Voucher
export const createJournalVoucher = createAsyncThunk(
  "journalVoucher/createJournalVoucher",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await journalVoucherService.createJournalVoucher(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Journal Vouchers
export const getJournalVouchers = createAsyncThunk(
  "journalVoucher/getJournalVouchers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await journalVoucherService.getJournalVouchers(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Get Journal Voucher By Id
export const getJournalVoucherById = createAsyncThunk(
  "journalVoucher/getJournalVoucherById",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response =
        await journalVoucherService.getJournalVoucherById(voucherId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Update Journal Voucher
export const updateJournalVoucher = createAsyncThunk(
  "journalVoucher/updateJournalVoucher",
  async ({ voucherId, payload }, { rejectWithValue }) => {
    try {
      const response = await journalVoucherService.updateJournalVoucher(
        voucherId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Post Journal Voucher
export const postJournalVoucher = createAsyncThunk(
  "journalVoucher/postJournalVoucher",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response =
        await journalVoucherService.postJournalVoucher(voucherId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cancel Journal Voucher
export const cancelJournalVoucher = createAsyncThunk(
  "journalVoucher/cancelJournalVoucher",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response =
        await journalVoucherService.cancelJournalVoucher(voucherId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Submit Journal Voucher For Approval
export const submitJournalVoucherApproval = createAsyncThunk(
  "journalVoucher/submitJournalVoucherApproval",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response =
        await journalVoucherService.submitJournalVoucherApproval(voucherId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Approve Journal Voucher
export const approveJournalVoucher = createAsyncThunk(
  "journalVoucher/approveJournalVoucher",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response =
        await journalVoucherService.approveJournalVoucher(voucherId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Reverse Journal Voucher
export const reverseJournalVoucher = createAsyncThunk(
  "journalVoucher/reverseJournalVoucher",
  async (voucherId, { rejectWithValue }) => {
    try {
      const response =
        await journalVoucherService.reverseJournalVoucher(voucherId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
