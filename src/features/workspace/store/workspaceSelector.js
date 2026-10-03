export const selectWorkspaces = (state) => state.workspace.workspaces;

export const selectCurrentWorkspace = (state) =>
  state.workspace.currentWorkspace;

export const selectWorkspaceMembers = (state) => state.workspace.members;

export const selectWorkspaceInvitations = (state) =>
  state.workspace.invitations;

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

export const selectUpdateWorkspaceMemberStatus = (state) =>
  state.workspace.updateWorkspaceMemberStatus;

export const selectRemoveWorkspaceMemberStatus = (state) =>
  state.workspace.removeWorkspaceMemberStatus;

export const selectDirectCreateWorkspaceMemberStatus = (state) =>
  state.workspace.directCreateWorkspaceMemberStatus;

export const selectResetMemberPasswordStatus = (state) =>
  state.workspace.resetMemberPasswordStatus;

export const selectLastCreatedMemberCredentials = (state) =>
  state.workspace.lastCreatedMemberCredentials;

export const selectInviteWorkspaceMemberStatus = (state) =>
  state.workspace.inviteWorkspaceMemberStatus;

export const selectGetWorkspaceInvitationsStatus = (state) =>
  state.workspace.getWorkspaceInvitationsStatus;

export const selectCancelWorkspaceInvitationStatus = (state) =>
  state.workspace.cancelWorkspaceInvitationStatus;

export const selectResendWorkspaceInvitationStatus = (state) =>
  state.workspace.resendWorkspaceInvitationStatus;

export const selectUpdateWorkspaceInvitationStatus = (state) =>
  state.workspace.updateWorkspaceInvitationStatus;

export const selectAcceptWorkspaceInvitationStatus = (state) =>
  state.workspace.acceptWorkspaceInvitationStatus;

export const selectAcceptWorkspaceInvitationSignupStatus = (state) =>
  state.workspace.acceptWorkspaceInvitationSignupStatus;

export const selectGetPublicInvitationDetailsStatus = (state) =>
  state.workspace.getPublicInvitationDetailsStatus;

export const selectPublicInvitationDetails = (state) =>
  state.workspace.publicInvitationDetails;

// --- NEW USER PROFILE INCOMING INVITATIONS SELECTORS ---

export const selectIncomingInvitations = (state) =>
  state.workspace.incomingInvitations || [];

export const selectGetIncomingUserInvitationsStatus = (state) =>
  state.workspace.getIncomingUserInvitationsStatus;

export const selectAcceptIncomingInvitationStatus = (state) =>
  state.workspace.acceptIncomingInvitationStatus;

// --- SETUP CENTER SELECTORS ---

export const selectWorkspaceSetupStatus = (state) =>
  state.workspace.setupStatus;

export const selectWorkspaceSetupStatusVersion = (state) =>
  state.workspace.setupStatusVersion;

export const selectWorkspaceSetupStatusLoading = (state) =>
  state.workspace.getWorkspaceSetupStatusStatus === "loading";
