// src/features/global-products/store/globalProductThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";

import globalProductService from "../services/globalProductService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Get Global Products
// ---------------------

export const getGlobalProducts = createAsyncThunk(
  "globalProduct/getGlobalProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await globalProductService.getGlobalProducts(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Global Product By Id
// ---------------------

export const getGlobalProductById = createAsyncThunk(
  "globalProduct/getGlobalProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response =
        await globalProductService.getGlobalProductById(productId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Global Product By Code
// ---------------------

export const getGlobalProductByCode = createAsyncThunk(
  "globalProduct/getGlobalProductByCode",
  async (productCode, { rejectWithValue }) => {
    try {
      const response =
        await globalProductService.getGlobalProductByCode(productCode);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
