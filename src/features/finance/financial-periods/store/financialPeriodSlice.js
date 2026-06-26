import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createFinancialPeriod,
  getFinancialPeriods,
  getCurrentFinancialPeriod,
  updateFinancialPeriodStatus,
} from "./financialPeriodThunk";

const initialState = {
  financialPeriods: [],
  currentFinancialPeriod: null,
  managedFinancialPeriod: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createFinancialPeriodStatus: API_STATUS.IDLE,
  getFinancialPeriodsStatus: API_STATUS.IDLE,
  getCurrentFinancialPeriodStatus: API_STATUS.IDLE,
  updateFinancialPeriodStatusStatus: API_STATUS.IDLE,
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

const financialPeriodSlice = createSlice({
  name: "financialPeriod",

  initialState,

  reducers: {
    clearFinancialPeriodError(state) {
      state.error = null;
    },

    clearFinancialPeriodMessage(state) {
      state.message = null;
    },

    setCurrentFinancialPeriod(state, action) {
      state.currentFinancialPeriod = action.payload || null;
    },

    clearCurrentFinancialPeriod(state) {
      state.currentFinancialPeriod = null;
    },

    clearFinancialPeriods(state) {
      state.financialPeriods = [];
    },

    clearManagedFinancialPeriod(state) {
      state.managedFinancialPeriod = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE FINANCIAL PERIOD
      .addCase(createFinancialPeriod.pending, (state) => {
        state.createFinancialPeriodStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createFinancialPeriod.fulfilled, (state, action) => {
        state.createFinancialPeriodStatus = API_STATUS.SUCCESS;

        state.currentFinancialPeriod = action.payload || null;

        if (action.payload) {
          state.financialPeriods.unshift(action.payload);
        }

        state.message = "Financial period created successfully";
      })
      .addCase(createFinancialPeriod.rejected, (state, action) => {
        state.createFinancialPeriodStatus = API_STATUS.ERROR;
        state.error = action.payload || "Financial period creation failed";
      })

      // GET FINANCIAL PERIODS
      .addCase(getFinancialPeriods.pending, (state) => {
        state.getFinancialPeriodsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getFinancialPeriods.fulfilled, (state, action) => {
        state.getFinancialPeriodsStatus = API_STATUS.SUCCESS;

        state.financialPeriods = action.payload?.periods || [];

        state.message = "Financial periods fetched successfully";
      })
      .addCase(getFinancialPeriods.rejected, (state, action) => {
        state.getFinancialPeriodsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch financial periods";
      })

      // GET CURRENT FINANCIAL PERIOD
      .addCase(getCurrentFinancialPeriod.pending, setPending)
      .addCase(getCurrentFinancialPeriod.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getCurrentFinancialPeriodStatus = API_STATUS.SUCCESS;

        state.managedFinancialPeriod = action.payload || null;
        state.currentFinancialPeriod = action.payload || null;

        state.message = "Current financial period fetched successfully";
      })
      .addCase(getCurrentFinancialPeriod.rejected, (state, action) => {
        setRejected(state, action);
        state.getCurrentFinancialPeriodStatus = API_STATUS.ERROR;
      })

      // UPDATE FINANCIAL PERIOD STATUS
      .addCase(updateFinancialPeriodStatus.pending, (state) => {
        state.updateFinancialPeriodStatusStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateFinancialPeriodStatus.fulfilled, (state, action) => {
        state.updateFinancialPeriodStatusStatus = API_STATUS.SUCCESS;

        state.financialPeriods = state.financialPeriods.map((period) =>
          period?._id === action.payload?._id ? action.payload : period,
        );

        state.managedFinancialPeriod =
          action.payload || state.managedFinancialPeriod;

        if (
          state.currentFinancialPeriod?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentFinancialPeriod = action.payload;
        }

        state.message = "Financial period updated successfully";
      })
      .addCase(updateFinancialPeriodStatus.rejected, (state, action) => {
        state.updateFinancialPeriodStatusStatus = API_STATUS.ERROR;
        state.error = action.payload || "Financial period update failed";
      });
  },
});

export const {
  clearFinancialPeriodError,
  clearFinancialPeriodMessage,
  setCurrentFinancialPeriod,
  clearCurrentFinancialPeriod,
  clearFinancialPeriods,
  clearManagedFinancialPeriod,
} = financialPeriodSlice.actions;

export default financialPeriodSlice.reducer;
