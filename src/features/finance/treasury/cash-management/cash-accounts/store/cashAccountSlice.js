import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createCashAccount,
  getCashAccounts,
  getCashAccountById,
  updateCashAccount,
  deleteCashAccount,
  setPrimaryCashAccount,
} from "./cashAccountThunk";

const initialState = {
  cashAccounts: [],
  currentCashAccount: null,
  managedCashAccount: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createCashAccountStatus: API_STATUS.IDLE,
  getCashAccountsStatus: API_STATUS.IDLE,
  getCashAccountStatus: API_STATUS.IDLE,
  updateCashAccountStatus: API_STATUS.IDLE,
  deleteCashAccountStatus: API_STATUS.IDLE,
  setPrimaryCashAccountStatus: API_STATUS.IDLE,
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

const cashAccountSlice = createSlice({
  name: "cashAccount",

  initialState,

  reducers: {
    clearCashAccountError(state) {
      state.error = null;
    },

    clearCashAccountMessage(state) {
      state.message = null;
    },

    setCurrentCashAccount(state, action) {
      state.currentCashAccount = action.payload || null;
    },

    clearCurrentCashAccount(state) {
      state.currentCashAccount = null;
    },

    clearCashAccounts(state) {
      state.cashAccounts = [];
    },

    clearManagedCashAccount(state) {
      state.managedCashAccount = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE CASH ACCOUNT
      .addCase(createCashAccount.pending, (state) => {
        state.createCashAccountStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createCashAccount.fulfilled, (state, action) => {
        state.createCashAccountStatus = API_STATUS.SUCCESS;

        state.currentCashAccount = action.payload || null;

        if (action.payload) {
          state.cashAccounts.unshift(action.payload);
        }

        state.message = "Cash account created successfully";
      })
      .addCase(createCashAccount.rejected, (state, action) => {
        state.createCashAccountStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash account creation failed";
      })

      // GET CASH ACCOUNTS
      .addCase(getCashAccounts.pending, (state) => {
        state.getCashAccountsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getCashAccounts.fulfilled, (state, action) => {
        state.getCashAccountsStatus = API_STATUS.SUCCESS;

        state.cashAccounts = action.payload?.cashAccounts || [];

        state.message = "Cash accounts fetched successfully";
      })
      .addCase(getCashAccounts.rejected, (state, action) => {
        state.getCashAccountsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch cash accounts";
      })

      // GET CASH ACCOUNT BY ID
      .addCase(getCashAccountById.pending, setPending)
      .addCase(getCashAccountById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getCashAccountStatus = API_STATUS.SUCCESS;

        state.managedCashAccount = action.payload || null;

        state.message = "Cash account fetched successfully";
      })
      .addCase(getCashAccountById.rejected, (state, action) => {
        setRejected(state, action);
        state.getCashAccountStatus = API_STATUS.ERROR;
      })

      // UPDATE CASH ACCOUNT
      .addCase(updateCashAccount.pending, (state) => {
        state.updateCashAccountStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateCashAccount.fulfilled, (state, action) => {
        state.updateCashAccountStatus = API_STATUS.SUCCESS;

        state.cashAccounts = state.cashAccounts.map((cashAccount) =>
          cashAccount?._id === action.payload?._id
            ? action.payload
            : cashAccount,
        );

        state.managedCashAccount = action.payload || state.managedCashAccount;

        if (
          state.currentCashAccount?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCashAccount = action.payload;
        }

        state.message = "Cash account updated successfully";
      })
      .addCase(updateCashAccount.rejected, (state, action) => {
        state.updateCashAccountStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash account update failed";
      })

      // DELETE CASH ACCOUNT
      .addCase(deleteCashAccount.pending, (state) => {
        state.deleteCashAccountStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteCashAccount.fulfilled, (state, action) => {
        state.deleteCashAccountStatus = API_STATUS.SUCCESS;

        state.cashAccounts = state.cashAccounts.filter(
          (cashAccount) => cashAccount?._id !== action.meta.arg,
        );

        if (state.managedCashAccount?._id === action.meta.arg) {
          state.managedCashAccount = null;
        }

        if (state.currentCashAccount?._id === action.meta.arg) {
          state.currentCashAccount = null;
        }

        state.message = "Cash account deleted successfully";
      })
      .addCase(deleteCashAccount.rejected, (state, action) => {
        state.deleteCashAccountStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash account delete failed";
      })

      // SET PRIMARY CASH ACCOUNT
      .addCase(setPrimaryCashAccount.pending, (state) => {
        state.setPrimaryCashAccountStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(setPrimaryCashAccount.fulfilled, (state, action) => {
        state.setPrimaryCashAccountStatus = API_STATUS.SUCCESS;

        state.cashAccounts = state.cashAccounts.map((cashAccount) => ({
          ...cashAccount,
          isPrimary: cashAccount._id === action.payload?._id,
        }));

        if (state.managedCashAccount) {
          state.managedCashAccount = action.payload;
        }

        if (state.currentCashAccount?._id === action.payload?._id) {
          state.currentCashAccount = action.payload;
        }

        state.message = "Primary cash account updated successfully";
      })
      .addCase(setPrimaryCashAccount.rejected, (state, action) => {
        state.setPrimaryCashAccountStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to set primary cash account";
      });
  },
});

export const {
  clearCashAccountError,
  clearCashAccountMessage,
  setCurrentCashAccount,
  clearCurrentCashAccount,
  clearCashAccounts,
  clearManagedCashAccount,
} = cashAccountSlice.actions;

export default cashAccountSlice.reducer;
