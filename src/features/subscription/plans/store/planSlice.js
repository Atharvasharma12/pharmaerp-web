import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getPlans,
  getActivePlans,
  getPlanById,
  createPlan,
  updatePlan,
  archivePlan,
  restorePlan,
  deletePlan,
} from "./planThunk";

const initialState = {
  plans: [],
  activePlans: [],
  currentPlan: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getActivePlansStatus: API_STATUS.IDLE,

  // Admin write statuses
  createPlanStatus: API_STATUS.IDLE,
  updatePlanStatus: API_STATUS.IDLE,
  archivePlanStatus: API_STATUS.IDLE,
  restorePlanStatus: API_STATUS.IDLE,
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

      // CREATE PLAN
      .addCase(createPlan.pending, (state) => {
        state.createPlanStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.createPlanStatus = API_STATUS.SUCCESS;
        if (action.payload) {
          state.plans.push(action.payload);
        }
        state.message = "Plan created successfully";
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.createPlanStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create plan";
      })

      // UPDATE PLAN
      .addCase(updatePlan.pending, (state) => {
        state.updatePlanStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.updatePlanStatus = API_STATUS.SUCCESS;
        if (action.payload) {
          state.plans = state.plans.map((p) =>
            p._id === action.payload._id ? action.payload : p,
          );
          state.activePlans = state.activePlans.map((p) =>
            p._id === action.payload._id ? action.payload : p,
          );
          if (state.currentPlan?._id === action.payload._id) {
            state.currentPlan = action.payload;
          }
        }
        state.message = "Plan updated successfully";
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.updatePlanStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update plan";
      })

      // ARCHIVE PLAN
      .addCase(archivePlan.pending, (state) => {
        state.archivePlanStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(archivePlan.fulfilled, (state, action) => {
        state.archivePlanStatus = API_STATUS.SUCCESS;
        if (action.payload) {
          state.plans = state.plans.map((p) =>
            p._id === action.payload._id ? action.payload : p,
          );
          // Remove from activePlans since it's archived
          state.activePlans = state.activePlans.filter(
            (p) => p._id !== action.payload._id,
          );
        }
        state.message = "Plan archived successfully";
      })
      .addCase(archivePlan.rejected, (state, action) => {
        state.archivePlanStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to archive plan";
      })

      // RESTORE PLAN
      .addCase(restorePlan.pending, (state) => {
        state.restorePlanStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(restorePlan.fulfilled, (state, action) => {
        state.restorePlanStatus = API_STATUS.SUCCESS;
        if (action.payload) {
          state.plans = state.plans.map((p) =>
            p._id === action.payload._id ? action.payload : p,
          );
          // Add back to activePlans
          const alreadyActive = state.activePlans.find(
            (p) => p._id === action.payload._id,
          );
          if (!alreadyActive) {
            state.activePlans.push(action.payload);
          }
        }
        state.message = "Plan restored successfully";
      })
      .addCase(restorePlan.rejected, (state, action) => {
        state.restorePlanStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to restore plan";
      })

      // DELETE PLAN
      .addCase(deletePlan.pending, (state) => {
        state.deletePlanStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.deletePlanStatus = API_STATUS.SUCCESS;
        const deletedId = action.payload;
        state.plans = state.plans.filter((p) => p._id !== deletedId);
        state.activePlans = state.activePlans.filter((p) => p._id !== deletedId);
        if (state.currentPlan?._id === deletedId) {
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
