import { createAsyncThunk } from "@reduxjs/toolkit";

import companyService from "../services/companyService";

import { getErrorMessage } from "@/utils";
import { invalidateSetupStatus } from "@/features/workspace/store/workspaceSlice";

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await companyService.createCompany(payload);
      dispatch(invalidateSetupStatus()); // bump → Setup Center refetches
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getWorkspaceCompanies = createAsyncThunk(
  "company/getWorkspaceCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyService.getWorkspaceCompanies();

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await companyService.getCompanyById(companyId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ companyId, payload }, { rejectWithValue }) => {
    try {
      const response = await companyService.updateCompany(companyId, payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await companyService.deleteCompany(companyId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getCompanyEmployees = createAsyncThunk(
  "company/getCompanyEmployees",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await companyService.getCompanyEmployees(companyId);
      return { companyId, employees: response.data?.data || [] };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

