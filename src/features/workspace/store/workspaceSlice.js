import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/constants";
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  updateWorkspaceMemberStatus,
  removeWorkspaceMember,
  directCreateWorkspaceMember,
  resetMemberPassword,
  inviteWorkspaceMember,
  getWorkspaceInvitations,
  cancelWorkspaceInvitation,
  resendWorkspaceInvitation,
  updateWorkspaceInvitation,
  acceptWorkspaceInvitation,
  acceptWorkspaceInvitationSignup,
  getPublicInvitationDetails,
  getIncomingUserInvitations,
  acceptIncomingInvitation,
  getWorkspaceSetupStatus,
} from "./workspaceThunk";

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  members: [],
  invitations: [],
  incomingInvitations: [],
  publicInvitationDetails: null,
  lastCreatedMemberCredentials: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createWorkspaceStatus: API_STATUS.IDLE,
  getMyWorkspacesStatus: API_STATUS.IDLE,
  getWorkspaceStatus: API_STATUS.IDLE,
  updateWorkspaceStatus: API_STATUS.IDLE,
  deleteWorkspaceStatus: API_STATUS.IDLE,

  getWorkspaceMembersStatus: API_STATUS.IDLE,
  updateWorkspaceMemberStatus: API_STATUS.IDLE,
  removeWorkspaceMemberStatus: API_STATUS.IDLE,
  directCreateWorkspaceMemberStatus: API_STATUS.IDLE,
  resetMemberPasswordStatus: API_STATUS.IDLE,

  inviteWorkspaceMemberStatus: API_STATUS.IDLE,
  getWorkspaceInvitationsStatus: API_STATUS.IDLE,
  cancelWorkspaceInvitationStatus: API_STATUS.IDLE,
  resendWorkspaceInvitationStatus: API_STATUS.IDLE,
  updateWorkspaceInvitationStatus: API_STATUS.IDLE,
  acceptWorkspaceInvitationStatus: API_STATUS.IDLE,
  acceptWorkspaceInvitationSignupStatus: API_STATUS.IDLE,
  getPublicInvitationDetailsStatus: API_STATUS.IDLE,

  getIncomingUserInvitationsStatus: API_STATUS.IDLE,
  acceptIncomingInvitationStatus: API_STATUS.IDLE,

  // Setup Center
  setupStatus: null,
  setupStatusVersion: 0,           // bump to trigger a refetch in SetupCenterPage
  getWorkspaceSetupStatusStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
  state.message = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    clearWorkspaceError(state) {
      state.error = null;
    },
    clearWorkspaceMessage(state) {
      state.message = null;
    },
    setCurrentWorkspace(state, action) {
      state.currentWorkspace = getWorkspaceFromItem(action.payload);
    },
    clearCurrentWorkspace(state) {
      state.currentWorkspace = null;
    },
    clearWorkspaceMembers(state) {
      state.members = [];
    },
    clearWorkspaceInvitations(state) {
      state.invitations = [];
    },
    clearIncomingInvitations(state) {
      state.incomingInvitations = [];
    },
    clearLastCreatedMemberCredentials(state) {
      state.lastCreatedMemberCredentials = null;
    },
    // Bump version so SetupCenterPage re-fetches after a create action succeeds
    invalidateSetupStatus(state) {
      state.setupStatusVersion += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE WORKSPACE
      .addCase(createWorkspace.pending, (state) => {
        state.createWorkspaceStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.createWorkspaceStatus = API_STATUS.SUCCESS;
        state.currentWorkspace = action.payload || null;
        if (action.payload) {
          state.workspaces.unshift({ workspace: action.payload });
        }
        state.message = "Workspace created successfully";
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.createWorkspaceStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace creation failed";
      })

      // GET MY WORKSPACES
      .addCase(getMyWorkspaces.pending, (state) => {
        state.getMyWorkspacesStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getMyWorkspaces.fulfilled, (state, action) => {
        state.getMyWorkspacesStatus = API_STATUS.SUCCESS;
        state.workspaces = action.payload || [];

        // Pure memory fallback: select the existing currentWorkspace if still valid, otherwise default to the first workspace
        state.currentWorkspace =
          state.currentWorkspace ||
          (state.workspaces[0]
            ? getWorkspaceFromItem(state.workspaces[0])
            : null);
      })
      .addCase(getMyWorkspaces.rejected, (state, action) => {
        state.getMyWorkspacesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch workspaces";
      })

      // GET WORKSPACE BY ID
      .addCase(getWorkspaceById.pending, setPending)
      .addCase(getWorkspaceById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getWorkspaceStatus = API_STATUS.SUCCESS;
        state.currentWorkspace = action.payload || null;
      })
      .addCase(getWorkspaceById.rejected, (state, action) => {
        setRejected(state, action);
        state.getWorkspaceStatus = API_STATUS.ERROR;
      })

      // UPDATE WORKSPACE
      .addCase(updateWorkspace.pending, (state) => {
        state.updateWorkspaceStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.updateWorkspaceStatus = API_STATUS.SUCCESS;
        state.currentWorkspace = action.payload || state.currentWorkspace;
        state.workspaces = state.workspaces.map((item) => {
          const workspace = getWorkspaceFromItem(item);
          return workspace?._id === action.payload?._id
            ? item.workspace
              ? { ...item, workspace: action.payload }
              : action.payload
            : item;
        });
        state.message = "Workspace updated successfully";
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.updateWorkspaceStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace update failed";
      })

      // DELETE WORKSPACE
      .addCase(deleteWorkspace.pending, (state) => {
        state.deleteWorkspaceStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.deleteWorkspaceStatus = API_STATUS.SUCCESS;
        state.workspaces = state.workspaces.filter(
          (item) => getWorkspaceFromItem(item)?._id !== action.meta.arg,
        );

        if (state.currentWorkspace?._id === action.meta.arg) {
          state.currentWorkspace = null;
        }
        state.members = [];
        state.invitations = [];
        state.message = "Workspace deleted successfully";
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.deleteWorkspaceStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace delete failed";
      })

      // GET WORKSPACE MEMBERS
      .addCase(getWorkspaceMembers.pending, (state) => {
        state.getWorkspaceMembersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceMembers.fulfilled, (state, action) => {
        state.getWorkspaceMembersStatus = API_STATUS.SUCCESS;
        state.members = action.payload || [];
      })
      .addCase(getWorkspaceMembers.rejected, (state, action) => {
        state.getWorkspaceMembersStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch workspace members";
      })

      // UPDATE WORKSPACE MEMBER STATUS
      .addCase(updateWorkspaceMemberStatus.pending, (state) => {
        state.updateWorkspaceMemberStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateWorkspaceMemberStatus.fulfilled, (state, action) => {
        state.updateWorkspaceMemberStatus = API_STATUS.SUCCESS;
        state.members = state.members.map((member) =>
          member?._id === action.payload?._id ? action.payload : member,
        );
        state.message = "Workspace member status updated successfully";
      })
      .addCase(updateWorkspaceMemberStatus.rejected, (state, action) => {
        state.updateWorkspaceMemberStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace member status update failed";
      })

      // REMOVE WORKSPACE MEMBER
      .addCase(removeWorkspaceMember.pending, (state) => {
        state.removeWorkspaceMemberStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(removeWorkspaceMember.fulfilled, (state, action) => {
        state.removeWorkspaceMemberStatus = API_STATUS.SUCCESS;
        state.members = state.members.map((member) =>
          member?._id === action.payload?._id ? action.payload : member,
        );
        state.message = "Workspace member removed successfully";
      })
      .addCase(removeWorkspaceMember.rejected, (state, action) => {
        state.removeWorkspaceMemberStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace member remove failed";
      })

      // DIRECT CREATE WORKSPACE MEMBER
      .addCase(directCreateWorkspaceMember.pending, (state) => {
        state.directCreateWorkspaceMemberStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(directCreateWorkspaceMember.fulfilled, (state, action) => {
        state.directCreateWorkspaceMemberStatus = API_STATUS.SUCCESS;
        if (action.payload?.member) {
          state.members.unshift(action.payload.member);
        }
        if (action.payload?.credentials) {
          state.lastCreatedMemberCredentials = action.payload.credentials;
        }
        state.message = "Staff member created and activated successfully";
      })
      .addCase(directCreateWorkspaceMember.rejected, (state, action) => {
        state.directCreateWorkspaceMemberStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create staff member";
      })

      // RESET MEMBER PASSWORD
      .addCase(resetMemberPassword.pending, (state) => {
        state.resetMemberPasswordStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(resetMemberPassword.fulfilled, (state, action) => {
        state.resetMemberPasswordStatus = API_STATUS.SUCCESS;
        state.message = "Member password reset successfully";
      })
      .addCase(resetMemberPassword.rejected, (state, action) => {
        state.resetMemberPasswordStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to reset member password";
      })

      // INVITE WORKSPACE MEMBER
      .addCase(inviteWorkspaceMember.pending, (state) => {
        state.inviteWorkspaceMemberStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(inviteWorkspaceMember.fulfilled, (state, action) => {
        state.inviteWorkspaceMemberStatus = API_STATUS.SUCCESS;
        if (action.payload) {
          state.invitations.unshift(action.payload);
        }
        state.message = "Workspace invitation created successfully";
      })
      .addCase(inviteWorkspaceMember.rejected, (state, action) => {
        state.inviteWorkspaceMemberStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace invitation failed";
      })

      // GET WORKSPACE INVITATIONS
      .addCase(getWorkspaceInvitations.pending, (state) => {
        state.getWorkspaceInvitationsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceInvitations.fulfilled, (state, action) => {
        state.getWorkspaceInvitationsStatus = API_STATUS.SUCCESS;
        state.invitations = action.payload || [];
      })
      .addCase(getWorkspaceInvitations.rejected, (state, action) => {
        state.getWorkspaceInvitationsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch workspace invitations";
      })

      // CANCEL WORKSPACE INVITATION
      .addCase(cancelWorkspaceInvitation.pending, (state) => {
        state.cancelWorkspaceInvitationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(cancelWorkspaceInvitation.fulfilled, (state, action) => {
        state.cancelWorkspaceInvitationStatus = API_STATUS.SUCCESS;
        state.invitations = state.invitations.map((invitation) =>
          invitation?._id === action.payload?._id ? action.payload : invitation,
        );
        state.message = "Workspace invitation cancelled successfully";
      })
      .addCase(cancelWorkspaceInvitation.rejected, (state, action) => {
        state.cancelWorkspaceInvitationStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace invitation cancel failed";
      })

      // ACCEPT WORKSPACE INVITATION
      .addCase(acceptWorkspaceInvitation.pending, (state) => {
        state.acceptWorkspaceInvitationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(acceptWorkspaceInvitation.fulfilled, (state) => {
        state.acceptWorkspaceInvitationStatus = API_STATUS.SUCCESS;
        state.message = "Workspace invitation accepted successfully";
      })
      .addCase(acceptWorkspaceInvitation.rejected, (state, action) => {
        state.acceptWorkspaceInvitationStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace invitation accept failed";
      })

      // GET INCOMING USER INVITATIONS
      .addCase(getIncomingUserInvitations.pending, (state) => {
        state.getIncomingUserInvitationsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getIncomingUserInvitations.fulfilled, (state, action) => {
        state.getIncomingUserInvitationsStatus = API_STATUS.SUCCESS;
        state.incomingInvitations = action.payload || [];
      })
      .addCase(getIncomingUserInvitations.rejected, (state, action) => {
        state.getIncomingUserInvitationsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to load incoming invitations";
      })

      // RESEND WORKSPACE INVITATION
      .addCase(resendWorkspaceInvitation.pending, (state) => {
        state.resendWorkspaceInvitationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(resendWorkspaceInvitation.fulfilled, (state, action) => {
        state.resendWorkspaceInvitationStatus = API_STATUS.SUCCESS;
        state.invitations = state.invitations.map((invitation) =>
          invitation?._id === action.payload?._id ? action.payload : invitation,
        );
        state.message = "Invitation email resent successfully";
      })
      .addCase(resendWorkspaceInvitation.rejected, (state, action) => {
        state.resendWorkspaceInvitationStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to resend invitation";
      })

      // UPDATE WORKSPACE INVITATION
      .addCase(updateWorkspaceInvitation.pending, (state) => {
        state.updateWorkspaceInvitationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateWorkspaceInvitation.fulfilled, (state, action) => {
        state.updateWorkspaceInvitationStatus = API_STATUS.SUCCESS;
        state.invitations = state.invitations.map((invitation) =>
          invitation?._id === action.payload?._id ? action.payload : invitation,
        );
        state.message = "Invitation updated successfully";
      })
      .addCase(updateWorkspaceInvitation.rejected, (state, action) => {
        state.updateWorkspaceInvitationStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update invitation";
      })

      // ACCEPT WORKSPACE INVITATION SIGNUP
      .addCase(acceptWorkspaceInvitationSignup.pending, (state) => {
        state.acceptWorkspaceInvitationSignupStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(acceptWorkspaceInvitationSignup.fulfilled, (state) => {
        state.acceptWorkspaceInvitationSignupStatus = API_STATUS.SUCCESS;
        state.message = "Account created and workspace joined successfully";
      })
      .addCase(acceptWorkspaceInvitationSignup.rejected, (state, action) => {
        state.acceptWorkspaceInvitationSignupStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to accept invitation and sign up";
      })

      // GET PUBLIC INVITATION DETAILS
      .addCase(getPublicInvitationDetails.pending, (state) => {
        state.getPublicInvitationDetailsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getPublicInvitationDetails.fulfilled, (state, action) => {
        state.getPublicInvitationDetailsStatus = API_STATUS.SUCCESS;
        state.publicInvitationDetails = action.payload || null;
      })
      .addCase(getPublicInvitationDetails.rejected, (state, action) => {
        state.getPublicInvitationDetailsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to load invitation details";
      })

      // ACCEPT INCOMING INVITATION
      .addCase(acceptIncomingInvitation.pending, (state) => {
        state.acceptIncomingInvitationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(acceptIncomingInvitation.fulfilled, (state, action) => {
        state.acceptIncomingInvitationStatus = API_STATUS.SUCCESS;
        state.message = "Workspace joined successfully";
        if (action.meta?.arg) {
          state.incomingInvitations = state.incomingInvitations.filter(
            (invitation) =>
              invitation.tokenHash !== action.meta.arg &&
              invitation._id !== action.meta.arg,
          );
        }
      })
      .addCase(acceptIncomingInvitation.rejected, (state, action) => {
        state.acceptIncomingInvitationStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to accept workspace invitation";
      });

      // ── SETUP CENTER ──────────────────────────────────────────────────────
      builder
        .addCase(getWorkspaceSetupStatus.pending, (state) => {
          state.getWorkspaceSetupStatusStatus = API_STATUS.LOADING;
        })
        .addCase(getWorkspaceSetupStatus.fulfilled, (state, action) => {
          state.getWorkspaceSetupStatusStatus = API_STATUS.SUCCESS;
          state.setupStatus = action.payload;
        })
        .addCase(getWorkspaceSetupStatus.rejected, (state) => {
          state.getWorkspaceSetupStatusStatus = API_STATUS.ERROR;
        });
  },
});

export const {
  clearWorkspaceError,
  clearWorkspaceMessage,
  setCurrentWorkspace,
  clearCurrentWorkspace,
  clearWorkspaceMembers,
  clearWorkspaceInvitations,
  clearIncomingInvitations,
  clearLastCreatedMemberCredentials,
  invalidateSetupStatus,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
