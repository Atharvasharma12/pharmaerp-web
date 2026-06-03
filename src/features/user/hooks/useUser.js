import { useDispatch, useSelector } from "react-redux";

import {
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  getActiveContext,
  updateActiveContext,
  deactivateAccount,
} from "../store/userThunk";

import {
  clearUserError,
  clearUserMessage,
  setUser,
  clearUser,
  setActiveContext,
  clearActiveContext,
} from "../store/userSlice";

import {
  selectUserProfile,
  selectUserActiveContext,
  selectUserActiveWorkspaceId,
  selectUserActiveCompanyId,
  selectUserActiveBranchId,
  selectUserStatus,
  selectUserError,
  selectUserMessage,
  selectUpdateProfileStatus,
  selectUpdateAvatarStatus,
  selectDeleteAvatarStatus,
  selectGetActiveContextStatus,
  selectUpdateActiveContextStatus,
  selectDeactivateAccountStatus,
} from "../store/userSelector";

const useUser = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUserProfile);

  const activeContext = useSelector(selectUserActiveContext);

  const activeWorkspaceId = useSelector(selectUserActiveWorkspaceId);
  const activeCompanyId = useSelector(selectUserActiveCompanyId);
  const activeBranchId = useSelector(selectUserActiveBranchId);

  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const message = useSelector(selectUserMessage);

  const updateProfileStatus = useSelector(selectUpdateProfileStatus);
  const updateAvatarStatus = useSelector(selectUpdateAvatarStatus);
  const deleteAvatarStatus = useSelector(selectDeleteAvatarStatus);

  const getActiveContextStatus = useSelector(selectGetActiveContextStatus);

  const updateActiveContextStatus = useSelector(
    selectUpdateActiveContextStatus,
  );

  const deactivateAccountStatus = useSelector(selectDeactivateAccountStatus);

  const fetchProfile = () => {
    return dispatch(getProfile()).unwrap();
  };

  const submitUpdateProfile = (payload) => {
    return dispatch(updateProfile(payload)).unwrap();
  };

  const submitUpdateAvatar = (payload) => {
    return dispatch(updateAvatar(payload)).unwrap();
  };

  const submitDeleteAvatar = () => {
    return dispatch(deleteAvatar()).unwrap();
  };

  const fetchActiveContext = () => {
    return dispatch(getActiveContext()).unwrap();
  };

  const submitUpdateActiveContext = (payload) => {
    return dispatch(updateActiveContext(payload)).unwrap();
  };

  const submitDeactivateAccount = () => {
    return dispatch(deactivateAccount()).unwrap();
  };

  const clearError = () => {
    dispatch(clearUserError());
  };

  const clearMessage = () => {
    dispatch(clearUserMessage());
  };

  const saveUser = (payload) => {
    dispatch(setUser(payload));
  };

  const removeUser = () => {
    dispatch(clearUser());
  };

  const saveActiveContext = (payload) => {
    dispatch(setActiveContext(payload));
  };

  const removeActiveContext = () => {
    dispatch(clearActiveContext());
  };

  return {
    user,

    activeContext,
    activeWorkspaceId,
    activeCompanyId,
    activeBranchId,

    status,
    error,
    message,

    updateProfileStatus,
    updateAvatarStatus,
    deleteAvatarStatus,

    getActiveContextStatus,
    updateActiveContextStatus,

    deactivateAccountStatus,

    getProfile: fetchProfile,
    updateProfile: submitUpdateProfile,

    updateAvatar: submitUpdateAvatar,
    deleteAvatar: submitDeleteAvatar,

    getActiveContext: fetchActiveContext,
    updateActiveContext: submitUpdateActiveContext,

    deactivateAccount: submitDeactivateAccount,

    clearError,
    clearMessage,

    setUser: saveUser,
    clearUser: removeUser,

    setActiveContext: saveActiveContext,
    clearActiveContext: removeActiveContext,
  };
};

export default useUser;
