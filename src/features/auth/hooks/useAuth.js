// src/features/auth/hooks/useAuth.js

import { useDispatch, useSelector } from "react-redux";

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../store/authThunk";

import {
  clearAuthError,
  clearAuthMessage,
  clearCredentials,
  setCredentials,
} from "../store/authSlice";

import {
  selectAuthUser,
  selectAuthToken,
  selectIsAuthenticated,
  selectAuthStatus,
  selectAuthError,
  selectAuthMessage,
  selectForgotPasswordStatus,
  selectResetPasswordStatus,
  selectChangePasswordStatus,
} from "../store/authSelector";

const useAuth = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectAuthUser);
  const token = useSelector(selectAuthToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const message = useSelector(selectAuthMessage);

  const forgotPasswordStatus = useSelector(selectForgotPasswordStatus);
  const resetPasswordStatus = useSelector(selectResetPasswordStatus);
  const changePasswordStatus = useSelector(selectChangePasswordStatus);

  const register = (payload) => {
    return dispatch(registerUser(payload)).unwrap();
  };

  const login = (payload) => {
    return dispatch(loginUser(payload)).unwrap();
  };

  const logout = () => {
    return dispatch(logoutUser()).unwrap();
  };

  const sendForgotPasswordRequest = (payload) => {
    return dispatch(forgotPassword(payload)).unwrap();
  };

  const submitResetPassword = (payload) => {
    return dispatch(resetPassword(payload)).unwrap();
  };

  const submitChangePassword = (payload) => {
    return dispatch(changePassword(payload)).unwrap();
  };

  const clearError = () => {
    dispatch(clearAuthError());
  };

  const clearMessage = () => {
    dispatch(clearAuthMessage());
  };

  const saveCredentials = (payload) => {
    dispatch(setCredentials(payload));
  };

  const removeCredentials = () => {
    dispatch(clearCredentials());
  };

  return {
    user,
    token,
    isAuthenticated,

    status,
    error,
    message,

    forgotPasswordStatus,
    resetPasswordStatus,
    changePasswordStatus,

    register,
    login,
    logout,

    forgotPassword: sendForgotPasswordRequest,
    resetPassword: submitResetPassword,
    changePassword: submitChangePassword,

    clearError,
    clearMessage,

    setCredentials: saveCredentials,
    clearCredentials: removeCredentials,
  };
};

export default useAuth;
