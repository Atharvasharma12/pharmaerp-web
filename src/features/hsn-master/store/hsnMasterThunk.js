import { createAsyncThunk } from "@reduxjs/toolkit";

import hsnMasterService from "../services/hsnMasterService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Get HSN Masters (List)
// ---------------------
export const getHsnMasters = createAsyncThunk(
  "hsnMaster/getHsnMasters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await hsnMasterService.getHsnMasters(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get HSN Master By Id
// ---------------------
export const getHsnMasterById = createAsyncThunk(
  "hsnMaster/getHsnMasterById",
  async (hsnId, { rejectWithValue }) => {
    try {
      const response = await hsnMasterService.getHsnMasterById(hsnId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get HSN Master By Code
// ---------------------
export const getHsnMasterByCode = createAsyncThunk(
  "hsnMaster/getHsnMasterByCode",
  async (hsnCode, { rejectWithValue }) => {
    try {
      const response = await hsnMasterService.getHsnMasterByCode(hsnCode);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
