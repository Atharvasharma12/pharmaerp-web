import { createAsyncThunk } from "@reduxjs/toolkit";

import bankMasterService from "../services/bankMasterService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Get Bank Masters (List)
// ---------------------
export const getBankMasters = createAsyncThunk(
  "bankMaster/getBankMasters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bankMasterService.getBankMasters(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Bank Master By Id
// ---------------------
export const getBankMasterById = createAsyncThunk(
  "bankMaster/getBankMasterById",
  async (bankId, { rejectWithValue }) => {
    try {
      const response = await bankMasterService.getBankMasterById(bankId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Bank Master By Name
// ---------------------
export const getBankMasterByName = createAsyncThunk(
  "bankMaster/getBankMasterByName",
  async (name, { rejectWithValue }) => {
    try {
      const response = await bankMasterService.getBankMasterByName(name);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
