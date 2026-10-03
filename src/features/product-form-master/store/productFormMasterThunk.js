import { createAsyncThunk } from "@reduxjs/toolkit";

import productFormMasterService from "../services/productFormMasterService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Get Product Form Masters (List)
// ---------------------
export const getProductFormMasters = createAsyncThunk(
  "productFormMaster/getProductFormMasters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await productFormMasterService.getProductFormMasters(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Product Form Master By Id
// ---------------------
export const getProductFormMasterById = createAsyncThunk(
  "productFormMaster/getProductFormMasterById",
  async (formId, { rejectWithValue }) => {
    try {
      const response =
        await productFormMasterService.getProductFormMasterById(formId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
