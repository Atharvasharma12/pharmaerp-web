export const selectUser = (state) => state.user;

export const selectUserProfile = (state) => state.user.user;

export const selectUserActiveContext = (state) => state.user.activeContext;

export const selectUserActiveWorkspaceId = (state) =>
  state.user.activeContext?.workspaceId || null;

export const selectUserActiveCompanyId = (state) =>
  state.user.activeContext?.companyId || null;

export const selectUserActiveBranchId = (state) =>
  state.user.activeContext?.branchId || null;

export const selectUserStatus = (state) => state.user.status;

export const selectUserError = (state) => state.user.error;

export const selectUserMessage = (state) => state.user.message;

export const selectUpdateProfileStatus = (state) =>
  state.user.updateProfileStatus;

export const selectUpdateAvatarStatus = (state) =>
  state.user.updateAvatarStatus;

export const selectDeleteAvatarStatus = (state) =>
  state.user.deleteAvatarStatus;

export const selectGetActiveContextStatus = (state) =>
  state.user.getActiveContextStatus;

export const selectUpdateActiveContextStatus = (state) =>
  state.user.updateActiveContextStatus;

export const selectDeactivateAccountStatus = (state) =>
  state.user.deactivateAccountStatus;
