import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/constants";
import {
  listBranchCash,
  fetchBranchCash,
  depositCash,
  withdrawCash,
} from "./branchCashThunk";

const initialState = {
  // List of all branches' cash (company-level view)
  allBranchCash: [],
  // Current branch's cash detail (running + frozen + denominations)
  currentBranchCash: null,

  listStatus: API_STATUS.IDLE,
  fetchStatus: API_STATUS.IDLE,
  depositStatus: API_STATUS.IDLE,
  withdrawStatus: API_STATUS.IDLE,

  error: null,
  message: null,
};

const branchCashSlice = createSlice({
  name: "branchCash",
  initialState,
  reducers: {
    resetBranchCashStatus(state) {
      state.depositStatus = API_STATUS.IDLE;
      state.withdrawStatus = API_STATUS.IDLE;
      state.error = null;
      state.message = null;
    },
    clearCurrentBranchCash(state) {
      state.currentBranchCash = null;
    },
  },
  extraReducers: (builder) => {
    // ── List all ──────────────────────────────────────────────────────────
    builder
      .addCase(listBranchCash.pending, (state) => {
        state.listStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(listBranchCash.fulfilled, (state, action) => {
        state.listStatus = API_STATUS.SUCCESS;
        state.allBranchCash = action.payload || [];
      })
      .addCase(listBranchCash.rejected, (state, action) => {
        state.listStatus = API_STATUS.ERROR;
        state.error = action.payload;
      });

    // ── Fetch by branch ───────────────────────────────────────────────────
    builder
      .addCase(fetchBranchCash.pending, (state) => {
        state.fetchStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchBranchCash.fulfilled, (state, action) => {
        state.fetchStatus = API_STATUS.SUCCESS;
        state.currentBranchCash = action.payload;
        // Also update in list if present
        const idx = state.allBranchCash.findIndex(
          (b) => b.branchId === action.payload?.branchId
        );
        if (idx >= 0) state.allBranchCash[idx] = action.payload;
      })
      .addCase(fetchBranchCash.rejected, (state, action) => {
        state.fetchStatus = API_STATUS.ERROR;
        state.error = action.payload;
      });

    // ── Deposit ───────────────────────────────────────────────────────────
    builder
      .addCase(depositCash.pending, (state) => {
        state.depositStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(depositCash.fulfilled, (state, action) => {
        state.depositStatus = API_STATUS.SUCCESS;
        state.message = "Cash deposited to running balance successfully";
        state.currentBranchCash = action.payload;
      })
      .addCase(depositCash.rejected, (state, action) => {
        state.depositStatus = API_STATUS.ERROR;
        state.error = action.payload;
      });

    // ── Withdraw ──────────────────────────────────────────────────────────
    builder
      .addCase(withdrawCash.pending, (state) => {
        state.withdrawStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(withdrawCash.fulfilled, (state, action) => {
        state.withdrawStatus = API_STATUS.SUCCESS;
        state.message = "Cash withdrawn from frozen reserve successfully";
        state.currentBranchCash = action.payload;
      })
      .addCase(withdrawCash.rejected, (state, action) => {
        state.withdrawStatus = API_STATUS.ERROR;
        state.error = action.payload;
      });
  },
});

export const { resetBranchCashStatus, clearCurrentBranchCash } =
  branchCashSlice.actions;

export default branchCashSlice.reducer;
