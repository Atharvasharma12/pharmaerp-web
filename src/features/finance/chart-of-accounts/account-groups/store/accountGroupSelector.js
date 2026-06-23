export const selectAccountGroup = (state) => state.accountGroup;

export const selectAccountGroups = (state) => state.accountGroup.accountGroups;

export const selectCurrentAccountGroup = (state) =>
  state.accountGroup.currentAccountGroup;

// Used for details/edit page
export const selectManagedAccountGroup = (state) =>
  state.accountGroup.managedAccountGroup;

export const selectAccountGroupStatus = (state) => state.accountGroup.status;

export const selectAccountGroupError = (state) => state.accountGroup.error;

export const selectAccountGroupMessage = (state) => state.accountGroup.message;

export const selectCreateAccountGroupStatus = (state) =>
  state.accountGroup.createAccountGroupStatus;

export const selectGetAccountGroupsStatus = (state) =>
  state.accountGroup.getAccountGroupsStatus;

export const selectGetAccountGroupStatus = (state) =>
  state.accountGroup.getAccountGroupStatus;

export const selectUpdateAccountGroupStatus = (state) =>
  state.accountGroup.updateAccountGroupStatus;

export const selectDeleteAccountGroupStatus = (state) =>
  state.accountGroup.deleteAccountGroupStatus;
