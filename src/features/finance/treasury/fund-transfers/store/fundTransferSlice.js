import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createFundTransfer,
  getFundTransfers,
  getFundTransferById,
  cancelFundTransfer,
} from "./fundTransferThunk";

const initialState = {
  fundTransfers: [],
  currentFundTransfer: null,
  managedFundTransfer: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createFundTransferStatus: API_STATUS.IDLE,
  getFundTransfersStatus: API_STATUS.IDLE,
  getFundTransferStatus: API_STATUS.IDLE,
  cancelFundTransferStatus: API_STATUS.IDLE,
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

const fundTransferSlice = createSlice({
  name: "fundTransfer",

  initialState,

  reducers: {
    clearFundTransferError(state) {
      state.error = null;
    },

    clearFundTransferMessage(state) {
      state.message = null;
    },

    setCurrentFundTransfer(state, action) {
      state.currentFundTransfer = action.payload || null;
    },

    clearCurrentFundTransfer(state) {
      state.currentFundTransfer = null;
    },

    clearFundTransfers(state) {
      state.fundTransfers = [];
    },

    clearManagedFundTransfer(state) {
      state.managedFundTransfer = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE FUND TRANSFER
      .addCase(createFundTransfer.pending, (state) => {
        state.createFundTransferStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createFundTransfer.fulfilled, (state, action) => {
        state.createFundTransferStatus = API_STATUS.SUCCESS;

        state.currentFundTransfer = action.payload || null;

        if (action.payload) {
          state.fundTransfers.unshift(action.payload);
        }

        state.message = "Fund transfer created successfully";
      })
      .addCase(createFundTransfer.rejected, (state, action) => {
        state.createFundTransferStatus = API_STATUS.ERROR;
        state.error = action.payload || "Fund transfer creation failed";
      })

      // GET FUND TRANSFERS
      .addCase(getFundTransfers.pending, (state) => {
        state.getFundTransfersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getFundTransfers.fulfilled, (state, action) => {
        state.getFundTransfersStatus = API_STATUS.SUCCESS;

        state.fundTransfers = action.payload?.fundTransfers || [];

        state.message = "Fund transfers fetched successfully";
      })
      .addCase(getFundTransfers.rejected, (state, action) => {
        state.getFundTransfersStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch fund transfers";
      })

      // GET FUND TRANSFER BY ID
      .addCase(getFundTransferById.pending, setPending)
      .addCase(getFundTransferById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getFundTransferStatus = API_STATUS.SUCCESS;

        state.managedFundTransfer = action.payload || null;

        state.message = "Fund transfer fetched successfully";
      })
      .addCase(getFundTransferById.rejected, (state, action) => {
        setRejected(state, action);
        state.getFundTransferStatus = API_STATUS.ERROR;
      })

      // CANCEL FUND TRANSFER
      .addCase(cancelFundTransfer.pending, (state) => {
        state.cancelFundTransferStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(cancelFundTransfer.fulfilled, (state, action) => {
        state.cancelFundTransferStatus = API_STATUS.SUCCESS;

        state.fundTransfers = state.fundTransfers.map((fundTransfer) =>
          fundTransfer?._id === action.payload?._id
            ? action.payload
            : fundTransfer,
        );

        state.managedFundTransfer = action.payload || state.managedFundTransfer;

        if (
          state.currentFundTransfer?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentFundTransfer = action.payload;
        }

        state.message = "Fund transfer cancelled successfully";
      })
      .addCase(cancelFundTransfer.rejected, (state, action) => {
        state.cancelFundTransferStatus = API_STATUS.ERROR;
        state.error = action.payload || "Fund transfer cancellation failed";
      });
  },
});

export const {
  clearFundTransferError,
  clearFundTransferMessage,
  setCurrentFundTransfer,
  clearCurrentFundTransfer,
  clearFundTransfers,
  clearManagedFundTransfer,
} = fundTransferSlice.actions;

export default fundTransferSlice.reducer;
