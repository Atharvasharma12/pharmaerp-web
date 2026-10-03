import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createAccountGroup,
  getAccountGroups,
  getAccountGroupById,
  updateAccountGroup,
  deleteAccountGroup,
} from "./accountGroupThunk";

const initialState = {
  accountGroups: [],
  currentAccountGroup: null,
  managedAccountGroup: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createAccountGroupStatus: API_STATUS.IDLE,
  getAccountGroupsStatus: API_STATUS.IDLE,
  getAccountGroupStatus: API_STATUS.IDLE,
  updateAccountGroupStatus: API_STATUS.IDLE,
  deleteAccountGroupStatus: API_STATUS.IDLE,
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

const accountGroupSlice = createSlice({
  name: "accountGroup",
  initialState,
  reducers: {
    clearAccountGroupError(state) {
      state.error = null;
    },

    clearAccountGroupMessage(state) {
      state.message = null;
    },

    setCurrentAccountGroup(state, action) {
      state.currentAccountGroup = action.payload || null;
    },

    clearCurrentAccountGroup(state) {
      state.currentAccountGroup = null;
    },

    clearAccountGroups(state) {
      state.accountGroups = [];
    },

    clearManagedAccountGroup(state) {
      state.managedAccountGroup = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE ACCOUNT GROUP
      .addCase(createAccountGroup.pending, (state) => {
        state.createAccountGroupStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createAccountGroup.fulfilled, (state, action) => {
        state.createAccountGroupStatus = API_STATUS.SUCCESS;

        state.currentAccountGroup = action.payload || null;

        if (action.payload) {
          state.accountGroups.unshift(action.payload);
        }

        state.message = "Account group created successfully";
      })
      .addCase(createAccountGroup.rejected, (state, action) => {
        state.createAccountGroupStatus = API_STATUS.ERROR;
        state.error = action.payload || "Account group creation failed";
      })

      // GET ACCOUNT GROUPS
      .addCase(getAccountGroups.pending, (state) => {
        state.getAccountGroupsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getAccountGroups.fulfilled, (state, action) => {
        state.getAccountGroupsStatus = API_STATUS.SUCCESS;

        state.accountGroups =
          action.payload?.groups || action.payload?.accountGroups || [];

        state.message = "Account groups fetched successfully";
      })
      .addCase(getAccountGroups.rejected, (state, action) => {
        state.getAccountGroupsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch account groups";
      })

      // GET ACCOUNT GROUP BY ID
      .addCase(getAccountGroupById.pending, setPending)
      .addCase(getAccountGroupById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getAccountGroupStatus = API_STATUS.SUCCESS;

        state.managedAccountGroup = action.payload || null;

        state.message = "Account group fetched successfully";
      })
      .addCase(getAccountGroupById.rejected, (state, action) => {
        setRejected(state, action);
        state.getAccountGroupStatus = API_STATUS.ERROR;
      })

      // UPDATE ACCOUNT GROUP
      .addCase(updateAccountGroup.pending, (state) => {
        state.updateAccountGroupStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateAccountGroup.fulfilled, (state, action) => {
        state.updateAccountGroupStatus = API_STATUS.SUCCESS;

        state.accountGroups = state.accountGroups.map((group) =>
          group?._id === action.payload?._id ? action.payload : group,
        );

        state.managedAccountGroup = action.payload || state.managedAccountGroup;

        if (
          state.currentAccountGroup?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentAccountGroup = action.payload;
        }

        state.message = "Account group updated successfully";
      })
      .addCase(updateAccountGroup.rejected, (state, action) => {
        state.updateAccountGroupStatus = API_STATUS.ERROR;
        state.error = action.payload || "Account group update failed";
      })

      // DELETE ACCOUNT GROUP
      .addCase(deleteAccountGroup.pending, (state) => {
        state.deleteAccountGroupStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteAccountGroup.fulfilled, (state, action) => {
        state.deleteAccountGroupStatus = API_STATUS.SUCCESS;

        state.accountGroups = state.accountGroups.filter(
          (group) => group?._id !== action.meta.arg,
        );

        if (state.managedAccountGroup?._id === action.meta.arg) {
          state.managedAccountGroup = null;
        }

        if (state.currentAccountGroup?._id === action.meta.arg) {
          state.currentAccountGroup = null;
        }

        state.message = "Account group deleted successfully";
      })
      .addCase(deleteAccountGroup.rejected, (state, action) => {
        state.deleteAccountGroupStatus = API_STATUS.ERROR;
        state.error = action.payload || "Account group delete failed";
      });
  },
});

export const {
  clearAccountGroupError,
  clearAccountGroupMessage,
  setCurrentAccountGroup,
  clearCurrentAccountGroup,
  clearAccountGroups,
  clearManagedAccountGroup,
} = accountGroupSlice.actions;

export default accountGroupSlice.reducer;
