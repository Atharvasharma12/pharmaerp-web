import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createJournalVoucher,
  getJournalVouchers,
  getJournalVoucherById,
  updateJournalVoucher,
  postJournalVoucher,
  cancelJournalVoucher,
  submitJournalVoucherApproval,
  approveJournalVoucher,
  reverseJournalVoucher,
} from "./journalVoucherThunk";

const initialState = {
  journalVouchers: [],
  currentJournalVoucher: null,
  managedJournalVoucher: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createJournalVoucherStatus: API_STATUS.IDLE,
  getJournalVouchersStatus: API_STATUS.IDLE,
  getJournalVoucherStatus: API_STATUS.IDLE,
  updateJournalVoucherStatus: API_STATUS.IDLE,
  postJournalVoucherStatus: API_STATUS.IDLE,
  cancelJournalVoucherStatus: API_STATUS.IDLE,
  submitJournalVoucherApprovalStatus: API_STATUS.IDLE,
  approveJournalVoucherStatus: API_STATUS.IDLE,
  reverseJournalVoucherStatus: API_STATUS.IDLE,
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

const journalVoucherSlice = createSlice({
  name: "journalVoucher",

  initialState,

  reducers: {
    clearJournalVoucherError(state) {
      state.error = null;
    },

    clearJournalVoucherMessage(state) {
      state.message = null;
    },

    setCurrentJournalVoucher(state, action) {
      state.currentJournalVoucher = action.payload || null;
    },

    clearCurrentJournalVoucher(state) {
      state.currentJournalVoucher = null;
    },

    clearJournalVouchers(state) {
      state.journalVouchers = [];
    },

    clearManagedJournalVoucher(state) {
      state.managedJournalVoucher = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE JOURNAL VOUCHER
      .addCase(createJournalVoucher.pending, (state) => {
        state.createJournalVoucherStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createJournalVoucher.fulfilled, (state, action) => {
        state.createJournalVoucherStatus = API_STATUS.SUCCESS;

        state.currentJournalVoucher = action.payload || null;

        if (action.payload) {
          state.journalVouchers.unshift(action.payload);
        }

        state.message = "Journal voucher created successfully";
      })
      .addCase(createJournalVoucher.rejected, (state, action) => {
        state.createJournalVoucherStatus = API_STATUS.ERROR;
        state.error = action.payload || "Journal voucher creation failed";
      })

      // GET JOURNAL VOUCHERS
      .addCase(getJournalVouchers.pending, (state) => {
        state.getJournalVouchersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getJournalVouchers.fulfilled, (state, action) => {
        state.getJournalVouchersStatus = API_STATUS.SUCCESS;

        state.journalVouchers = action.payload?.vouchers || [];

        state.message = "Journal vouchers fetched successfully";
      })
      .addCase(getJournalVouchers.rejected, (state, action) => {
        state.getJournalVouchersStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch journal vouchers";
      })

      // GET JOURNAL VOUCHER BY ID
      .addCase(getJournalVoucherById.pending, setPending)
      .addCase(getJournalVoucherById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getJournalVoucherStatus = API_STATUS.SUCCESS;

        state.managedJournalVoucher = action.payload || null;

        state.message = "Journal voucher fetched successfully";
      })
      .addCase(getJournalVoucherById.rejected, (state, action) => {
        setRejected(state, action);
        state.getJournalVoucherStatus = API_STATUS.ERROR;
      })

      // UPDATE JOURNAL VOUCHER
      .addCase(updateJournalVoucher.pending, (state) => {
        state.updateJournalVoucherStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateJournalVoucher.fulfilled, (state, action) => {
        state.updateJournalVoucherStatus = API_STATUS.SUCCESS;

        state.journalVouchers = state.journalVouchers.map((voucher) =>
          voucher?._id === action.payload?._id ? action.payload : voucher,
        );

        state.managedJournalVoucher =
          action.payload || state.managedJournalVoucher;

        if (
          state.currentJournalVoucher?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentJournalVoucher = action.payload;
        }

        state.message = "Journal voucher updated successfully";
      })
      .addCase(updateJournalVoucher.rejected, (state, action) => {
        state.updateJournalVoucherStatus = API_STATUS.ERROR;
        state.error = action.payload || "Journal voucher update failed";
      })

      // POST JOURNAL VOUCHER
      .addCase(postJournalVoucher.pending, (state) => {
        state.postJournalVoucherStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(postJournalVoucher.fulfilled, (state, action) => {
        state.postJournalVoucherStatus = API_STATUS.SUCCESS;

        state.managedJournalVoucher = action.payload;

        state.journalVouchers = state.journalVouchers.map((voucher) =>
          voucher?._id === action.payload?._id ? action.payload : voucher,
        );

        state.message = "Journal voucher posted successfully";
      })
      .addCase(postJournalVoucher.rejected, (state, action) => {
        state.postJournalVoucherStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to post journal voucher";
      })

      // CANCEL JOURNAL VOUCHER
      .addCase(cancelJournalVoucher.pending, (state) => {
        state.cancelJournalVoucherStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(cancelJournalVoucher.fulfilled, (state, action) => {
        state.cancelJournalVoucherStatus = API_STATUS.SUCCESS;

        state.managedJournalVoucher = action.payload;

        state.journalVouchers = state.journalVouchers.map((voucher) =>
          voucher?._id === action.payload?._id ? action.payload : voucher,
        );

        state.message = "Journal voucher cancelled successfully";
      })
      .addCase(cancelJournalVoucher.rejected, (state, action) => {
        state.cancelJournalVoucherStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to cancel journal voucher";
      })

      // SUBMIT FOR APPROVAL
      .addCase(submitJournalVoucherApproval.pending, (state) => {
        state.submitJournalVoucherApprovalStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(submitJournalVoucherApproval.fulfilled, (state, action) => {
        state.submitJournalVoucherApprovalStatus = API_STATUS.SUCCESS;

        state.managedJournalVoucher = action.payload;

        state.journalVouchers = state.journalVouchers.map((voucher) =>
          voucher?._id === action.payload?._id ? action.payload : voucher,
        );

        state.message = "Journal voucher submitted for approval successfully";
      })
      .addCase(submitJournalVoucherApproval.rejected, (state, action) => {
        state.submitJournalVoucherApprovalStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to submit journal voucher";
      })

      // APPROVE JOURNAL VOUCHER
      .addCase(approveJournalVoucher.pending, (state) => {
        state.approveJournalVoucherStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(approveJournalVoucher.fulfilled, (state, action) => {
        state.approveJournalVoucherStatus = API_STATUS.SUCCESS;

        state.managedJournalVoucher = action.payload;

        state.journalVouchers = state.journalVouchers.map((voucher) =>
          voucher?._id === action.payload?._id ? action.payload : voucher,
        );

        state.message = "Journal voucher approved successfully";
      })
      .addCase(approveJournalVoucher.rejected, (state, action) => {
        state.approveJournalVoucherStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to approve journal voucher";
      })

      // REVERSE JOURNAL VOUCHER
      .addCase(reverseJournalVoucher.pending, (state) => {
        state.reverseJournalVoucherStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(reverseJournalVoucher.fulfilled, (state, action) => {
        state.reverseJournalVoucherStatus = API_STATUS.SUCCESS;

        state.managedJournalVoucher = action.payload;

        state.journalVouchers = state.journalVouchers.map((voucher) =>
          voucher?._id === action.payload?._id ? action.payload : voucher,
        );

        state.message = "Journal voucher reversed successfully";
      })
      .addCase(reverseJournalVoucher.rejected, (state, action) => {
        state.reverseJournalVoucherStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to reverse journal voucher";
      });
  },
});

export const {
  clearJournalVoucherError,
  clearJournalVoucherMessage,
  setCurrentJournalVoucher,
  clearCurrentJournalVoucher,
  clearJournalVouchers,
  clearManagedJournalVoucher,
} = journalVoucherSlice.actions;

export default journalVoucherSlice.reducer;
