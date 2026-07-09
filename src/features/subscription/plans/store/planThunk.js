import { createAsyncThunk } from "@reduxjs/toolkit";

import planService from "../services/planService";

import { getErrorMessage } from "@/utils";

// ─── Public Read ──────────────────────────────────────────────────────────────

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

// ─── Admin Write ──────────────────────────────────────────────────────────────

export const createPlan = createAsyncThunk(
  "plan/createPlan",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await planService.createPlan(payload);
      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updatePlan = createAsyncThunk(
  "plan/updatePlan",
  async ({ planId, payload }, { rejectWithValue }) => {
    try {
      const response = await planService.updatePlan(planId, payload);
      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const archivePlan = createAsyncThunk(
  "plan/archivePlan",
  async (planId, { rejectWithValue }) => {
    try {
      const response = await planService.archivePlan(planId);
      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const restorePlan = createAsyncThunk(
  "plan/restorePlan",
  async (planId, { rejectWithValue }) => {
    try {
      const response = await planService.restorePlan(planId);
      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deletePlan = createAsyncThunk(
  "plan/deletePlan",
  async (planId, { rejectWithValue }) => {
    try {
      await planService.deletePlan(planId);
      return planId; // return id so slice can remove from list
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
