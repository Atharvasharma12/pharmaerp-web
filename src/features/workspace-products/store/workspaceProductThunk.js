// src/features/workspace-products/store/workspaceProductThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";

import workspaceProductService from "../services/workspaceProductService";

import { getErrorMessage } from "@/utils";

// ---------------------
// Search Before Create
// ---------------------

export const searchBeforeCreateWorkspaceProduct = createAsyncThunk(
  "workspaceProduct/searchBeforeCreateWorkspaceProduct",
  async (params, { rejectWithValue }) => {
    try {
      const response =
        await workspaceProductService.searchBeforeCreateWorkspaceProduct(
          params,
        );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Create Workspace Product
// ---------------------

export const createWorkspaceProduct = createAsyncThunk(
  "workspaceProduct/createWorkspaceProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await workspaceProductService.createWorkspaceProduct(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Workspace Products
// ---------------------

export const getWorkspaceProducts = createAsyncThunk(
  "workspaceProduct/getWorkspaceProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await workspaceProductService.getWorkspaceProducts(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Workspace Product By Id
// ---------------------

export const getWorkspaceProductById = createAsyncThunk(
  "workspaceProduct/getWorkspaceProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response =
        await workspaceProductService.getWorkspaceProductById(productId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Get Workspace Product By Code
// ---------------------

export const getWorkspaceProductByCode = createAsyncThunk(
  "workspaceProduct/getWorkspaceProductByCode",
  async (productCode, { rejectWithValue }) => {
    try {
      const response =
        await workspaceProductService.getWorkspaceProductByCode(productCode);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Update Workspace Product
// ---------------------

export const updateWorkspaceProduct = createAsyncThunk(
  "workspaceProduct/updateWorkspaceProduct",
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceProductService.updateWorkspaceProduct(
        productId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ---------------------
// Delete Workspace Product
// ---------------------

export const deleteWorkspaceProduct = createAsyncThunk(
  "workspaceProduct/deleteWorkspaceProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response =
        await workspaceProductService.deleteWorkspaceProduct(productId);

      return {
        ...response.data,
        productId,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
