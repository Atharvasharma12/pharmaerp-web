// Selectors for the branchCash slice
// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: runningCash and frozenCash are COMPUTED from denomination sums.
// The backend no longer stores scalar cash amounts — amounts are derived by
// summing denomination quantities × face value so they can never drift.
// ─────────────────────────────────────────────────────────────────────────────

export const selectAllBranchCash = (state) => state.branchCash.allBranchCash;
export const selectCurrentBranchCash = (state) => state.branchCash.currentBranchCash;

// Derive totals from denomination sums (canonical source of truth)
export const selectRunningDenominations = (state) =>
  state.branchCash.currentBranchCash?.denominationBalance?.runningDenominations ??
  state.branchCash.currentBranchCash?.balance?.runningDenominations ??
  [];

export const selectFrozenDenominations = (state) =>
  state.branchCash.currentBranchCash?.denominationBalance?.frozenDenominations ??
  state.branchCash.currentBranchCash?.balance?.frozenDenominations ??
  [];

export const selectRunningCash = (state) => {
  const denoms =
    state.branchCash.currentBranchCash?.denominationBalance?.runningDenominations ??
    state.branchCash.currentBranchCash?.balance?.runningDenominations ??
    [];

  if (denoms.length > 0) {
    return denoms.reduce(
      (sum, d) => sum + (Number(d.denomination) || 0) * (Number(d.quantity) || 0),
      0,
    );
  }

  const fromApi = state.branchCash.currentBranchCash?.runningCash;
  return typeof fromApi === "number" ? fromApi : 0;
};

export const selectFrozenCash = (state) => {
  const denoms =
    state.branchCash.currentBranchCash?.denominationBalance?.frozenDenominations ??
    state.branchCash.currentBranchCash?.balance?.frozenDenominations ??
    [];

  if (denoms.length > 0) {
    return denoms.reduce(
      (sum, d) => sum + (Number(d.denomination) || 0) * (Number(d.quantity) || 0),
      0,
    );
  }

  const fromApi = state.branchCash.currentBranchCash?.frozenCash;
  return typeof fromApi === "number" ? fromApi : 0;
};

// Status selectors
export const selectBranchCashListStatus = (state) => state.branchCash.listStatus;
export const selectBranchCashFetchStatus = (state) => state.branchCash.fetchStatus;
export const selectInitializeStatus = (state) => state.branchCash.initializeStatus;
export const selectDepositStatus = (state) => state.branchCash.depositStatus;
export const selectWithdrawStatus = (state) => state.branchCash.withdrawStatus;

export const selectBranchCashError = (state) => state.branchCash.error;
export const selectBranchCashMessage = (state) => state.branchCash.message;
