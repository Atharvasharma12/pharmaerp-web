import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createBankTransaction,
  getBankTransactions,
  getBankTransactionById,
  cancelBankTransaction,
} from "./bankTransactionThunk";

const initialState = {
  bankTransactions: [],
  currentBankTransaction: null,
  managedBankTransaction: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createBankTransactionStatus: API_STATUS.IDLE,
  getBankTransactionsStatus: API_STATUS.IDLE,
  getBankTransactionStatus: API_STATUS.IDLE,
  cancelBankTransactionStatus: API_STATUS.IDLE,
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

const bankTransactionSlice = createSlice({
  name: "bankTransaction",

  initialState,

  reducers: {
    clearBankTransactionError(state) {
      state.error = null;
    },

    clearBankTransactionMessage(state) {
      state.message = null;
    },

    setCurrentBankTransaction(state, action) {
      state.currentBankTransaction = action.payload || null;
    },

    clearCurrentBankTransaction(state) {
      state.currentBankTransaction = null;
    },

    clearBankTransactions(state) {
      state.bankTransactions = [];
    },

    clearManagedBankTransaction(state) {
      state.managedBankTransaction = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE BANK TRANSACTION
      .addCase(createBankTransaction.pending, (state) => {
        state.createBankTransactionStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createBankTransaction.fulfilled, (state, action) => {
        state.createBankTransactionStatus = API_STATUS.SUCCESS;

        state.currentBankTransaction = action.payload || null;

        if (action.payload) {
          state.bankTransactions.unshift(action.payload);
        }

        state.message = "Bank transaction created successfully";
      })
      .addCase(createBankTransaction.rejected, (state, action) => {
        state.createBankTransactionStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank transaction creation failed";
      })

      // GET BANK TRANSACTIONS
      .addCase(getBankTransactions.pending, (state) => {
        state.getBankTransactionsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getBankTransactions.fulfilled, (state, action) => {
        state.getBankTransactionsStatus = API_STATUS.SUCCESS;

        state.bankTransactions = action.payload?.bankTransactions || [];
      })
      .addCase(getBankTransactions.rejected, (state, action) => {
        state.getBankTransactionsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch bank transactions";
      })

      // GET BANK TRANSACTION BY ID
      .addCase(getBankTransactionById.pending, setPending)
      .addCase(getBankTransactionById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getBankTransactionStatus = API_STATUS.SUCCESS;

        state.managedBankTransaction = action.payload || null;

        state.message = "Bank transaction fetched successfully";
      })
      .addCase(getBankTransactionById.rejected, (state, action) => {
        setRejected(state, action);
        state.getBankTransactionStatus = API_STATUS.ERROR;
      })

      // CANCEL BANK TRANSACTION
      .addCase(cancelBankTransaction.pending, (state) => {
        state.cancelBankTransactionStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(cancelBankTransaction.fulfilled, (state, action) => {
        state.cancelBankTransactionStatus = API_STATUS.SUCCESS;

        state.bankTransactions = state.bankTransactions.map(
          (bankTransaction) =>
            bankTransaction?._id === action.payload?._id
              ? action.payload
              : bankTransaction,
        );

        state.managedBankTransaction =
          action.payload || state.managedBankTransaction;

        if (
          state.currentBankTransaction?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankTransaction = action.payload;
        }

        state.message = "Bank transaction cancelled successfully";
      })
      .addCase(cancelBankTransaction.rejected, (state, action) => {
        state.cancelBankTransactionStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank transaction cancellation failed";
      });
  },
});

export const {
  clearBankTransactionError,
  clearBankTransactionMessage,
  setCurrentBankTransaction,
  clearCurrentBankTransaction,
  clearBankTransactions,
  clearManagedBankTransaction,
} = bankTransactionSlice.actions;

export default bankTransactionSlice.reducer;
