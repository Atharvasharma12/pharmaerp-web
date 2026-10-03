import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createBankDepositSlip,
  getBankDepositSlips,
  getBankDepositSlipById,
  confirmDeposit,
  cancelBankDepositSlip,
  withdrawFromBankDepositSlip,
  getCashInTransit,
} from "./bankDepositSlipThunk";

const initialState = {
  bankDepositSlips: [],
  currentBankDepositSlip: null,
  managedBankDepositSlip: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createBankDepositSlipStatus: API_STATUS.IDLE,
  getBankDepositSlipsStatus: API_STATUS.IDLE,
  getBankDepositSlipStatus: API_STATUS.IDLE,
  confirmDepositStatus: API_STATUS.IDLE,
  cancelBankDepositSlipStatus: API_STATUS.IDLE,
  withdrawFromSlipStatus: API_STATUS.IDLE,

  cashInTransit: [],
  totalCIT: 0,
  getCashInTransitStatus: API_STATUS.IDLE,
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

const bankDepositSlipSlice = createSlice({
  name: "bankDepositSlip",

  initialState,

  reducers: {
    clearBankDepositSlipError(state) {
      state.error = null;
    },

    clearBankDepositSlipMessage(state) {
      state.message = null;
    },

    setCurrentBankDepositSlip(state, action) {
      state.currentBankDepositSlip = action.payload || null;
    },

    clearCurrentBankDepositSlip(state) {
      state.currentBankDepositSlip = null;
    },

    clearBankDepositSlips(state) {
      state.bankDepositSlips = [];
    },

    clearManagedBankDepositSlip(state) {
      state.managedBankDepositSlip = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE BANK DEPOSIT SLIP
      .addCase(createBankDepositSlip.pending, (state) => {
        state.createBankDepositSlipStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createBankDepositSlip.fulfilled, (state, action) => {
        state.createBankDepositSlipStatus = API_STATUS.SUCCESS;

        state.currentBankDepositSlip = action.payload || null;

        if (action.payload) {
          state.bankDepositSlips.unshift(action.payload);
        }

        state.message = "Bank deposit slip created successfully";
      })
      .addCase(createBankDepositSlip.rejected, (state, action) => {
        state.createBankDepositSlipStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank deposit slip creation failed";
      })

      // GET BANK DEPOSIT SLIPS
      .addCase(getBankDepositSlips.pending, (state) => {
        state.getBankDepositSlipsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getBankDepositSlips.fulfilled, (state, action) => {
        state.getBankDepositSlipsStatus = API_STATUS.SUCCESS;

        state.bankDepositSlips =
          action.payload?.bankDepositSlips ||
          (Array.isArray(action.payload) ? action.payload : []);
        state.totalCount =
          action.payload?.total ??
          action.payload?.totalCount ??
          state.bankDepositSlips.length;
      })
      .addCase(getBankDepositSlips.rejected, (state, action) => {
        state.getBankDepositSlipsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch bank deposit slips";
      })

      // GET BANK DEPOSIT SLIP BY ID
      .addCase(getBankDepositSlipById.pending, setPending)
      .addCase(getBankDepositSlipById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getBankDepositSlipStatus = API_STATUS.SUCCESS;

        state.managedBankDepositSlip = action.payload || null;

        state.message = "Bank deposit slip fetched successfully";
      })
      .addCase(getBankDepositSlipById.rejected, (state, action) => {
        setRejected(state, action);
        state.getBankDepositSlipStatus = API_STATUS.ERROR;
      })

      // CONFIRM DEPOSIT
      .addCase(confirmDeposit.pending, (state) => {
        state.confirmDepositStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(confirmDeposit.fulfilled, (state, action) => {
        state.confirmDepositStatus = API_STATUS.SUCCESS;

        state.bankDepositSlips = state.bankDepositSlips.map((slip) =>
          slip?._id === action.payload?._id ? action.payload : slip,
        );

        state.managedBankDepositSlip = action.payload || state.managedBankDepositSlip;

        if (
          state.currentBankDepositSlip?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankDepositSlip = action.payload;
        }

        state.message = "Bank deposit slip confirmed successfully";
      })
      .addCase(confirmDeposit.rejected, (state, action) => {
        state.confirmDepositStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank deposit slip confirmation failed";
      })

      // CANCEL BANK DEPOSIT SLIP
      .addCase(cancelBankDepositSlip.pending, (state) => {
        state.cancelBankDepositSlipStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(cancelBankDepositSlip.fulfilled, (state, action) => {
        state.cancelBankDepositSlipStatus = API_STATUS.SUCCESS;

        state.bankDepositSlips = state.bankDepositSlips.map((slip) =>
          slip?._id === action.payload?._id ? action.payload : slip,
        );

        state.managedBankDepositSlip = action.payload || state.managedBankDepositSlip;

        if (
          state.currentBankDepositSlip?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankDepositSlip = action.payload;
        }

        state.message = "Bank deposit slip cancelled successfully";
      })
      .addCase(cancelBankDepositSlip.rejected, (state, action) => {
        state.cancelBankDepositSlipStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank deposit slip cancellation failed";
      })

      // WITHDRAW FROM BANK DEPOSIT SLIP
      .addCase(withdrawFromBankDepositSlip.pending, (state) => {
        state.withdrawFromSlipStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(withdrawFromBankDepositSlip.fulfilled, (state, action) => {
        state.withdrawFromSlipStatus = API_STATUS.SUCCESS;

        state.bankDepositSlips = state.bankDepositSlips.map((slip) =>
          slip?._id === action.payload?._id ? action.payload : slip,
        );

        state.managedBankDepositSlip = action.payload || state.managedBankDepositSlip;

        if (
          state.currentBankDepositSlip?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankDepositSlip = action.payload;
        }

        // Also update cashInTransit array if it's there
        state.cashInTransit = state.cashInTransit.map((slip) =>
          slip?._id === action.payload?._id ? action.payload : slip,
        );

        state.message = "Partial withdrawal from bank deposit slip successful";
      })
      .addCase(withdrawFromBankDepositSlip.rejected, (state, action) => {
        state.withdrawFromSlipStatus = API_STATUS.ERROR;
        state.error = action.payload || "Partial withdrawal failed";
      })

      // GET CASH IN TRANSIT
      .addCase(getCashInTransit.pending, (state) => {
        state.getCashInTransitStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getCashInTransit.fulfilled, (state, action) => {
        state.getCashInTransitStatus = API_STATUS.SUCCESS;
        state.cashInTransit =
          action.payload?.cashInTransit ||
          (Array.isArray(action.payload) ? action.payload : []);
        state.totalCIT = action.payload?.totalCIT ?? 0;
      })
      .addCase(getCashInTransit.rejected, (state, action) => {
        state.getCashInTransitStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch cash in transit";
      });
  },

});

export const {
  clearBankDepositSlipError,
  clearBankDepositSlipMessage,
  setCurrentBankDepositSlip,
  clearCurrentBankDepositSlip,
  clearBankDepositSlips,
  clearManagedBankDepositSlip,
} = bankDepositSlipSlice.actions;

export default bankDepositSlipSlice.reducer;
