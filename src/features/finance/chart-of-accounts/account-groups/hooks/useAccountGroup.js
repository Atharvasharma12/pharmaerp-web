import { useDispatch, useSelector } from "react-redux";

import {
  createAccountGroup,
  getAccountGroups,
  getAccountGroupById,
  updateAccountGroup,
  deleteAccountGroup,
} from "../store/accountGroupThunk";

import {
  clearAccountGroupError,
  clearAccountGroupMessage,
  setCurrentAccountGroup,
  clearCurrentAccountGroup,
  clearAccountGroups,
  clearManagedAccountGroup,
} from "../store/accountGroupSlice";

import {
  selectAccountGroups,
  selectCurrentAccountGroup,
  selectManagedAccountGroup,
  selectAccountGroupStatus,
  selectAccountGroupError,
  selectAccountGroupMessage,
  selectCreateAccountGroupStatus,
  selectGetAccountGroupsStatus,
  selectGetAccountGroupStatus,
  selectUpdateAccountGroupStatus,
  selectDeleteAccountGroupStatus,
} from "../store/accountGroupSelector";

const useAccountGroup = () => {
  const dispatch = useDispatch();

  const accountGroups = useSelector(selectAccountGroups);
  const currentAccountGroup = useSelector(selectCurrentAccountGroup);
  const managedAccountGroup = useSelector(selectManagedAccountGroup);

  const status = useSelector(selectAccountGroupStatus);
  const error = useSelector(selectAccountGroupError);
  const message = useSelector(selectAccountGroupMessage);

  const createAccountGroupStatus = useSelector(selectCreateAccountGroupStatus);

  const getAccountGroupsStatus = useSelector(selectGetAccountGroupsStatus);

  const getAccountGroupStatus = useSelector(selectGetAccountGroupStatus);

  const updateAccountGroupStatus = useSelector(selectUpdateAccountGroupStatus);

  const deleteAccountGroupStatus = useSelector(selectDeleteAccountGroupStatus);

  const submitCreateAccountGroup = (payload) => {
    return dispatch(createAccountGroup(payload)).unwrap();
  };

  const fetchAccountGroups = (params = {}) => {
    return dispatch(getAccountGroups(params)).unwrap();
  };

  const fetchAccountGroupById = (accountGroupId) => {
    return dispatch(getAccountGroupById(accountGroupId)).unwrap();
  };

  const submitUpdateAccountGroup = (accountGroupId, payload) => {
    return dispatch(
      updateAccountGroup({
        accountGroupId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteAccountGroup = (accountGroupId) => {
    return dispatch(deleteAccountGroup(accountGroupId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearAccountGroupError());
  };

  const clearMessage = () => {
    dispatch(clearAccountGroupMessage());
  };

  const saveCurrentAccountGroup = (payload) => {
    dispatch(setCurrentAccountGroup(payload));
  };

  const removeCurrentAccountGroup = () => {
    dispatch(clearCurrentAccountGroup());
  };

  const removeAccountGroups = () => {
    dispatch(clearAccountGroups());
  };

  const removeManagedAccountGroup = () => {
    dispatch(clearManagedAccountGroup());
  };

  return {
    accountGroups,
    currentAccountGroup,
    managedAccountGroup,

    status,
    error,
    message,

    createAccountGroupStatus,
    getAccountGroupsStatus,
    getAccountGroupStatus,
    updateAccountGroupStatus,
    deleteAccountGroupStatus,

    createAccountGroup: submitCreateAccountGroup,
    getAccountGroups: fetchAccountGroups,
    getAccountGroupById: fetchAccountGroupById,
    updateAccountGroup: submitUpdateAccountGroup,
    deleteAccountGroup: submitDeleteAccountGroup,

    clearError,
    clearMessage,

    setCurrentAccountGroup: saveCurrentAccountGroup,
    clearCurrentAccountGroup: removeCurrentAccountGroup,
    clearAccountGroups: removeAccountGroups,
    clearManagedAccountGroup: removeManagedAccountGroup,
  };
};

export default useAccountGroup;
