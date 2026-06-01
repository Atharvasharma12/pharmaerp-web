import { createAsyncThunk } from "@reduxjs/toolkit";

import companyService from "../services/companyService";

import { getErrorMessage } from "@/utils";

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await companyService.createCompany(payload);

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
