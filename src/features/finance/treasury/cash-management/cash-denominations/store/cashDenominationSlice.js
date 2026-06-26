import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createCashDenomination,
  getCashDenominations,
  getCashDenominationById,
  confirmCashDenomination,
  cancelCashDenomination,
} from "./cashDenominationThunk";

const initialState = {
  cashDenominations: [],
  currentCashDenomination: null,
  managedCashDenomination: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createCashDenominationStatus: API_STATUS.IDLE,
  getCashDenominationsStatus: API_STATUS.IDLE,
  getCashDenominationStatus: API_STATUS.IDLE,
  confirmCashDenominationStatus: API_STATUS.IDLE,
  cancelCashDenominationStatus: API_STATUS.IDLE,
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

const cashDenominationSlice = createSlice({
  name: "cashDenomination",

  initialState,

  reducers: {
    clearCashDenominationError(state) {
      state.error = null;
    },

    clearCashDenominationMessage(state) {
      state.message = null;
    },

    setCurrentCashDenomination(state, action) {
      state.currentCashDenomination = action.payload || null;
    },

    clearCurrentCashDenomination(state) {
      state.currentCashDenomination = null;
    },

    clearCashDenominations(state) {
      state.cashDenominations = [];
    },

    clearManagedCashDenomination(state) {
      state.managedCashDenomination = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE CASH DENOMINATION
      .addCase(createCashDenomination.pending, (state) => {
        state.createCashDenominationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createCashDenomination.fulfilled, (state, action) => {
        state.createCashDenominationStatus = API_STATUS.SUCCESS;

        state.currentCashDenomination = action.payload || null;

        if (action.payload) {
          state.cashDenominations.unshift(action.payload);
        }

        state.message = "Cash denomination created successfully";
      })
      .addCase(createCashDenomination.rejected, (state, action) => {
        state.createCashDenominationStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash denomination creation failed";
      })

      // GET CASH DENOMINATIONS
      .addCase(getCashDenominations.pending, (state) => {
        state.getCashDenominationsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getCashDenominations.fulfilled, (state, action) => {
        state.getCashDenominationsStatus = API_STATUS.SUCCESS;

        state.cashDenominations = action.payload?.cashDenominations || [];

        state.message = "Cash denominations fetched successfully";
      })
      .addCase(getCashDenominations.rejected, (state, action) => {
        state.getCashDenominationsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch cash denominations";
      })

      // GET CASH DENOMINATION BY ID
      .addCase(getCashDenominationById.pending, setPending)
      .addCase(getCashDenominationById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getCashDenominationStatus = API_STATUS.SUCCESS;

        state.managedCashDenomination = action.payload || null;

        state.message = "Cash denomination fetched successfully";
      })
      .addCase(getCashDenominationById.rejected, (state, action) => {
        setRejected(state, action);
        state.getCashDenominationStatus = API_STATUS.ERROR;
      })

      // CONFIRM CASH DENOMINATION
      .addCase(confirmCashDenomination.pending, (state) => {
        state.confirmCashDenominationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(confirmCashDenomination.fulfilled, (state, action) => {
        state.confirmCashDenominationStatus = API_STATUS.SUCCESS;

        state.cashDenominations = state.cashDenominations.map(
          (cashDenomination) =>
            cashDenomination?._id === action.payload?._id
              ? action.payload
              : cashDenomination,
        );

        state.managedCashDenomination =
          action.payload || state.managedCashDenomination;

        if (
          state.currentCashDenomination?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCashDenomination = action.payload;
        }

        state.message = "Cash denomination confirmed successfully";
      })
      .addCase(confirmCashDenomination.rejected, (state, action) => {
        state.confirmCashDenominationStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash denomination confirmation failed";
      })

      // CANCEL CASH DENOMINATION
      .addCase(cancelCashDenomination.pending, (state) => {
        state.cancelCashDenominationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(cancelCashDenomination.fulfilled, (state, action) => {
        state.cancelCashDenominationStatus = API_STATUS.SUCCESS;

        state.cashDenominations = state.cashDenominations.map(
          (cashDenomination) =>
            cashDenomination?._id === action.payload?._id
              ? action.payload
              : cashDenomination,
        );

        state.managedCashDenomination =
          action.payload || state.managedCashDenomination;

        if (
          state.currentCashDenomination?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCashDenomination = action.payload;
        }

        state.message = "Cash denomination cancelled successfully";
      })
      .addCase(cancelCashDenomination.rejected, (state, action) => {
        state.cancelCashDenominationStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash denomination cancellation failed";
      });
  },
});

export const {
  clearCashDenominationError,
  clearCashDenominationMessage,
  setCurrentCashDenomination,
  clearCurrentCashDenomination,
  clearCashDenominations,
  clearManagedCashDenomination,
} = cashDenominationSlice.actions;

export default cashDenominationSlice.reducer;
