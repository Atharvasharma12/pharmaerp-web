import { createAsyncThunk } from "@reduxjs/toolkit";

import bankAccountService from "../services/bankAccountService";

import { getErrorMessage } from "@/utils";

export const createBankAccount = createAsyncThunk(
  "bankAccount/createBankAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await bankAccountService.createBankAccount(payload);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getBankAccounts = createAsyncThunk(
  "bankAccount/getBankAccounts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bankAccountService.getBankAccounts(params);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getBankAccountById = createAsyncThunk(
  "bankAccount/getBankAccountById",
  async (bankAccountId, { rejectWithValue }) => {
    try {
      const response =
        await bankAccountService.getBankAccountById(bankAccountId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateBankAccount = createAsyncThunk(
  "bankAccount/updateBankAccount",
  async ({ bankAccountId, payload }, { rejectWithValue }) => {
    try {
      const response = await bankAccountService.updateBankAccount(
        bankAccountId,
        payload,
      );

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteBankAccount = createAsyncThunk(
  "bankAccount/deleteBankAccount",
  async (bankAccountId, { rejectWithValue }) => {
    try {
      const response =
        await bankAccountService.deleteBankAccount(bankAccountId);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const setPrimaryBankAccount = createAsyncThunk(
  "bankAccount/setPrimaryBankAccount",
  async (bankAccountId, { rejectWithValue }) => {
    try {
      const response =
        await bankAccountService.setPrimaryBankAccount(bankAccountId);

      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
