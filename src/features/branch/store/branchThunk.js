import { createAsyncThunk } from "@reduxjs/toolkit";

import branchService from "../services/branchService";

import { getErrorMessage } from "@/utils";

export const createBranch = createAsyncThunk(
  "branch/createBranch",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await branchService.createBranch(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getCompanyBranches = createAsyncThunk(
  "branch/getCompanyBranches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await branchService.getCompanyBranches();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getBranchById = createAsyncThunk(
  "branch/getBranchById",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await branchService.getBranchById(branchId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateBranch = createAsyncThunk(
  "branch/updateBranch",
  async ({ branchId, payload }, { rejectWithValue }) => {
    try {
      const response = await branchService.updateBranch(branchId, payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteBranch = createAsyncThunk(
  "branch/deleteBranch",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await branchService.deleteBranch(branchId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
