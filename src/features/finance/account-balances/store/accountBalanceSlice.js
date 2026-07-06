import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getAccountBalances,
  getAccountBalanceByAccountId,
  recalculateAccountBalance,
} from "./accountBalanceThunk";

const initialState = {
  accountBalances: [],
  currentAccountBalance: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getAccountBalancesStatus: API_STATUS.IDLE,
  getAccountBalanceStatus: API_STATUS.IDLE,
  recalculateAccountBalanceStatus: API_STATUS.IDLE,
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

const accountBalanceSlice = createSlice({
  name: "accountBalance",
  initialState,

  reducers: {
    clearAccountBalanceError(state) {
      state.error = null;
    },

    clearAccountBalanceMessage(state) {
      state.message = null;
    },

    setCurrentAccountBalance(state, action) {
      state.currentAccountBalance = action.payload || null;
    },

    clearCurrentAccountBalance(state) {
      state.currentAccountBalance = null;
    },

    clearAccountBalances(state) {
      state.accountBalances = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // GET ACCOUNT BALANCES
      .addCase(getAccountBalances.pending, (state) => {
        state.getAccountBalancesStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getAccountBalances.fulfilled, (state, action) => {
        state.getAccountBalancesStatus = API_STATUS.SUCCESS;

        state.accountBalances = action.payload?.balances || [];
      })
      .addCase(getAccountBalances.rejected, (state, action) => {
        state.getAccountBalancesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch account balances";
      })

      // GET ACCOUNT BALANCE BY ACCOUNT ID
      .addCase(getAccountBalanceByAccountId.pending, setPending)
      .addCase(getAccountBalanceByAccountId.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getAccountBalanceStatus = API_STATUS.SUCCESS;

        state.currentAccountBalance = action.payload || null;

        state.message = "Account balance fetched successfully";
      })
      .addCase(getAccountBalanceByAccountId.rejected, (state, action) => {
        setRejected(state, action);
        state.getAccountBalanceStatus = API_STATUS.ERROR;
      })

      // RECALCULATE ACCOUNT BALANCE
      .addCase(recalculateAccountBalance.pending, (state) => {
        state.recalculateAccountBalanceStatus = API_STATUS.LOADING;

        state.error = null;
        state.message = null;
      })
      .addCase(recalculateAccountBalance.fulfilled, (state, action) => {
        state.recalculateAccountBalanceStatus = API_STATUS.SUCCESS;

        state.currentAccountBalance =
          action.payload || state.currentAccountBalance;

        state.accountBalances = state.accountBalances.map((balance) =>
          balance?.accountId?._id === action.payload?.accountId?._id ||
          balance?.accountId === action.payload?.accountId
            ? action.payload
            : balance,
        );

        state.message = "Account balance recalculated successfully";
      })
      .addCase(recalculateAccountBalance.rejected, (state, action) => {
        state.recalculateAccountBalanceStatus = API_STATUS.ERROR;

        state.error = action.payload || "Account balance recalculation failed";
      });
  },
});

export const {
  clearAccountBalanceError,
  clearAccountBalanceMessage,
  setCurrentAccountBalance,
  clearCurrentAccountBalance,
  clearAccountBalances,
} = accountBalanceSlice.actions;

export default accountBalanceSlice.reducer;
