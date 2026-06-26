export const selectFinancialPeriod = (state) => state.financialPeriod;

export const selectFinancialPeriods = (state) =>
  state.financialPeriod.financialPeriods;

export const selectCurrentFinancialPeriod = (state) =>
  state.financialPeriod.currentFinancialPeriod;

// Used for details/current period
export const selectManagedFinancialPeriod = (state) =>
  state.financialPeriod.managedFinancialPeriod;

export const selectFinancialPeriodStatus = (state) =>
  state.financialPeriod.status;

export const selectFinancialPeriodError = (state) =>
  state.financialPeriod.error;

export const selectFinancialPeriodMessage = (state) =>
  state.financialPeriod.message;

export const selectCreateFinancialPeriodStatus = (state) =>
  state.financialPeriod.createFinancialPeriodStatus;

export const selectGetFinancialPeriodsStatus = (state) =>
  state.financialPeriod.getFinancialPeriodsStatus;

export const selectGetCurrentFinancialPeriodStatus = (state) =>
  state.financialPeriod.getCurrentFinancialPeriodStatus;

export const selectUpdateFinancialPeriodStatusStatus = (state) =>
  state.financialPeriod.updateFinancialPeriodStatusStatus;
