import { useDispatch, useSelector } from "react-redux";

import {
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  deactivateAccount,
} from "../store/userThunk";

import {
  clearUserError,
  clearUserMessage,
  setUser,
  clearUser,
} from "../store/userSlice";

import {
  selectUserProfile,
  selectUserStatus,
  selectUserError,
  selectUserMessage,
  selectUpdateProfileStatus,
  selectUpdateAvatarStatus,
  selectDeleteAvatarStatus,
  selectDeactivateAccountStatus,
} from "../store/userSelector";

const useUser = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUserProfile);

  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const message = useSelector(selectUserMessage);

  const updateProfileStatus = useSelector(selectUpdateProfileStatus);
  const updateAvatarStatus = useSelector(selectUpdateAvatarStatus);
  const deleteAvatarStatus = useSelector(selectDeleteAvatarStatus);
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

  return {
    user,

    status,
    error,
    message,

    updateProfileStatus,
    updateAvatarStatus,
    deleteAvatarStatus,
    deactivateAccountStatus,

    getProfile: fetchProfile,
    updateProfile: submitUpdateProfile,
    updateAvatar: submitUpdateAvatar,
    deleteAvatar: submitDeleteAvatar,
    deactivateAccount: submitDeactivateAccount,

    clearError,
    clearMessage,

    setUser: saveUser,
    clearUser: removeUser,
  };
};

export default useUser;
