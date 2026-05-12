import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createPlan,
  getPlans,
  getActivePlans,
  getPlanById,
  updatePlan,
  deletePlan,
} from "./planThunk";

const initialState = {
  plans: [],
  activePlans: [],
  currentPlan: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createPlanStatus: API_STATUS.IDLE,
  getActivePlansStatus: API_STATUS.IDLE,
  updatePlanStatus: API_STATUS.IDLE,
  deletePlanStatus: API_STATUS.IDLE,
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
      // CREATE PLAN
      .addCase(createPlan.pending, (state) => {
        state.createPlanStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.createPlanStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.plans.unshift(action.payload);

          if (action.payload.status === "active") {
            state.activePlans.unshift(action.payload);
          }
        }

        state.message = "Plan created successfully";
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.createPlanStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create plan";
      })

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
      })

      // UPDATE PLAN
      .addCase(updatePlan.pending, (state) => {
        state.updatePlanStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.updatePlanStatus = API_STATUS.SUCCESS;

        const updatedPlan = action.payload;

        state.plans = state.plans.map((plan) =>
          plan._id === updatedPlan._id ? updatedPlan : plan,
        );

        state.activePlans = state.activePlans
          .map((plan) => (plan._id === updatedPlan._id ? updatedPlan : plan))
          .filter((plan) => plan.status === "active");

        if (updatedPlan.status === "active") {
          const existsInActivePlans = state.activePlans.some(
            (plan) => plan._id === updatedPlan._id,
          );

          if (!existsInActivePlans) {
            state.activePlans.unshift(updatedPlan);
          }
        }

        if (state.currentPlan?._id === updatedPlan._id) {
          state.currentPlan = updatedPlan;
        }

        state.message = "Plan updated successfully";
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.updatePlanStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update plan";
      })

      // DELETE PLAN
      .addCase(deletePlan.pending, (state) => {
        state.deletePlanStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.deletePlanStatus = API_STATUS.SUCCESS;

        state.plans = state.plans.filter((plan) => plan._id !== action.payload);

        state.activePlans = state.activePlans.filter(
          (plan) => plan._id !== action.payload,
        );

        if (state.currentPlan?._id === action.payload) {
          state.currentPlan = null;
        }

        state.message = "Plan deleted successfully";
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.deletePlanStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to delete plan";
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
