// src/store/rootReducer.js

import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/store/authSlice";

import userReducer from "@/features/user/store/userSlice";

import workspaceReducer from "@/features/workspace/store/workspaceSlice";

import planReducer from "@/features/subscription/plans/store/planSlice";

import subscriptionReducer from "@/features/subscription/subscriptions/store/subscriptionSlice";

const rootReducer = combineReducers({
  auth: authReducer,

  user: userReducer,

  workspace: workspaceReducer,

  plan: planReducer,

  subscription: subscriptionReducer,
});

export default rootReducer;
