import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createBankSlip,
  getBankSlips,
  getBankSlipById,
  submitBankSlip,
  confirmBankSlip,
  rejectBankSlip,
  cancelBankSlip,
} from "./bankSlipThunk";

const initialState = {
  bankSlips: [],
  currentBankSlip: null,
  managedBankSlip: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createBankSlipStatus: API_STATUS.IDLE,
  getBankSlipsStatus: API_STATUS.IDLE,
  getBankSlipStatus: API_STATUS.IDLE,
  submitBankSlipStatus: API_STATUS.IDLE,
  confirmBankSlipStatus: API_STATUS.IDLE,
  rejectBankSlipStatus: API_STATUS.IDLE,
  cancelBankSlipStatus: API_STATUS.IDLE,
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

const bankSlipSlice = createSlice({
  name: "bankSlip",

  initialState,

  reducers: {
    clearBankSlipError(state) {
      state.error = null;
    },

    clearBankSlipMessage(state) {
      state.message = null;
    },

    setCurrentBankSlip(state, action) {
      state.currentBankSlip = action.payload || null;
    },

    clearCurrentBankSlip(state) {
      state.currentBankSlip = null;
    },

    clearBankSlips(state) {
      state.bankSlips = [];
    },

    clearManagedBankSlip(state) {
      state.managedBankSlip = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE BANK SLIP
      .addCase(createBankSlip.pending, (state) => {
        state.createBankSlipStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createBankSlip.fulfilled, (state, action) => {
        state.createBankSlipStatus = API_STATUS.SUCCESS;

        state.currentBankSlip = action.payload || null;

        if (action.payload) {
          state.bankSlips.unshift(action.payload);
        }

        state.message = "Bank slip created successfully";
      })
      .addCase(createBankSlip.rejected, (state, action) => {
        state.createBankSlipStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank slip creation failed";
      })

      // GET BANK SLIPS
      .addCase(getBankSlips.pending, (state) => {
        state.getBankSlipsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getBankSlips.fulfilled, (state, action) => {
        state.getBankSlipsStatus = API_STATUS.SUCCESS;

        state.bankSlips = action.payload?.bankSlips || [];

        state.message = "Bank slips fetched successfully";
      })
      .addCase(getBankSlips.rejected, (state, action) => {
        state.getBankSlipsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch bank slips";
      })

      // GET BANK SLIP BY ID
      .addCase(getBankSlipById.pending, setPending)
      .addCase(getBankSlipById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getBankSlipStatus = API_STATUS.SUCCESS;

        state.managedBankSlip = action.payload || null;

        state.message = "Bank slip fetched successfully";
      })
      .addCase(getBankSlipById.rejected, (state, action) => {
        setRejected(state, action);
        state.getBankSlipStatus = API_STATUS.ERROR;
      })

      // SUBMIT BANK SLIP
      .addCase(submitBankSlip.pending, (state) => {
        state.submitBankSlipStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(submitBankSlip.fulfilled, (state, action) => {
        state.submitBankSlipStatus = API_STATUS.SUCCESS;

        state.bankSlips = state.bankSlips.map((bankSlip) =>
          bankSlip?._id === action.payload?._id ? action.payload : bankSlip,
        );

        state.managedBankSlip = action.payload || state.managedBankSlip;

        if (
          state.currentBankSlip?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankSlip = action.payload;
        }

        state.message = "Bank slip submitted successfully";
      })
      .addCase(submitBankSlip.rejected, (state, action) => {
        state.submitBankSlipStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank slip submission failed";
      })

      // CONFIRM BANK SLIP
      .addCase(confirmBankSlip.pending, (state) => {
        state.confirmBankSlipStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(confirmBankSlip.fulfilled, (state, action) => {
        state.confirmBankSlipStatus = API_STATUS.SUCCESS;

        state.bankSlips = state.bankSlips.map((bankSlip) =>
          bankSlip?._id === action.payload?._id ? action.payload : bankSlip,
        );

        state.managedBankSlip = action.payload || state.managedBankSlip;

        if (
          state.currentBankSlip?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankSlip = action.payload;
        }

        state.message = "Bank slip confirmed successfully";
      })
      .addCase(confirmBankSlip.rejected, (state, action) => {
        state.confirmBankSlipStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank slip confirmation failed";
      })

      // REJECT BANK SLIP
      .addCase(rejectBankSlip.pending, (state) => {
        state.rejectBankSlipStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(rejectBankSlip.fulfilled, (state, action) => {
        state.rejectBankSlipStatus = API_STATUS.SUCCESS;

        state.bankSlips = state.bankSlips.map((bankSlip) =>
          bankSlip?._id === action.payload?._id ? action.payload : bankSlip,
        );

        state.managedBankSlip = action.payload || state.managedBankSlip;

        if (
          state.currentBankSlip?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankSlip = action.payload;
        }

        state.message = "Bank slip rejected successfully";
      })
      .addCase(rejectBankSlip.rejected, (state, action) => {
        state.rejectBankSlipStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank slip rejection failed";
      })

      // CANCEL BANK SLIP
      .addCase(cancelBankSlip.pending, (state) => {
        state.cancelBankSlipStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(cancelBankSlip.fulfilled, (state, action) => {
        state.cancelBankSlipStatus = API_STATUS.SUCCESS;

        state.bankSlips = state.bankSlips.map((bankSlip) =>
          bankSlip?._id === action.payload?._id ? action.payload : bankSlip,
        );

        state.managedBankSlip = action.payload || state.managedBankSlip;

        if (
          state.currentBankSlip?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankSlip = action.payload;
        }

        state.message = "Bank slip cancelled successfully";
      })
      .addCase(cancelBankSlip.rejected, (state, action) => {
        state.cancelBankSlipStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank slip cancellation failed";
      });
  },
});

export const {
  clearBankSlipError,
  clearBankSlipMessage,
  setCurrentBankSlip,
  clearCurrentBankSlip,
  clearBankSlips,
  clearManagedBankSlip,
} = bankSlipSlice.actions;

export default bankSlipSlice.reducer;
