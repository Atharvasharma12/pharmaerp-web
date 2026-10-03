import { createAsyncThunk } from "@reduxjs/toolkit";

import customerService from "../services/customerService";

import { getErrorMessage } from "@/utils";

/*
|--------------------------------------------------------------------------
| Customer CRUD
|--------------------------------------------------------------------------
*/

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomers(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getCustomerById = createAsyncThunk(
  "customer/getCustomerById",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerById(customerId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ customerId, payload }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(
        customerId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customerService.deleteCustomer(customerId);

      return {
        customerId,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
|--------------------------------------------------------------------------
| Customer Ledger
|--------------------------------------------------------------------------
*/

export const getCustomerLedger = createAsyncThunk(
  "customer/getCustomerLedger",
  async ({ customerId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerLedger(customerId, params);

      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
|--------------------------------------------------------------------------
| Customer Outstanding
|--------------------------------------------------------------------------
*/

export const getCustomerOutstanding = createAsyncThunk(
  "customer/getCustomerOutstanding",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerOutstanding(customerId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
|--------------------------------------------------------------------------
| Customer Sales
|--------------------------------------------------------------------------
*/

export const getCustomerSales = createAsyncThunk(
  "customer/getCustomerSales",
  async ({ customerId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerSales(customerId, params);

      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
|--------------------------------------------------------------------------
| Customer Payments
|--------------------------------------------------------------------------
*/

export const getCustomerPayments = createAsyncThunk(
  "customer/getCustomerPayments",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerPayments(customerId);

      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
