import { createAsyncThunk } from "@reduxjs/toolkit";

import manufacturerMasterService from "../services/manufacturerMasterService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Get Manufacturer Masters (List)
// ---------------------
export const getManufacturerMasters = createAsyncThunk(
  "manufacturerMaster/getManufacturerMasters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await manufacturerMasterService.getManufacturerMasters(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Manufacturer Master By Id
// ---------------------
export const getManufacturerMasterById = createAsyncThunk(
  "manufacturerMaster/getManufacturerMasterById",
  async (manufacturerId, { rejectWithValue }) => {
    try {
      const response =
        await manufacturerMasterService.getManufacturerMasterById(
          manufacturerId,
        );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Manufacturer Master By Name
// ---------------------
export const getManufacturerMasterByName = createAsyncThunk(
  "manufacturerMaster/getManufacturerMasterByName",
  async (name, { rejectWithValue }) => {
    try {
      const response =
        await manufacturerMasterService.getManufacturerMasterByName(name);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
