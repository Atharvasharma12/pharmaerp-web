import { createAsyncThunk } from "@reduxjs/toolkit";
import shiftService from "../services/shiftService";
import { getErrorMessage } from "@/utils";

export const createShift = createAsyncThunk(
  "shift/createShift",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await shiftService.createShift(payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const listShifts = createAsyncThunk(
  "shift/listShifts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await shiftService.listShifts(params);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getOpenShift = createAsyncThunk(
  "shift/getOpenShift",
  async (params, { rejectWithValue }) => {
    try {
      const response = await shiftService.getOpenShift(params);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateShiftStatus = createAsyncThunk(
  "shift/updateShiftStatus",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await shiftService.updateShiftStatus(id, payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const cancelShift = createAsyncThunk(
  "shift/cancelShift",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await shiftService.cancelShift(id, payload);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
