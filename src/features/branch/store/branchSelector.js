export const selectBranch = (state) => state.branch;

export const selectBranches = (state) => state.branch.branches;

export const selectCurrentBranch = (state) => state.branch.currentBranch;

export const selectBranchStatus = (state) => state.branch.status;

export const selectBranchError = (state) => state.branch.error;

export const selectBranchMessage = (state) => state.branch.message;

export const selectCreateBranchStatus = (state) =>
  state.branch.createBranchStatus;

export const selectGetCompanyBranchesStatus = (state) =>
  state.branch.getCompanyBranchesStatus;

export const selectGetWorkspaceBranchesStatus = (state) =>
  state.branch.getWorkspaceBranchesStatus;

export const selectGetBranchStatus = (state) => state.branch.getBranchStatus;

export const selectUpdateBranchStatus = (state) =>
  state.branch.updateBranchStatus;

export const selectDeleteBranchStatus = (state) =>
  state.branch.deleteBranchStatus;
