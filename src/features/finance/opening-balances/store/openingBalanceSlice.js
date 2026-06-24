import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  setAccountOpeningBalance,
  setCustomerOpeningBalance,
  setSupplierOpeningBalance,
} from "./openingBalanceThunk";

const initialState = {
  result: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  setAccountOpeningBalanceStatus: API_STATUS.IDLE,
  setCustomerOpeningBalanceStatus: API_STATUS.IDLE,
  setSupplierOpeningBalanceStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
  state.message = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const openingBalanceSlice = createSlice({
  name: "openingBalance",
  initialState,

  reducers: {
    clearOpeningBalanceError(state) {
      state.error = null;
    },

    clearOpeningBalanceMessage(state) {
      state.message = null;
    },

    clearOpeningBalanceResult(state) {
      state.result = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ACCOUNT OPENING BALANCE
      .addCase(setAccountOpeningBalance.pending, (state) => {
        state.setAccountOpeningBalanceStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(setAccountOpeningBalance.fulfilled, (state, action) => {
        state.setAccountOpeningBalanceStatus = API_STATUS.SUCCESS;
        state.result = action.payload || null;
        state.message = "Account opening balance set successfully";
      })
      .addCase(setAccountOpeningBalance.rejected, (state, action) => {
        state.setAccountOpeningBalanceStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to set account opening balance";
      })

      // CUSTOMER OPENING BALANCE
      .addCase(setCustomerOpeningBalance.pending, (state) => {
        state.setCustomerOpeningBalanceStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(setCustomerOpeningBalance.fulfilled, (state, action) => {
        state.setCustomerOpeningBalanceStatus = API_STATUS.SUCCESS;
        state.result = action.payload || null;
        state.message = "Customer opening balance set successfully";
      })
      .addCase(setCustomerOpeningBalance.rejected, (state, action) => {
        state.setCustomerOpeningBalanceStatus = API_STATUS.ERROR;
        state.error =
          action.payload || "Failed to set customer opening balance";
      })

      // SUPPLIER OPENING BALANCE
      .addCase(setSupplierOpeningBalance.pending, (state) => {
        state.setSupplierOpeningBalanceStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(setSupplierOpeningBalance.fulfilled, (state, action) => {
        state.setSupplierOpeningBalanceStatus = API_STATUS.SUCCESS;
        state.result = action.payload || null;
        state.message = "Supplier opening balance set successfully";
      })
      .addCase(setSupplierOpeningBalance.rejected, (state, action) => {
        state.setSupplierOpeningBalanceStatus = API_STATUS.ERROR;
        state.error =
          action.payload || "Failed to set supplier opening balance";
      });
  },
});

export const {
  clearOpeningBalanceError,
  clearOpeningBalanceMessage,
  clearOpeningBalanceResult,
} = openingBalanceSlice.actions;

export default openingBalanceSlice.reducer;
