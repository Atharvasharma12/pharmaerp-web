export const selectWorkspace = (state) => state.workspace;

export const selectWorkspaces = (state) => state.workspace.workspaces;

export const selectCurrentWorkspace = (state) =>
  state.workspace.currentWorkspace;

export const selectWorkspaceMembers = (state) => state.workspace.members;

export const selectWorkspaceStatus = (state) => state.workspace.status;

export const selectWorkspaceError = (state) => state.workspace.error;

export const selectWorkspaceMessage = (state) => state.workspace.message;

export const selectCreateWorkspaceStatus = (state) =>
  state.workspace.createWorkspaceStatus;

export const selectGetMyWorkspacesStatus = (state) =>
  state.workspace.getMyWorkspacesStatus;

export const selectGetWorkspaceStatus = (state) =>
  state.workspace.getWorkspaceStatus;

export const selectUpdateWorkspaceStatus = (state) =>
  state.workspace.updateWorkspaceStatus;

export const selectDeleteWorkspaceStatus = (state) =>
  state.workspace.deleteWorkspaceStatus;

export const selectGetWorkspaceMembersStatus = (state) =>
  state.workspace.getWorkspaceMembersStatus;

export const selectAddWorkspaceMemberStatus = (state) =>
  state.workspace.addWorkspaceMemberStatus;

export const selectUpdateWorkspaceMemberStatus = (state) =>
  state.workspace.updateWorkspaceMemberStatus;

export const selectRemoveWorkspaceMemberStatus = (state) =>
  state.workspace.removeWorkspaceMemberStatus;
