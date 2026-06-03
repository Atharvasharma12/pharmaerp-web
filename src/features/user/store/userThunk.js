import { createAsyncThunk } from "@reduxjs/toolkit";

import userService from "../services/userService";

import { USER_STORAGE_KEY } from "@/constants";
import { getErrorMessage, storage } from "@/utils";

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile();
      const data = response.data?.data;

      if (data) {
        storage.set(USER_STORAGE_KEY, data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(payload);
      const data = response.data?.data;

      if (data) {
        storage.set(USER_STORAGE_KEY, data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userService.updateAvatar(payload);
      const data = response.data?.data;

      if (data) {
        storage.set(USER_STORAGE_KEY, data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAvatar = createAsyncThunk(
  "user/deleteAvatar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.deleteAvatar();
      const data = response.data?.data;

      if (data) {
        storage.set(USER_STORAGE_KEY, data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getActiveContext = createAsyncThunk(
  "user/getActiveContext",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getActiveContext();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateActiveContext = createAsyncThunk(
  "user/updateActiveContext",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userService.updateActiveContext(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deactivateAccount = createAsyncThunk(
  "user/deactivateAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.deactivateAccount();

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
