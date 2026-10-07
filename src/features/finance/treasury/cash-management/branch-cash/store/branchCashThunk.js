import { createAsyncThunk } from "@reduxjs/toolkit";
import branchCashService from "../services/branchCashService";

/** Fetch all branches' cash for the company. */
export const listBranchCash = createAsyncThunk(
  "branchCash/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await branchCashService.getAllBranchCash(params);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch branch cash");
    }
  }
);

/** Fetch cash for a specific branch. */
export const fetchBranchCash = createAsyncThunk(
  "branchCash/fetchByBranch",
  async (branchId, { rejectWithValue }) => {
    try {
      const res = await branchCashService.getBranchCash(branchId);
      return res.data?.data ?? res.data;
    } catch (err) {
      // 404 means branch cash is not yet initialized for this branch — return null gracefully
      if (err.response?.status === 404) {
        return null;
      }
      return rejectWithValue(err.response?.data?.message || "Failed to fetch branch cash");
    }
  }
);

/**
 * Initialize BranchCash with an opening balance.
 * @param {{ branchId, openingAmount, openingDenominations, narration? }} payload
 */
export const initializeBranchCash = createAsyncThunk(
  "branchCash/initialize",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await branchCashService.initializeBranchCash(payload);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to initialize branch cash");
    }
  }
);

/** Deposit external cash into the RUNNING partition. Shift must be open. */
export const depositCash = createAsyncThunk(
  "branchCash/deposit",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await branchCashService.depositCash(payload);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to deposit cash");
    }
  }
);

/**
 * Withdraw cash from running, frozen, or bank slip.
 * @param {{ branchId, source, slipId?, amount, denominations, narration? }} payload
 */
export const withdrawCash = createAsyncThunk(
  "branchCash/withdraw",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await branchCashService.withdrawCash(payload);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to withdraw cash");
    }
  }
);

