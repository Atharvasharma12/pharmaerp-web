import { createAsyncThunk } from "@reduxjs/toolkit";
import businessDayService from "../services/businessDayService";
import { getErrorMessage } from "@/utils";

export const openBusinessDay = createAsyncThunk(
  "businessDay/openBusinessDay",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await businessDayService.openBusinessDay(payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const listBusinessDays = createAsyncThunk(
  "businessDay/listBusinessDays",
  async (params, { rejectWithValue }) => {
    try {
      const response = await businessDayService.listBusinessDays(params);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getOpenBusinessDay = createAsyncThunk(
  "businessDay/getOpenBusinessDay",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await businessDayService.getOpenBusinessDay(branchId);
      return response.data?.data;
    } catch (error) {
      // 404 means no open day — not a fatal error, return null
      if (error?.response?.status === 404) return null;
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getSuggestedBusinessDate = createAsyncThunk(
  "businessDay/getSuggestedBusinessDate",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await businessDayService.getSuggestedBusinessDate(branchId);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getBusinessDayById = createAsyncThunk(
  "businessDay/getBusinessDayById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await businessDayService.getBusinessDayById(id);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const closeBusinessDay = createAsyncThunk(
  "businessDay/closeBusinessDay",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await businessDayService.closeBusinessDay(id, payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const cancelBusinessDay = createAsyncThunk(
  "businessDay/cancelBusinessDay",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await businessDayService.cancelBusinessDay(id, payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
