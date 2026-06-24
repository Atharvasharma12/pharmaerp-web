import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createBankAccount,
  getBankAccounts,
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
  setPrimaryBankAccount,
} from "./bankAccountThunk";

const initialState = {
  bankAccounts: [],
  currentBankAccount: null,
  managedBankAccount: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createBankAccountStatus: API_STATUS.IDLE,
  getBankAccountsStatus: API_STATUS.IDLE,
  getBankAccountStatus: API_STATUS.IDLE,
  updateBankAccountStatus: API_STATUS.IDLE,
  deleteBankAccountStatus: API_STATUS.IDLE,
  setPrimaryBankAccountStatus: API_STATUS.IDLE,
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

const bankAccountSlice = createSlice({
  name: "bankAccount",
  initialState,

  reducers: {
    clearBankAccountError(state) {
      state.error = null;
    },

    clearBankAccountMessage(state) {
      state.message = null;
    },

    setCurrentBankAccount(state, action) {
      state.currentBankAccount = action.payload || null;
    },

    clearCurrentBankAccount(state) {
      state.currentBankAccount = null;
    },

    clearBankAccounts(state) {
      state.bankAccounts = [];
    },

    clearManagedBankAccount(state) {
      state.managedBankAccount = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE BANK ACCOUNT
      .addCase(createBankAccount.pending, (state) => {
        state.createBankAccountStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createBankAccount.fulfilled, (state, action) => {
        state.createBankAccountStatus = API_STATUS.SUCCESS;

        state.currentBankAccount = action.payload || null;

        if (action.payload) {
          state.bankAccounts.unshift(action.payload);
        }

        state.message = "Bank account created successfully";
      })
      .addCase(createBankAccount.rejected, (state, action) => {
        state.createBankAccountStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank account creation failed";
      })

      // GET BANK ACCOUNTS
      .addCase(getBankAccounts.pending, (state) => {
        state.getBankAccountsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getBankAccounts.fulfilled, (state, action) => {
        state.getBankAccountsStatus = API_STATUS.SUCCESS;

        state.bankAccounts = action.payload?.bankAccounts || [];

        state.message = "Bank accounts fetched successfully";
      })
      .addCase(getBankAccounts.rejected, (state, action) => {
        state.getBankAccountsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch bank accounts";
      })

      // GET BANK ACCOUNT BY ID
      .addCase(getBankAccountById.pending, setPending)
      .addCase(getBankAccountById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getBankAccountStatus = API_STATUS.SUCCESS;

        state.managedBankAccount = action.payload || null;

        state.message = "Bank account fetched successfully";
      })
      .addCase(getBankAccountById.rejected, (state, action) => {
        setRejected(state, action);
        state.getBankAccountStatus = API_STATUS.ERROR;
      })

      // UPDATE BANK ACCOUNT
      .addCase(updateBankAccount.pending, (state) => {
        state.updateBankAccountStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateBankAccount.fulfilled, (state, action) => {
        state.updateBankAccountStatus = API_STATUS.SUCCESS;

        state.bankAccounts = state.bankAccounts.map((bankAccount) =>
          bankAccount?._id === action.payload?._id
            ? action.payload
            : bankAccount,
        );

        state.managedBankAccount = action.payload || state.managedBankAccount;

        if (
          state.currentBankAccount?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentBankAccount = action.payload;
        }

        state.message = "Bank account updated successfully";
      })
      .addCase(updateBankAccount.rejected, (state, action) => {
        state.updateBankAccountStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank account update failed";
      })

      // DELETE BANK ACCOUNT
      .addCase(deleteBankAccount.pending, (state) => {
        state.deleteBankAccountStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteBankAccount.fulfilled, (state, action) => {
        state.deleteBankAccountStatus = API_STATUS.SUCCESS;

        state.bankAccounts = state.bankAccounts.filter(
          (bankAccount) => bankAccount?._id !== action.meta.arg,
        );

        if (state.managedBankAccount?._id === action.meta.arg) {
          state.managedBankAccount = null;
        }

        if (state.currentBankAccount?._id === action.meta.arg) {
          state.currentBankAccount = null;
        }

        state.message = "Bank account deleted successfully";
      })
      .addCase(deleteBankAccount.rejected, (state, action) => {
        state.deleteBankAccountStatus = API_STATUS.ERROR;
        state.error = action.payload || "Bank account delete failed";
      })

      // SET PRIMARY BANK ACCOUNT
      .addCase(setPrimaryBankAccount.pending, (state) => {
        state.setPrimaryBankAccountStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(setPrimaryBankAccount.fulfilled, (state, action) => {
        state.setPrimaryBankAccountStatus = API_STATUS.SUCCESS;

        state.bankAccounts = state.bankAccounts.map((bankAccount) => ({
          ...bankAccount,
          isPrimary: bankAccount._id === action.payload?._id,
        }));

        if (state.managedBankAccount) {
          state.managedBankAccount = action.payload;
        }

        if (state.currentBankAccount?._id === action.payload?._id) {
          state.currentBankAccount = action.payload;
        }

        state.message = "Primary bank account updated successfully";
      })
      .addCase(setPrimaryBankAccount.rejected, (state, action) => {
        state.setPrimaryBankAccountStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to set primary bank account";
      });
  },
});

export const {
  clearBankAccountError,
  clearBankAccountMessage,
  setCurrentBankAccount,
  clearCurrentBankAccount,
  clearBankAccounts,
  clearManagedBankAccount,
} = bankAccountSlice.actions;

export default bankAccountSlice.reducer;
