// src/features/subscription/subscriptions/store/subscriptionSlice.js

import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  purchaseSubscription,
  renewSubscription,
  upgradeSubscription,
  scheduleDowngrade,
  changeSeatQuantity,
  cancelSubscription,
  getSubscriptions,
  getSubscriptionById,
  getWorkspaceCurrentSubscription,
  getWorkspaceSubscriptions,
  syncActiveSeatCount,
  validateSeatAvailability,
} from "./subscriptionThunk";

const initialState = {
  subscriptions: [],
  workspaceSubscriptions: [],

  currentSubscription: null,
  currentWorkspaceSubscription: null,

  seatAvailability: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  purchaseSubscriptionStatus: API_STATUS.IDLE,
  renewSubscriptionStatus: API_STATUS.IDLE,
  upgradeSubscriptionStatus: API_STATUS.IDLE,
  scheduleDowngradeStatus: API_STATUS.IDLE,
  changeSeatQuantityStatus: API_STATUS.IDLE,
  cancelSubscriptionStatus: API_STATUS.IDLE,

  syncActiveSeatCountStatus: API_STATUS.IDLE,
  validateSeatAvailabilityStatus: API_STATUS.IDLE,
};

const subscriptionSlice = createSlice({
  name: "subscription",

  initialState,

  reducers: {
    clearSubscriptionError(state) {
      state.error = null;
    },

    clearSubscriptionMessage(state) {
      state.message = null;
    },

    setCurrentSubscription(state, action) {
      state.currentSubscription = action.payload || null;
    },

    clearCurrentSubscription(state) {
      state.currentSubscription = null;
    },

    clearSubscriptions(state) {
      state.subscriptions = [];
    },

    clearWorkspaceSubscriptions(state) {
      state.workspaceSubscriptions = [];
    },

    clearSeatAvailability(state) {
      state.seatAvailability = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // PURCHASE SUBSCRIPTION
      .addCase(purchaseSubscription.pending, (state) => {
        state.purchaseSubscriptionStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(purchaseSubscription.fulfilled, (state, action) => {
        state.purchaseSubscriptionStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.subscriptions.unshift(action.payload);

          state.currentSubscription = action.payload;

          state.currentWorkspaceSubscription = action.payload;
        }

        state.message = "Subscription purchased successfully";
      })
      .addCase(purchaseSubscription.rejected, (state, action) => {
        state.purchaseSubscriptionStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to purchase subscription";
      })

      // RENEW SUBSCRIPTION
      .addCase(renewSubscription.pending, (state) => {
        state.renewSubscriptionStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(renewSubscription.fulfilled, (state, action) => {
        state.renewSubscriptionStatus = API_STATUS.SUCCESS;

        state.currentSubscription = action.payload;

        state.currentWorkspaceSubscription = action.payload;

        state.message = "Subscription renewed successfully";
      })
      .addCase(renewSubscription.rejected, (state, action) => {
        state.renewSubscriptionStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to renew subscription";
      })

      // UPGRADE SUBSCRIPTION
      .addCase(upgradeSubscription.pending, (state) => {
        state.upgradeSubscriptionStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(upgradeSubscription.fulfilled, (state, action) => {
        state.upgradeSubscriptionStatus = API_STATUS.SUCCESS;

        state.currentSubscription = action.payload;

        state.currentWorkspaceSubscription = action.payload;

        state.message = "Subscription upgraded successfully";
      })
      .addCase(upgradeSubscription.rejected, (state, action) => {
        state.upgradeSubscriptionStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to upgrade subscription";
      })

      // SCHEDULE DOWNGRADE
      .addCase(scheduleDowngrade.pending, (state) => {
        state.scheduleDowngradeStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(scheduleDowngrade.fulfilled, (state, action) => {
        state.scheduleDowngradeStatus = API_STATUS.SUCCESS;

        state.currentSubscription = action.payload;

        state.currentWorkspaceSubscription = action.payload;

        state.message = "Subscription downgrade scheduled";
      })
      .addCase(scheduleDowngrade.rejected, (state, action) => {
        state.scheduleDowngradeStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to schedule downgrade";
      })

      // CHANGE SEAT QUANTITY
      .addCase(changeSeatQuantity.pending, (state) => {
        state.changeSeatQuantityStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(changeSeatQuantity.fulfilled, (state, action) => {
        state.changeSeatQuantityStatus = API_STATUS.SUCCESS;

        state.currentSubscription = action.payload;

        state.currentWorkspaceSubscription = action.payload;

        state.message = "Seat quantity updated successfully";
      })
      .addCase(changeSeatQuantity.rejected, (state, action) => {
        state.changeSeatQuantityStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update seat quantity";
      })

      // CANCEL SUBSCRIPTION
      .addCase(cancelSubscription.pending, (state) => {
        state.cancelSubscriptionStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.cancelSubscriptionStatus = API_STATUS.SUCCESS;

        state.currentSubscription = action.payload;

        state.currentWorkspaceSubscription = action.payload;

        state.message = "Subscription cancelled successfully";
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.cancelSubscriptionStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to cancel subscription";
      })

      // GET SUBSCRIPTIONS
      .addCase(getSubscriptions.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getSubscriptions.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.subscriptions = action.payload || [];
      })
      .addCase(getSubscriptions.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch subscriptions";
      })

      // GET SUBSCRIPTION BY ID
      .addCase(getSubscriptionById.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getSubscriptionById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.currentSubscription = action.payload || null;
      })
      .addCase(getSubscriptionById.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch subscription";
      })

      // GET WORKSPACE CURRENT SUBSCRIPTION
      .addCase(getWorkspaceCurrentSubscription.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceCurrentSubscription.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;

        state.currentWorkspaceSubscription = action.payload || null;
      })
      .addCase(getWorkspaceCurrentSubscription.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error =
          action.payload || "Failed to fetch workspace subscription";
      })

      // GET WORKSPACE SUBSCRIPTIONS
      .addCase(getWorkspaceSubscriptions.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceSubscriptions.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;

        state.workspaceSubscriptions = action.payload || [];
      })
      .addCase(getWorkspaceSubscriptions.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error =
          action.payload || "Failed to fetch workspace subscriptions";
      })

      // SYNC ACTIVE SEAT COUNT
      .addCase(syncActiveSeatCount.pending, (state) => {
        state.syncActiveSeatCountStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(syncActiveSeatCount.fulfilled, (state, action) => {
        state.syncActiveSeatCountStatus = API_STATUS.SUCCESS;

        state.currentSubscription = action.payload;

        state.currentWorkspaceSubscription = action.payload;

        state.message = "Active seat count synced successfully";
      })
      .addCase(syncActiveSeatCount.rejected, (state, action) => {
        state.syncActiveSeatCountStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to sync active seat count";
      })

      // VALIDATE SEAT AVAILABILITY
      .addCase(validateSeatAvailability.pending, (state) => {
        state.validateSeatAvailabilityStatus = API_STATUS.LOADING;

        state.error = null;
      })
      .addCase(validateSeatAvailability.fulfilled, (state, action) => {
        state.validateSeatAvailabilityStatus = API_STATUS.SUCCESS;

        state.seatAvailability = action.payload || null;
      })
      .addCase(validateSeatAvailability.rejected, (state, action) => {
        state.validateSeatAvailabilityStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to validate seat availability";
      });
  },
});

export const {
  clearSubscriptionError,
  clearSubscriptionMessage,
  setCurrentSubscription,
  clearCurrentSubscription,
  clearSubscriptions,
  clearWorkspaceSubscriptions,
  clearSeatAvailability,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
