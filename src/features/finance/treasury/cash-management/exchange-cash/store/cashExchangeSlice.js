import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createCashExchange,
  getCashExchanges,
  getCashExchangeById,
} from "./cashExchangeThunk";

const initialState = {
  cashExchanges: [],
  currentCashExchange: null,
  managedCashExchange: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createCashExchangeStatus: API_STATUS.IDLE,
  getCashExchangesStatus: API_STATUS.IDLE,
  getCashExchangeStatus: API_STATUS.IDLE,
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

const cashExchangeSlice = createSlice({
  name: "cashExchange",

  initialState,

  reducers: {
    clearCashExchangeError(state) {
      state.error = null;
    },

    clearCashExchangeMessage(state) {
      state.message = null;
    },

    setCurrentCashExchange(state, action) {
      state.currentCashExchange = action.payload || null;
    },

    clearCurrentCashExchange(state) {
      state.currentCashExchange = null;
    },

    clearCashExchanges(state) {
      state.cashExchanges = [];
    },

    clearManagedCashExchange(state) {
      state.managedCashExchange = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE CASH EXCHANGE
      .addCase(createCashExchange.pending, (state) => {
        state.createCashExchangeStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createCashExchange.fulfilled, (state, action) => {
        state.createCashExchangeStatus = API_STATUS.SUCCESS;
        state.currentCashExchange = action.payload || null;
        if (action.payload) {
          state.cashExchanges.unshift(action.payload);
        }
        state.message = "Cash exchange completed successfully";
      })
      .addCase(createCashExchange.rejected, (state, action) => {
        state.createCashExchangeStatus = API_STATUS.ERROR;
        state.error = action.payload || "Cash exchange creation failed";
      })

      // GET CASH EXCHANGES
      .addCase(getCashExchanges.pending, (state) => {
        state.getCashExchangesStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getCashExchanges.fulfilled, (state, action) => {
        state.getCashExchangesStatus = API_STATUS.SUCCESS;
        state.cashExchanges = action.payload?.cashExchanges || [];
      })
      .addCase(getCashExchanges.rejected, (state, action) => {
        state.getCashExchangesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch cash exchanges";
      })

      // GET CASH EXCHANGE BY ID
      .addCase(getCashExchangeById.pending, setPending)
      .addCase(getCashExchangeById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getCashExchangeStatus = API_STATUS.SUCCESS;
        state.managedCashExchange = action.payload || null;
        state.message = "Cash exchange fetched successfully";
      })
      .addCase(getCashExchangeById.rejected, (state, action) => {
        setRejected(state, action);
        state.getCashExchangeStatus = API_STATUS.ERROR;
      })


  },
});

export const {
  clearCashExchangeError,
  clearCashExchangeMessage,
  setCurrentCashExchange,
  clearCurrentCashExchange,
  clearCashExchanges,
  clearManagedCashExchange,
} = cashExchangeSlice.actions;

export default cashExchangeSlice.reducer;
