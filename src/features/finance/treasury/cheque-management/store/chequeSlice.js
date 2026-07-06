import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createCheque,
  getCheques,
  getChequeById,
  depositCheque,
  clearCheque,
  bounceCheque,
  cancelCheque,
} from "./chequeThunk";

const initialState = {
  cheques: [],
  currentCheque: null,
  managedCheque: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createChequeStatus: API_STATUS.IDLE,
  getChequesStatus: API_STATUS.IDLE,
  getChequeStatus: API_STATUS.IDLE,
  depositChequeStatus: API_STATUS.IDLE,
  clearChequeStatus: API_STATUS.IDLE,
  bounceChequeStatus: API_STATUS.IDLE,
  cancelChequeStatus: API_STATUS.IDLE,
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

const chequeSlice = createSlice({
  name: "cheque",

  initialState,

  reducers: {
    clearChequeError(state) {
      state.error = null;
    },

    clearChequeMessage(state) {
      state.message = null;
    },

    setCurrentCheque(state, action) {
      state.currentCheque = action.payload || null;
    },

    clearCurrentCheque(state) {
      state.currentCheque = null;
    },

    clearCheques(state) {
      state.cheques = [];
    },

    clearManagedCheque(state) {
      state.managedCheque = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE CHEQUE
      .addCase(createCheque.pending, (state) => {
        state.createChequeStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createCheque.fulfilled, (state, action) => {
        state.createChequeStatus = API_STATUS.SUCCESS;

        state.currentCheque = action.payload || null;

        if (action.payload) {
          state.cheques.unshift(action.payload);
        }

        state.message = "Cheque created successfully";
      })
      .addCase(createCheque.rejected, (state, action) => {
        state.createChequeStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cheque creation failed";
      })

      // GET CHEQUES
      .addCase(getCheques.pending, (state) => {
        state.getChequesStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getCheques.fulfilled, (state, action) => {
        state.getChequesStatus = API_STATUS.SUCCESS;

        state.cheques = action.payload?.cheques || [];
      })
      .addCase(getCheques.rejected, (state, action) => {
        state.getChequesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch cheques";
      })

      // GET CHEQUE BY ID
      .addCase(getChequeById.pending, setPending)
      .addCase(getChequeById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getChequeStatus = API_STATUS.SUCCESS;

        state.managedCheque = action.payload || null;

        state.message = "Cheque fetched successfully";
      })
      .addCase(getChequeById.rejected, (state, action) => {
        setRejected(state, action);
        state.getChequeStatus = API_STATUS.ERROR;
      })

      // DEPOSIT CHEQUE
      .addCase(depositCheque.pending, (state) => {
        state.depositChequeStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(depositCheque.fulfilled, (state, action) => {
        state.depositChequeStatus = API_STATUS.SUCCESS;

        state.cheques = state.cheques.map((cheque) =>
          cheque?._id === action.payload?._id ? action.payload : cheque,
        );

        state.managedCheque = action.payload || state.managedCheque;

        if (
          state.currentCheque?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCheque = action.payload;
        }

        state.message = "Cheque deposited successfully";
      })
      .addCase(depositCheque.rejected, (state, action) => {
        state.depositChequeStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cheque deposit failed";
      })

      // CLEAR CHEQUE
      .addCase(clearCheque.pending, (state) => {
        state.clearChequeStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(clearCheque.fulfilled, (state, action) => {
        state.clearChequeStatus = API_STATUS.SUCCESS;

        state.cheques = state.cheques.map((cheque) =>
          cheque?._id === action.payload?._id ? action.payload : cheque,
        );

        state.managedCheque = action.payload || state.managedCheque;

        if (
          state.currentCheque?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCheque = action.payload;
        }

        state.message = "Cheque cleared successfully";
      })
      .addCase(clearCheque.rejected, (state, action) => {
        state.clearChequeStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cheque clearance failed";
      })

      // BOUNCE CHEQUE
      .addCase(bounceCheque.pending, (state) => {
        state.bounceChequeStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(bounceCheque.fulfilled, (state, action) => {
        state.bounceChequeStatus = API_STATUS.SUCCESS;

        state.cheques = state.cheques.map((cheque) =>
          cheque?._id === action.payload?._id ? action.payload : cheque,
        );

        state.managedCheque = action.payload || state.managedCheque;

        if (
          state.currentCheque?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCheque = action.payload;
        }

        state.message = "Cheque marked as bounced successfully";
      })
      .addCase(bounceCheque.rejected, (state, action) => {
        state.bounceChequeStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cheque bounce failed";
      })

      // CANCEL CHEQUE
      .addCase(cancelCheque.pending, (state) => {
        state.cancelChequeStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(cancelCheque.fulfilled, (state, action) => {
        state.cancelChequeStatus = API_STATUS.SUCCESS;

        state.cheques = state.cheques.map((cheque) =>
          cheque?._id === action.payload?._id ? action.payload : cheque,
        );

        state.managedCheque = action.payload || state.managedCheque;

        if (
          state.currentCheque?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCheque = action.payload;
        }

        state.message = "Cheque cancelled successfully";
      })
      .addCase(cancelCheque.rejected, (state, action) => {
        state.cancelChequeStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cheque cancellation failed";
      });
  },
});

export const {
  clearChequeError,
  clearChequeMessage,
  setCurrentCheque,
  clearCurrentCheque,
  clearCheques,
  clearManagedCheque,
} = chequeSlice.actions;

export default chequeSlice.reducer;
