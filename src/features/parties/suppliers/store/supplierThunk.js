import { createAsyncThunk } from "@reduxjs/toolkit";

import supplierService from "../services/supplierService";

import { getErrorMessage } from "@/utils";

/*
|--------------------------------------------------------------------------
| Supplier CRUD
|--------------------------------------------------------------------------
*/

export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await supplierService.createSupplier(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getSuppliers = createAsyncThunk(
  "supplier/getSuppliers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSuppliers(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getSupplierById = createAsyncThunk(
  "supplier/getSupplierById",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierById(supplierId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async ({ supplierId, payload }, { rejectWithValue }) => {
    try {
      const response = await supplierService.updateSupplier(
        supplierId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await supplierService.deleteSupplier(supplierId);

      return {
        supplierId,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
|--------------------------------------------------------------------------
| Supplier Ledger
|--------------------------------------------------------------------------
*/

export const getSupplierLedger = createAsyncThunk(
  "supplier/getSupplierLedger",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierLedger(supplierId);

      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
|--------------------------------------------------------------------------
| Supplier Outstanding
|--------------------------------------------------------------------------
*/

export const getSupplierOutstanding = createAsyncThunk(
  "supplier/getSupplierOutstanding",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierOutstanding(supplierId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
|--------------------------------------------------------------------------
| Supplier Purchases
|--------------------------------------------------------------------------
*/

export const getSupplierPurchases = createAsyncThunk(
  "supplier/getSupplierPurchases",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierPurchases(supplierId);

      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
|--------------------------------------------------------------------------
| Supplier Payments
|--------------------------------------------------------------------------
*/

export const getSupplierPayments = createAsyncThunk(
  "supplier/getSupplierPayments",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierPayments(supplierId);

      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
