import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  addWorkspaceMember,
  updateWorkspaceMemberStatus,
  removeWorkspaceMember,
} from "./workspaceThunk";

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  members: [],

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createWorkspaceStatus: API_STATUS.IDLE,
  getMyWorkspacesStatus: API_STATUS.IDLE,
  getWorkspaceStatus: API_STATUS.IDLE,
  updateWorkspaceStatus: API_STATUS.IDLE,
  deleteWorkspaceStatus: API_STATUS.IDLE,

  getWorkspaceMembersStatus: API_STATUS.IDLE,
  addWorkspaceMemberStatus: API_STATUS.IDLE,
  updateWorkspaceMemberStatus: API_STATUS.IDLE,
  removeWorkspaceMemberStatus: API_STATUS.IDLE,
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
      state.currentWorkspace = action.payload || null;
    },

    clearCurrentWorkspace(state) {
      state.currentWorkspace = null;
    },

    clearWorkspaceMembers(state) {
      state.members = [];
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
          const workspace = item.workspace || item;

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
          const workspace = item.workspace || item;

          return workspace?._id !== action.meta.arg;
        });

        if (state.currentWorkspace?._id === action.meta.arg) {
          state.currentWorkspace = null;
        }

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

      // ADD WORKSPACE MEMBER
      .addCase(addWorkspaceMember.pending, (state) => {
        state.addWorkspaceMemberStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(addWorkspaceMember.fulfilled, (state, action) => {
        state.addWorkspaceMemberStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.members.unshift(action.payload);
        }

        state.message = "Workspace member added successfully";
      })
      .addCase(addWorkspaceMember.rejected, (state, action) => {
        state.addWorkspaceMemberStatus = API_STATUS.ERROR;
        state.error = action.payload || "Workspace member add failed";
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
      });
  },
});

export const {
  clearWorkspaceError,
  clearWorkspaceMessage,
  setCurrentWorkspace,
  clearCurrentWorkspace,
  clearWorkspaceMembers,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
