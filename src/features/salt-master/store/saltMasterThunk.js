import { createAsyncThunk } from "@reduxjs/toolkit";

import saltMasterService from "../services/saltMasterService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Get Salt Masters (List)
// ---------------------
export const getSaltMasters = createAsyncThunk(
  "saltMaster/getSaltMasters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await saltMasterService.getSaltMasters(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Salt Master By Id
// ---------------------
export const getSaltMasterById = createAsyncThunk(
  "saltMaster/getSaltMasterById",
  async (saltId, { rejectWithValue }) => {
    try {
      const response = await saltMasterService.getSaltMasterById(saltId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Salt Master By Name
// ---------------------
export const getSaltMasterByName = createAsyncThunk(
  "saltMaster/getSaltMasterByName",
  async (name, { rejectWithValue }) => {
    try {
      const response = await saltMasterService.getSaltMasterByName(name);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
