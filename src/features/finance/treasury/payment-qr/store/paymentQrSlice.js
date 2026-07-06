import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createPaymentQr,
  getPaymentQrs,
  getPaymentQrById,
  updatePaymentQr,
  deletePaymentQr,
  setPrimaryPaymentQr,
} from "./paymentQrThunk";

const initialState = {
  paymentQrs: [],
  currentPaymentQr: null,
  managedPaymentQr: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createPaymentQrStatus: API_STATUS.IDLE,
  getPaymentQrsStatus: API_STATUS.IDLE,
  getPaymentQrStatus: API_STATUS.IDLE,
  updatePaymentQrStatus: API_STATUS.IDLE,
  deletePaymentQrStatus: API_STATUS.IDLE,
  setPrimaryPaymentQrStatus: API_STATUS.IDLE,
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

const paymentQrSlice = createSlice({
  name: "paymentQr",

  initialState,

  reducers: {
    clearPaymentQrError(state) {
      state.error = null;
    },

    clearPaymentQrMessage(state) {
      state.message = null;
    },

    setCurrentPaymentQr(state, action) {
      state.currentPaymentQr = action.payload || null;
    },

    clearCurrentPaymentQr(state) {
      state.currentPaymentQr = null;
    },

    clearPaymentQrs(state) {
      state.paymentQrs = [];
    },

    clearManagedPaymentQr(state) {
      state.managedPaymentQr = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE PAYMENT QR
      .addCase(createPaymentQr.pending, (state) => {
        state.createPaymentQrStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createPaymentQr.fulfilled, (state, action) => {
        state.createPaymentQrStatus = API_STATUS.SUCCESS;

        state.currentPaymentQr = action.payload || null;

        if (action.payload) {
          state.paymentQrs.unshift(action.payload);
        }

        state.message = "Payment QR created successfully";
      })
      .addCase(createPaymentQr.rejected, (state, action) => {
        state.createPaymentQrStatus = API_STATUS.ERROR;
        state.error = action.payload || "Payment QR creation failed";
      })

      // GET PAYMENT QRS
      .addCase(getPaymentQrs.pending, (state) => {
        state.getPaymentQrsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getPaymentQrs.fulfilled, (state, action) => {
        state.getPaymentQrsStatus = API_STATUS.SUCCESS;

        state.paymentQrs = action.payload?.paymentQrs || [];
      })
      .addCase(getPaymentQrs.rejected, (state, action) => {
        state.getPaymentQrsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch Payment QRs";
      })

      // GET PAYMENT QR BY ID
      .addCase(getPaymentQrById.pending, setPending)
      .addCase(getPaymentQrById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getPaymentQrStatus = API_STATUS.SUCCESS;

        state.managedPaymentQr = action.payload || null;

        state.message = "Payment QR fetched successfully";
      })
      .addCase(getPaymentQrById.rejected, (state, action) => {
        setRejected(state, action);
        state.getPaymentQrStatus = API_STATUS.ERROR;
      })

      // UPDATE PAYMENT QR
      .addCase(updatePaymentQr.pending, (state) => {
        state.updatePaymentQrStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updatePaymentQr.fulfilled, (state, action) => {
        state.updatePaymentQrStatus = API_STATUS.SUCCESS;

        state.paymentQrs = state.paymentQrs.map((paymentQr) =>
          paymentQr?._id === action.payload?._id ? action.payload : paymentQr,
        );

        state.managedPaymentQr = action.payload || state.managedPaymentQr;

        if (
          state.currentPaymentQr?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentPaymentQr = action.payload;
        }

        state.message = "Payment QR updated successfully";
      })
      .addCase(updatePaymentQr.rejected, (state, action) => {
        state.updatePaymentQrStatus = API_STATUS.ERROR;
        state.error = action.payload || "Payment QR update failed";
      })

      // DELETE PAYMENT QR
      .addCase(deletePaymentQr.pending, (state) => {
        state.deletePaymentQrStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deletePaymentQr.fulfilled, (state, action) => {
        state.deletePaymentQrStatus = API_STATUS.SUCCESS;

        state.paymentQrs = state.paymentQrs.filter(
          (paymentQr) => paymentQr?._id !== action.meta.arg,
        );

        if (state.managedPaymentQr?._id === action.meta.arg) {
          state.managedPaymentQr = null;
        }

        if (state.currentPaymentQr?._id === action.meta.arg) {
          state.currentPaymentQr = null;
        }

        state.message = "Payment QR deleted successfully";
      })
      .addCase(deletePaymentQr.rejected, (state, action) => {
        state.deletePaymentQrStatus = API_STATUS.ERROR;
        state.error = action.payload || "Payment QR delete failed";
      })

      // SET PRIMARY PAYMENT QR
      .addCase(setPrimaryPaymentQr.pending, (state) => {
        state.setPrimaryPaymentQrStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(setPrimaryPaymentQr.fulfilled, (state, action) => {
        state.setPrimaryPaymentQrStatus = API_STATUS.SUCCESS;

        state.paymentQrs = state.paymentQrs.map((paymentQr) => ({
          ...paymentQr,
          isPrimary: paymentQr._id === action.payload?._id,
        }));

        if (state.managedPaymentQr) {
          state.managedPaymentQr = action.payload;
        }

        if (state.currentPaymentQr?._id === action.payload?._id) {
          state.currentPaymentQr = action.payload;
        }

        state.message = "Primary Payment QR updated successfully";
      })
      .addCase(setPrimaryPaymentQr.rejected, (state, action) => {
        state.setPrimaryPaymentQrStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to set primary Payment QR";
      });
  },
});

export const {
  clearPaymentQrError,
  clearPaymentQrMessage,
  setCurrentPaymentQr,
  clearCurrentPaymentQr,
  clearPaymentQrs,
  clearManagedPaymentQr,
} = paymentQrSlice.actions;

export default paymentQrSlice.reducer;
