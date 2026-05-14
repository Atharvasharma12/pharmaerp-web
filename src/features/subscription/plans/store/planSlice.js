import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import { getPlans, getActivePlans, getPlanById } from "./planThunk";

const initialState = {
  plans: [],
  activePlans: [],
  currentPlan: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getActivePlansStatus: API_STATUS.IDLE,
};

const planSlice = createSlice({
  name: "plan",

  initialState,

  reducers: {
    clearPlanError(state) {
      state.error = null;
    },

    clearPlanMessage(state) {
      state.message = null;
    },

    setCurrentPlan(state, action) {
      state.currentPlan = action.payload || null;
    },

    clearCurrentPlan(state) {
      state.currentPlan = null;
    },

    clearPlans(state) {
      state.plans = [];
    },

    clearActivePlans(state) {
      state.activePlans = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // GET PLANS
      .addCase(getPlans.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.plans = action.payload || [];
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch plans";
      })

      // GET ACTIVE PLANS
      .addCase(getActivePlans.pending, (state) => {
        state.getActivePlansStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getActivePlans.fulfilled, (state, action) => {
        state.getActivePlansStatus = API_STATUS.SUCCESS;
        state.activePlans = action.payload || [];
      })
      .addCase(getActivePlans.rejected, (state, action) => {
        state.getActivePlansStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch active plans";
      })

      // GET PLAN BY ID
      .addCase(getPlanById.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getPlanById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.currentPlan = action.payload || null;
      })
      .addCase(getPlanById.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch plan";
      });
  },
});

export const {
  clearPlanError,
  clearPlanMessage,
  setCurrentPlan,
  clearCurrentPlan,
  clearPlans,
  clearActivePlans,
} = planSlice.actions;

export default planSlice.reducer;
