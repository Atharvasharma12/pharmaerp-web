import { createAsyncThunk } from "@reduxjs/toolkit";

import uomMasterService from "../services/uomMasterService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Get UOM Masters (List)
// ---------------------
export const getUomMasters = createAsyncThunk(
  "uomMaster/getUomMasters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await uomMasterService.getUomMasters(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get UOM Master By Id
// ---------------------
export const getUomMasterById = createAsyncThunk(
  "uomMaster/getUomMasterById",
  async (uomId, { rejectWithValue }) => {
    try {
      const response = await uomMasterService.getUomMasterById(uomId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
