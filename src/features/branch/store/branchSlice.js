import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createBranch,
  getCompanyBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "./branchThunk";

const initialState = {
  branches: [],

  currentBranch: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createBranchStatus: API_STATUS.IDLE,
  getCompanyBranchesStatus: API_STATUS.IDLE,
  getBranchStatus: API_STATUS.IDLE,
  updateBranchStatus: API_STATUS.IDLE,
  deleteBranchStatus: API_STATUS.IDLE,
};

const branchSlice = createSlice({
  name: "branch",

  initialState,

  reducers: {
    clearBranchError(state) {
      state.error = null;
    },

    clearBranchMessage(state) {
      state.message = null;
    },

    setCurrentBranch(state, action) {
      state.currentBranch = action.payload || null;
    },

    clearCurrentBranch(state) {
      state.currentBranch = null;
    },

    clearBranches(state) {
      state.branches = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE BRANCH
      .addCase(createBranch.pending, (state) => {
        state.createBranchStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.createBranchStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.branches.unshift(action.payload);
          state.currentBranch = action.payload;
        }

        state.message = "Branch created successfully";
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.createBranchStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create branch";
      })

      // GET COMPANY BRANCHES
      .addCase(getCompanyBranches.pending, (state) => {
        state.getCompanyBranchesStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getCompanyBranches.fulfilled, (state, action) => {
        state.getCompanyBranchesStatus = API_STATUS.SUCCESS;

        state.branches = Array.isArray(action.payload) ? action.payload : [];

        state.message = "Branches fetched successfully";
      })
      .addCase(getCompanyBranches.rejected, (state, action) => {
        state.getCompanyBranchesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch branches";
      })

      // GET BRANCH
      .addCase(getBranchById.pending, (state) => {
        state.getBranchStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.getBranchStatus = API_STATUS.SUCCESS;

        state.currentBranch = action.payload || null;

        state.message = "Branch fetched successfully";
      })
      .addCase(getBranchById.rejected, (state, action) => {
        state.getBranchStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch branch";
      })

      // UPDATE BRANCH
      .addCase(updateBranch.pending, (state) => {
        state.updateBranchStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.updateBranchStatus = API_STATUS.SUCCESS;

        const updatedBranch = action.payload;

        state.currentBranch = updatedBranch || state.currentBranch;

        state.branches = state.branches.map((branch) =>
          branch._id === updatedBranch?._id ? updatedBranch : branch,
        );

        state.message = "Branch updated successfully";
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.updateBranchStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update branch";
      })

      // DELETE BRANCH
      .addCase(deleteBranch.pending, (state) => {
        state.deleteBranchStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.deleteBranchStatus = API_STATUS.SUCCESS;

        state.message =
          action.payload?.message || "Branch deleted successfully";
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.deleteBranchStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to delete branch";
      });
  },
});

export const {
  clearBranchError,
  clearBranchMessage,
  setCurrentBranch,
  clearCurrentBranch,
  clearBranches,
} = branchSlice.actions;

export default branchSlice.reducer;
