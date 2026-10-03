// src/features/marketplace/products/store/marketplaceProductThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import marketplaceProductService from "../services/marketplaceProductService";

const getErrorMessage = (error, defaultMessage) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage
  );
};

export const getMarketplaceProducts = createAsyncThunk(
  "marketplaceProduct/getMarketplaceProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await marketplaceProductService.getMarketplaceProducts(params);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch marketplace products"),
      );
    }
  },
);

export const getMarketplaceProductById = createAsyncThunk(
  "marketplaceProduct/getMarketplaceProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await marketplaceProductService.getMarketplaceProductById(productId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch marketplace product details"),
      );
    }
  },
);

export const enableMarketplaceProduct = createAsyncThunk(
  "marketplaceProduct/enableMarketplaceProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await marketplaceProductService.enableMarketplaceProduct(payload);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to enable marketplace product"),
      );
    }
  },
);

export const updateMarketplaceProduct = createAsyncThunk(
  "marketplaceProduct/updateMarketplaceProduct",
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const response = await marketplaceProductService.updateMarketplaceProduct(
        productId,
        payload,
      );
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update marketplace product"),
      );
    }
  },
);

export const disableMarketplaceProduct = createAsyncThunk(
  "marketplaceProduct/disableMarketplaceProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await marketplaceProductService.disableMarketplaceProduct(productId);
      return { productId };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to disable marketplace product"),
      );
    }
  },
);
