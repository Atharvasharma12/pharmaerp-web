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
  updateWorkspaceStatus: API_STATUS.IDLE,
  deleteWorkspaceStatus: API_STATUS.IDLE,

  getWorkspaceMembersStatus: API_STATUS.IDLE,
  addWorkspaceMemberStatus: API_STATUS.IDLE,
  updateWorkspaceMemberStatusStatus: API_STATUS.IDLE,
  removeWorkspaceMemberStatus: API_STATUS.IDLE,
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
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.createWorkspaceStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.workspaces.unshift(action.payload);
        }

        state.message = "Workspace created successfully";
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.createWorkspaceStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create workspace";
      })

      // GET MY WORKSPACES
      .addCase(getMyWorkspaces.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getMyWorkspaces.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.workspaces = action.payload || [];
      })
      .addCase(getMyWorkspaces.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch workspaces";
      })

      // GET WORKSPACE BY ID
      .addCase(getWorkspaceById.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.currentWorkspace = action.payload || null;
      })
      .addCase(getWorkspaceById.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch workspace";
      })

      // UPDATE WORKSPACE
      .addCase(updateWorkspace.pending, (state) => {
        state.updateWorkspaceStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.updateWorkspaceStatus = API_STATUS.SUCCESS;

        const updatedWorkspace = action.payload;

        state.workspaces = state.workspaces.map((workspace) => {
          const workspaceData = workspace.workspace || workspace;

          if (workspaceData._id === updatedWorkspace._id) {
            return workspace.workspace
              ? {
                  ...workspace,
                  workspace: updatedWorkspace,
                }
              : updatedWorkspace;
          }

          return workspace;
        });

        if (
          state.currentWorkspace &&
          state.currentWorkspace._id === updatedWorkspace._id
        ) {
          state.currentWorkspace = updatedWorkspace;
        }

        state.message = "Workspace updated successfully";
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.updateWorkspaceStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update workspace";
      })

      // DELETE WORKSPACE
      .addCase(deleteWorkspace.pending, (state) => {
        state.deleteWorkspaceStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.deleteWorkspaceStatus = API_STATUS.SUCCESS;

        state.workspaces = state.workspaces.filter((workspace) => {
          const workspaceData = workspace.workspace || workspace;
          return workspaceData._id !== action.payload;
        });

        if (state.currentWorkspace?._id === action.payload) {
          state.currentWorkspace = null;
        }

        state.message = "Workspace deleted successfully";
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.deleteWorkspaceStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to delete workspace";
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
        state.error = action.payload || "Failed to fetch members";
      })

      // ADD WORKSPACE MEMBER
      .addCase(addWorkspaceMember.pending, (state) => {
        state.addWorkspaceMemberStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(addWorkspaceMember.fulfilled, (state, action) => {
        state.addWorkspaceMemberStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.members.push(action.payload);
        }

        state.message = "Workspace member added successfully";
      })
      .addCase(addWorkspaceMember.rejected, (state, action) => {
        state.addWorkspaceMemberStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to add workspace member";
      })

      // UPDATE WORKSPACE MEMBER STATUS
      .addCase(updateWorkspaceMemberStatus.pending, (state) => {
        state.updateWorkspaceMemberStatusStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(updateWorkspaceMemberStatus.fulfilled, (state, action) => {
        state.updateWorkspaceMemberStatusStatus = API_STATUS.SUCCESS;

        const updatedMember = action.payload;

        state.members = state.members.map((member) =>
          member._id === updatedMember._id ? updatedMember : member,
        );

        state.message = "Workspace member status updated successfully";
      })
      .addCase(updateWorkspaceMemberStatus.rejected, (state, action) => {
        state.updateWorkspaceMemberStatusStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update workspace member";
      })

      // REMOVE WORKSPACE MEMBER
      .addCase(removeWorkspaceMember.pending, (state) => {
        state.removeWorkspaceMemberStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(removeWorkspaceMember.fulfilled, (state, action) => {
        state.removeWorkspaceMemberStatus = API_STATUS.SUCCESS;

        state.members = state.members.filter(
          (member) => member._id !== action.payload?._id,
        );

        state.message = "Workspace member removed successfully";
      })
      .addCase(removeWorkspaceMember.rejected, (state, action) => {
        state.removeWorkspaceMemberStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to remove workspace member";
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
