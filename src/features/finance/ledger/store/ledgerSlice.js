import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import { getLedger, recalculateLedger } from "./ledgerThunk";

const initialState = {
  ledgerEntries: [],

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getLedgerStatus: API_STATUS.IDLE,
  recalculateLedgerStatus: API_STATUS.IDLE,
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

const ledgerSlice = createSlice({
  name: "ledger",

  initialState,

  reducers: {
    clearLedgerError(state) {
      state.error = null;
    },

    clearLedgerMessage(state) {
      state.message = null;
    },

    clearLedgerEntries(state) {
      state.ledgerEntries = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // GET LEDGER
      .addCase(getLedger.pending, setPending)
      .addCase(getLedger.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getLedgerStatus = API_STATUS.SUCCESS;

        state.ledgerEntries = action.payload?.entries || [];
      })
      .addCase(getLedger.rejected, (state, action) => {
        setRejected(state, action);
        state.getLedgerStatus = API_STATUS.ERROR;
      })

      // RECALCULATE LEDGER
      .addCase(recalculateLedger.pending, (state) => {
        state.recalculateLedgerStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(recalculateLedger.fulfilled, (state) => {
        state.recalculateLedgerStatus = API_STATUS.SUCCESS;

        state.message = "Ledger recalculated successfully";
      })
      .addCase(recalculateLedger.rejected, (state, action) => {
        state.recalculateLedgerStatus = API_STATUS.ERROR;

        state.error = action.payload || "Ledger recalculation failed";
      });
  },
});

export const { clearLedgerError, clearLedgerMessage, clearLedgerEntries } =
  ledgerSlice.actions;

export default ledgerSlice.reducer;
