import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS, USER_STORAGE_KEY } from "@/constants";
import { storage } from "@/utils";

import {
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  deactivateAccount,
} from "./userThunk";

const initialState = {
  user: storage.get(USER_STORAGE_KEY) || null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  updateProfileStatus: API_STATUS.IDLE,
  updateAvatarStatus: API_STATUS.IDLE,
  deleteAvatarStatus: API_STATUS.IDLE,
  deactivateAccountStatus: API_STATUS.IDLE,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    clearUserError(state) {
      state.error = null;
    },

    clearUserMessage(state) {
      state.message = null;
    },

    setUser(state, action) {
      state.user = action.payload || null;

      if (action.payload) {
        storage.set(USER_STORAGE_KEY, action.payload);
      }
    },

    clearUser(state) {
      state.user = null;

      storage.remove(USER_STORAGE_KEY);
    },
  },

  extraReducers: (builder) => {
    builder
      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.user = action.payload?.user || null;
        state.message = "Profile fetched successfully";
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch profile";
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileStatus = API_STATUS.SUCCESS;
        state.user = action.payload?.user || state.user;
        state.message = "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileStatus = API_STATUS.ERROR;
        state.error = action.payload || "Profile update failed";
      })

      // UPDATE AVATAR
      .addCase(updateAvatar.pending, (state) => {
        state.updateAvatarStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.updateAvatarStatus = API_STATUS.SUCCESS;
        state.user = action.payload?.user || state.user;
        state.message = "Avatar updated successfully";
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.updateAvatarStatus = API_STATUS.ERROR;
        state.error = action.payload || "Avatar update failed";
      })

      // DELETE AVATAR
      .addCase(deleteAvatar.pending, (state) => {
        state.deleteAvatarStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(deleteAvatar.fulfilled, (state, action) => {
        state.deleteAvatarStatus = API_STATUS.SUCCESS;
        state.user = action.payload?.user || state.user;
        state.message = "Avatar deleted successfully";
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.deleteAvatarStatus = API_STATUS.ERROR;
        state.error = action.payload || "Avatar delete failed";
      })

      // DEACTIVATE ACCOUNT
      .addCase(deactivateAccount.pending, (state) => {
        state.deactivateAccountStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(deactivateAccount.fulfilled, (state, action) => {
        state.deactivateAccountStatus = API_STATUS.SUCCESS;
        state.message =
          action.payload?.message || "Account deactivated successfully";
      })
      .addCase(deactivateAccount.rejected, (state, action) => {
        state.deactivateAccountStatus = API_STATUS.ERROR;
        state.error = action.payload || "Account deactivation failed";
      });
  },
});

export const { clearUserError, clearUserMessage, setUser, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
