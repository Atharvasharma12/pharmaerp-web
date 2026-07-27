// src/features/marketplace/stores/store/marketplaceStoreThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import marketplaceStoreService from "../services/marketplaceStoreService";

const getErrorMessage = (error, defaultMessage) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage
  );
};

export const getMarketplaceStores = createAsyncThunk(
  "marketplaceStore/getMarketplaceStores",
  async (params, { rejectWithValue }) => {
    try {
      const response = await marketplaceStoreService.getMarketplaceStores(params);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch marketplace stores"),
      );
    }
  },
);

export const getMarketplaceStoreById = createAsyncThunk(
  "marketplaceStore/getMarketplaceStoreById",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await marketplaceStoreService.getMarketplaceStoreById(storeId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch marketplace store details"),
      );
    }
  },
);

export const createMarketplaceStore = createAsyncThunk(
  "marketplaceStore/createMarketplaceStore",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await marketplaceStoreService.createMarketplaceStore(payload);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create marketplace store"),
      );
    }
  },
);

export const updateMarketplaceStore = createAsyncThunk(
  "marketplaceStore/updateMarketplaceStore",
  async ({ storeId, payload }, { rejectWithValue }) => {
    try {
      const response = await marketplaceStoreService.updateMarketplaceStore(
        storeId,
        payload,
      );
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update marketplace store"),
      );
    }
  },
);

export const deleteMarketplaceStore = createAsyncThunk(
  "marketplaceStore/deleteMarketplaceStore",
  async (storeId, { rejectWithValue }) => {
    try {
      await marketplaceStoreService.deleteMarketplaceStore(storeId);
      return { storeId };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete marketplace store"),
      );
    }
  },
);

export const goOnlineMarketplaceStore = createAsyncThunk(
  "marketplaceStore/goOnline",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await marketplaceStoreService.goOnline(storeId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to set store online"),
      );
    }
  },
);

export const goOfflineMarketplaceStore = createAsyncThunk(
  "marketplaceStore/goOffline",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await marketplaceStoreService.goOffline(storeId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to set store offline"),
      );
    }
  },
);

export const pauseMarketplaceStore = createAsyncThunk(
  "marketplaceStore/pause",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await marketplaceStoreService.pauseStore(storeId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to pause store"),
      );
    }
  },
);

export const resumeMarketplaceStore = createAsyncThunk(
  "marketplaceStore/resume",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await marketplaceStoreService.resumeStore(storeId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to resume store"),
      );
    }
  },
);
