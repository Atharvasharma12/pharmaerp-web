import { createAsyncThunk } from "@reduxjs/toolkit";

import categoryMasterService from "../services/categoryMasterService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Get Category Masters (List)
// ---------------------
export const getCategoryMasters = createAsyncThunk(
  "categoryMaster/getCategoryMasters",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await categoryMasterService.getCategoryMasters(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Category Master By Id
// ---------------------
export const getCategoryMasterById = createAsyncThunk(
  "categoryMaster/getCategoryMasterById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response =
        await categoryMasterService.getCategoryMasterById(categoryId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Category Master By Slug
// ---------------------
export const getCategoryMasterBySlug = createAsyncThunk(
  "categoryMaster/getCategoryMasterBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response =
        await categoryMasterService.getCategoryMasterBySlug(slug);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
