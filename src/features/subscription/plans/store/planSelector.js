export const selectPlan = (state) => state.plan;

export const selectPlans = (state) => state.plan.plans;

export const selectActivePlans = (state) => state.plan.activePlans;

export const selectCurrentPlan = (state) => state.plan.currentPlan;

export const selectPlanStatus = (state) => state.plan.status;

export const selectPlanError = (state) => state.plan.error;

export const selectPlanMessage = (state) => state.plan.message;

export const selectCreatePlanStatus = (state) => state.plan.createPlanStatus;

export const selectGetActivePlansStatus = (state) =>
  state.plan.getActivePlansStatus;

export const selectUpdatePlanStatus = (state) => state.plan.updatePlanStatus;

export const selectDeletePlanStatus = (state) => state.plan.deletePlanStatus;
