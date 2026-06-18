import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/store/authSlice";
import userReducer from "@/features/user/store/userSlice";

import workspaceReducer from "@/features/workspace/store/workspaceSlice";
import companyReducer from "@/features/company/store/companySlice";
import branchReducer from "@/features/branch/store/branchSlice";

import accessControlReducer from "@/features/access-control/store/accessControlSlice";

import planReducer from "@/features/subscription/plans/store/planSlice";
import subscriptionReducer from "@/features/subscription/subscriptions/store/subscriptionSlice";

// Catalog
import workspaceProductReducer from "@/features/workspace-products/store/workspaceProductSlice";
import globalProductReducer from "@/features/global-products/store/globalProductSlice";
import hsnMasterReducer from "@/features/hsn-master/store/hsnMasterSlice";
import manufacturerMasterReducer from "@/features/manufacturer-master/store/manufacturerMasterSlice";
import uomMasterReducer from "@/features/uom-master/store/uomMasterSlice";
import categoryMasterReducer from "@/features/category-master/store/categoryMasterSlice";
import productFormMasterReducer from "@/features/product-form-master/store/productFormMasterSlice";
// ---------------------
// App Reducer
// ---------------------

const appReducer = combineReducers({
  // Core
  auth: authReducer,
  user: userReducer,

  // Organization
  workspace: workspaceReducer,
  company: companyReducer,
  branch: branchReducer,

  // Access Control
  accessControl: accessControlReducer,

  // Subscription
  plan: planReducer,
  subscription: subscriptionReducer,

  // Catalog
  workspaceProduct: workspaceProductReducer,
  globalProduct: globalProductReducer,
  hsnMaster: hsnMasterReducer,
  manufacturerMaster: manufacturerMasterReducer,
  uomMaster: uomMasterReducer,
  categoryMaster: categoryMasterReducer,
  productFormMaster: productFormMasterReducer,
});

/**
 * Root Reducer Wrapper
 *
 * Intercepts global actions.
 * When logout succeeds,
 * resetting state to undefined
 * causes every slice to return
 * to its initial state.
 */
const rootReducer = (state, action) => {
  if (action.type === "auth/logout/fulfilled") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
