export const selectUser = (state) => state.user;

export const selectUserProfile = (state) => state.user.user;

export const selectUserStatus = (state) => state.user.status;

export const selectUserError = (state) => state.user.error;

export const selectUserMessage = (state) => state.user.message;

export const selectUpdateProfileStatus = (state) =>
  state.user.updateProfileStatus;

export const selectUpdateAvatarStatus = (state) =>
  state.user.updateAvatarStatus;

export const selectDeleteAvatarStatus = (state) =>
  state.user.deleteAvatarStatus;

export const selectDeactivateAccountStatus = (state) =>
  state.user.deactivateAccountStatus;
