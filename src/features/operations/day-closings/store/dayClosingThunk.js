import { createAsyncThunk } from "@reduxjs/toolkit";
import dayClosingService from "../services/dayClosingService";
import { getErrorMessage } from "@/utils";

export const createDayClosing = createAsyncThunk(
  "dayClosing/createDayClosing",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await dayClosingService.createDayClosing(payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const listDayClosings = createAsyncThunk(
  "dayClosing/listDayClosings",
  async (params, { rejectWithValue }) => {
    try {
      const response = await dayClosingService.listDayClosings(params);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getDayClosingById = createAsyncThunk(
  "dayClosing/getDayClosingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await dayClosingService.getDayClosingById(id);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateDayClosingStatus = createAsyncThunk(
  "dayClosing/updateDayClosingStatus",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await dayClosingService.updateDayClosingStatus(id, payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
