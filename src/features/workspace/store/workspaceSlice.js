import { createSlice } from "@reduxjs/toolkit";

import {
  API_STATUS,
  WORKSPACE_STORAGE_KEY,
  COMPANY_STORAGE_KEY,
  BRANCH_STORAGE_KEY,
} from "@/constants";
import { storage } from "@/utils";

import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  updateWorkspaceMemberStatus,
  removeWorkspaceMember,
  inviteWorkspaceMember,
  getWorkspaceInvitations,
  cancelWorkspaceInvitation,
  acceptWorkspaceInvitation,
  getIncomingUserInvitations,
  acceptIncomingInvitation,
} from "./workspaceThunk";

const getWorkspaceFromItem = (item) => {
  return item?.workspace || item || null;
};

const persistCurrentWorkspace = (workspace) => {
  if (workspace?._id) {
    storage.set(WORKSPACE_STORAGE_KEY, workspace._id);
  }
};

const removePersistedWorkspace = () => {
  storage.remove(WORKSPACE_STORAGE_KEY);
  storage.remove(COMPANY_STORAGE_KEY);
  storage.remove(BRANCH_STORAGE_KEY);
};

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  members: [],
  invitations: [],

  // New State for User Profile Inbox
  incomingInvitations: [],

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

  inviteWorkspaceMemberStatus: API_STATUS.IDLE,
  getWorkspaceInvitationsStatus: API_STATUS.IDLE,
  cancelWorkspaceInvitationStatus: API_STATUS.IDLE,
  acceptWorkspaceInvitationStatus: API_STATUS.IDLE,

  // New Loading Statuses
  getIncomingUserInvitationsStatus: API_STATUS.IDLE,
  acceptIncomingInvitationStatus: API_STATUS.IDLE,
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

      if (state.currentWorkspace?._id) {
        persistCurrentWorkspace(state.currentWorkspace);

        storage.remove(COMPANY_STORAGE_KEY);
        storage.remove(BRANCH_STORAGE_KEY);
      } else {
        removePersistedWorkspace();
      }
    },

    clearCurrentWorkspace(state) {
      state.currentWorkspace = null;
      removePersistedWorkspace();
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
          state.workspaces.unshift({
            workspace: action.payload,
          });

          persistCurrentWorkspace(action.payload);

          storage.remove(COMPANY_STORAGE_KEY);
          storage.remove(BRANCH_STORAGE_KEY);
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

        const persistedWorkspaceId = storage.get(WORKSPACE_STORAGE_KEY);

        const matchedWorkspaceItem = state.workspaces.find((item) => {
          const workspace = getWorkspaceFromItem(item);

          return workspace?._id === persistedWorkspaceId;
        });

        const matchedWorkspace = getWorkspaceFromItem(matchedWorkspaceItem);

        const firstWorkspaceItem = state.workspaces[0];
        const firstWorkspace = getWorkspaceFromItem(firstWorkspaceItem);

        state.currentWorkspace =
          state.currentWorkspace || matchedWorkspace || firstWorkspace || null;

        if (state.currentWorkspace?._id) {
          persistCurrentWorkspace(state.currentWorkspace);
        } else {
          removePersistedWorkspace();
        }

        state.message = "Workspaces fetched successfully";
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

        if (action.payload?._id) {
          persistCurrentWorkspace(action.payload);
        }

        state.message = "Workspace fetched successfully";
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

          if (workspace?._id === action.payload?._id) {
            return item.workspace
              ? {
                  ...item,
                  workspace: action.payload,
                }
              : action.payload;
          }

          return item;
        });

        if (state.currentWorkspace?._id) {
          persistCurrentWorkspace(state.currentWorkspace);
        }

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

        state.workspaces = state.workspaces.filter((item) => {
          const workspace = getWorkspaceFromItem(item);

          return workspace?._id !== action.meta.arg;
        });

        if (state.currentWorkspace?._id === action.meta.arg) {
          state.currentWorkspace = null;
          removePersistedWorkspace();
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
        state.message = "Workspace members fetched successfully";
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
        state.message = "Workspace invitations fetched successfully";
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

      // ACCEPT WORKSPACE INVITATION (VIA EMAIL LINK)
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

      // GET INCOMING USER INVITATIONS (PROFILE INBOX)
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

      // ACCEPT INCOMING INVITATION (PROFILE INBOX)
      .addCase(acceptIncomingInvitation.pending, (state) => {
        state.acceptIncomingInvitationStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(acceptIncomingInvitation.fulfilled, (state, action) => {
        state.acceptIncomingInvitationStatus = API_STATUS.SUCCESS;
        state.message = "Workspace joined successfully";

        // Remove the accepted invitation from the inbox list instantly
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
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
