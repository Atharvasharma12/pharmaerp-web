import { createAsyncThunk } from "@reduxjs/toolkit";

import planService from "../services/planService";

import { getErrorMessage } from "@/utils";

export const getPlans = createAsyncThunk(
  "plan/getPlans",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await planService.getPlans(params);

      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getActivePlans = createAsyncThunk(
  "plan/getActivePlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await planService.getActivePlans();

      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getPlanById = createAsyncThunk(
  "plan/getPlanById",
  async (planId, { rejectWithValue }) => {
    try {
      const response = await planService.getPlanById(planId);

      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
