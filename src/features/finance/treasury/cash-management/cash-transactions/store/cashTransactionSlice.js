import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createCashTransaction,
  getCashTransactions,
  getCashTransactionById,
  cancelCashTransaction,
} from "./cashTransactionThunk";

const initialState = {
  cashTransactions: [],
  currentCashTransaction: null,
  managedCashTransaction: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createCashTransactionStatus: API_STATUS.IDLE,
  getCashTransactionsStatus: API_STATUS.IDLE,
  getCashTransactionStatus: API_STATUS.IDLE,
  cancelCashTransactionStatus: API_STATUS.IDLE,
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

const cashTransactionSlice = createSlice({
  name: "cashTransaction",

  initialState,

  reducers: {
    clearCashTransactionError(state) {
      state.error = null;
    },

    clearCashTransactionMessage(state) {
      state.message = null;
    },

    setCurrentCashTransaction(state, action) {
      state.currentCashTransaction = action.payload || null;
    },

    clearCurrentCashTransaction(state) {
      state.currentCashTransaction = null;
    },

    clearCashTransactions(state) {
      state.cashTransactions = [];
    },

    clearManagedCashTransaction(state) {
      state.managedCashTransaction = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE CASH TRANSACTION
      .addCase(createCashTransaction.pending, (state) => {
        state.createCashTransactionStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createCashTransaction.fulfilled, (state, action) => {
        state.createCashTransactionStatus = API_STATUS.SUCCESS;

        state.currentCashTransaction = action.payload || null;

        if (action.payload) {
          state.cashTransactions.unshift(action.payload);
        }

        state.message = "Cash transaction created successfully";
      })
      .addCase(createCashTransaction.rejected, (state, action) => {
        state.createCashTransactionStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash transaction creation failed";
      })

      // GET CASH TRANSACTIONS
      .addCase(getCashTransactions.pending, (state) => {
        state.getCashTransactionsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getCashTransactions.fulfilled, (state, action) => {
        state.getCashTransactionsStatus = API_STATUS.SUCCESS;

        state.cashTransactions = action.payload?.cashTransactions || [];

        state.message = "Cash transactions fetched successfully";
      })
      .addCase(getCashTransactions.rejected, (state, action) => {
        state.getCashTransactionsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch cash transactions";
      })

      // GET CASH TRANSACTION BY ID
      .addCase(getCashTransactionById.pending, setPending)
      .addCase(getCashTransactionById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getCashTransactionStatus = API_STATUS.SUCCESS;

        state.managedCashTransaction = action.payload || null;

        state.message = "Cash transaction fetched successfully";
      })
      .addCase(getCashTransactionById.rejected, (state, action) => {
        setRejected(state, action);
        state.getCashTransactionStatus = API_STATUS.ERROR;
      })

      // CANCEL CASH TRANSACTION
      .addCase(cancelCashTransaction.pending, (state) => {
        state.cancelCashTransactionStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(cancelCashTransaction.fulfilled, (state, action) => {
        state.cancelCashTransactionStatus = API_STATUS.SUCCESS;

        state.cashTransactions = state.cashTransactions.map(
          (cashTransaction) =>
            cashTransaction?._id === action.payload?._id
              ? action.payload
              : cashTransaction,
        );

        state.managedCashTransaction =
          action.payload || state.managedCashTransaction;

        if (
          state.currentCashTransaction?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCashTransaction = action.payload;
        }

        state.message = "Cash transaction cancelled successfully";
      })
      .addCase(cancelCashTransaction.rejected, (state, action) => {
        state.cancelCashTransactionStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash transaction cancellation failed";
      });
  },
});

export const {
  clearCashTransactionError,
  clearCashTransactionMessage,
  setCurrentCashTransaction,
  clearCurrentCashTransaction,
  clearCashTransactions,
  clearManagedCashTransaction,
} = cashTransactionSlice.actions;

export default cashTransactionSlice.reducer;
