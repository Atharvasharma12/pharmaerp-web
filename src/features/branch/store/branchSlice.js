import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS, BRANCH_STORAGE_KEY } from "@/constants";
import { storage } from "@/utils";

import {
  createBranch,
  getCompanyBranches,
  getWorkspaceBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "./branchThunk";

const persistCurrentBranch = (branch) => {
  if (branch?._id) {
    storage.set(BRANCH_STORAGE_KEY, branch._id);
  }
};

const removePersistedBranch = () => {
  storage.remove(BRANCH_STORAGE_KEY);
};

const initialState = {
  branches: [],

  currentBranch: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createBranchStatus: API_STATUS.IDLE,
  getCompanyBranchesStatus: API_STATUS.IDLE,
  getWorkspaceBranchesStatus: API_STATUS.IDLE,
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

      if (state.currentBranch?._id) {
        persistCurrentBranch(state.currentBranch);
      } else {
        removePersistedBranch();
      }
    },

    clearCurrentBranch(state) {
      state.currentBranch = null;
      removePersistedBranch();
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
        state.message = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.createBranchStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.branches.unshift(action.payload);
          state.currentBranch = action.payload;
          persistCurrentBranch(action.payload);
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

        const persistedBranchId = storage.get(BRANCH_STORAGE_KEY);

        const matchedBranch =
          state.branches.find((branch) => branch?._id === persistedBranchId) ||
          null;

        const firstBranch = state.branches[0] || null;

        state.currentBranch =
          state.currentBranch || matchedBranch || firstBranch;

        if (state.currentBranch?._id) {
          persistCurrentBranch(state.currentBranch);
        } else {
          removePersistedBranch();
        }

        state.message = "Branches fetched successfully";
      })
      .addCase(getCompanyBranches.rejected, (state, action) => {
        state.getCompanyBranchesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch branches";
      })

      // GET WORKSPACE BRANCHES
      .addCase(getWorkspaceBranches.pending, (state) => {
        state.getWorkspaceBranchesStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceBranches.fulfilled, (state, action) => {
        state.getWorkspaceBranchesStatus = API_STATUS.SUCCESS;

        state.branches = Array.isArray(action.payload) ? action.payload : [];

        const persistedBranchId = storage.get(BRANCH_STORAGE_KEY);

        const matchedBranch =
          state.branches.find((branch) => branch?._id === persistedBranchId) ||
          null;

        const firstBranch = state.branches[0] || null;

        state.currentBranch =
          state.currentBranch || matchedBranch || firstBranch;

        if (state.currentBranch?._id) {
          persistCurrentBranch(state.currentBranch);
        } else {
          removePersistedBranch();
        }

        state.message = "Workspace branches fetched successfully";
      })
      .addCase(getWorkspaceBranches.rejected, (state, action) => {
        state.getWorkspaceBranchesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch workspace branches";
      })

      // GET BRANCH
      .addCase(getBranchById.pending, (state) => {
        state.getBranchStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.getBranchStatus = API_STATUS.SUCCESS;

        state.currentBranch = action.payload || null;

        if (action.payload?._id) {
          persistCurrentBranch(action.payload);
        } else {
          removePersistedBranch();
        }

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

        if (state.currentBranch?._id) {
          persistCurrentBranch(state.currentBranch);
        } else {
          removePersistedBranch();
        }

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

        state.branches = state.branches.filter(
          (branch) => branch?._id !== action.meta.arg,
        );

        if (state.currentBranch?._id === action.meta.arg) {
          state.currentBranch = null;
          removePersistedBranch();
        }

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
