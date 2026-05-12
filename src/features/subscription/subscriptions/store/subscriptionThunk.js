import { createAsyncThunk } from "@reduxjs/toolkit";

import subscriptionService from "../services/subscriptionService";

import { getErrorMessage } from "@/utils";

export const purchaseSubscription = createAsyncThunk(
  "subscription/purchaseSubscription",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.purchaseSubscription(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const renewSubscription = createAsyncThunk(
  "subscription/renewSubscription",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.renewSubscription(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const upgradeSubscription = createAsyncThunk(
  "subscription/upgradeSubscription",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.upgradeSubscription(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const scheduleDowngrade = createAsyncThunk(
  "subscription/scheduleDowngrade",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.scheduleDowngrade(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const changeSeatQuantity = createAsyncThunk(
  "subscription/changeSeatQuantity",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.changeSeatQuantity(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const cancelSubscription = createAsyncThunk(
  "subscription/cancelSubscription",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.cancelSubscription(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getSubscriptions = createAsyncThunk(
  "subscription/getSubscriptions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscriptions(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getSubscriptionById = createAsyncThunk(
  "subscription/getSubscriptionById",
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionService.getSubscriptionById(subscriptionId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getWorkspaceCurrentSubscription = createAsyncThunk(
  "subscription/getWorkspaceCurrentSubscription",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionService.getWorkspaceCurrentSubscription(workspaceId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getWorkspaceSubscriptions = createAsyncThunk(
  "subscription/getWorkspaceSubscriptions",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionService.getWorkspaceSubscriptions(workspaceId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const syncActiveSeatCount = createAsyncThunk(
  "subscription/syncActiveSeatCount",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionService.syncActiveSeatCount(workspaceId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const validateSeatAvailability = createAsyncThunk(
  "subscription/validateSeatAvailability",
  async ({ workspaceId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.validateSeatAvailability(
        workspaceId,
        params,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
