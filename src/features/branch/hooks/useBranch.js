import { useDispatch, useSelector } from "react-redux";

import {
  createBranch,
  getCompanyBranches,
  getWorkspaceBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../store/branchThunk";

import {
  clearBranchError,
  clearBranchMessage,
  setCurrentBranch,
  clearCurrentBranch,
  clearBranches,
  clearManagedBranch, // Added clear reducer
} from "../store/branchSlice";

import {
  selectBranches,
  selectCurrentBranch,
  selectManagedBranch, // Added selector
  selectBranchStatus,
  selectBranchError,
  selectBranchMessage,
  selectCreateBranchStatus,
  selectGetCompanyBranchesStatus,
  selectGetWorkspaceBranchesStatus,
  selectGetBranchStatus,
  selectUpdateBranchStatus,
  selectDeleteBranchStatus,
} from "../store/branchSelector";

const useBranch = () => {
  const dispatch = useDispatch();

  const branches = useSelector(selectBranches);
  const currentBranch = useSelector(selectCurrentBranch);
  const managedBranch = useSelector(selectManagedBranch); // Added hook state

  const status = useSelector(selectBranchStatus);
  const error = useSelector(selectBranchError);
  const message = useSelector(selectBranchMessage);

  const createBranchStatus = useSelector(selectCreateBranchStatus);
  const getCompanyBranchesStatus = useSelector(selectGetCompanyBranchesStatus);
  const getWorkspaceBranchesStatus = useSelector(
    selectGetWorkspaceBranchesStatus,
  );
  const getBranchStatus = useSelector(selectGetBranchStatus);
  const updateBranchStatus = useSelector(selectUpdateBranchStatus);
  const deleteBranchStatus = useSelector(selectDeleteBranchStatus);

  const submitCreateBranch = (payload) => {
    return dispatch(createBranch(payload)).unwrap();
  };

  const fetchCompanyBranches = () => {
    return dispatch(getCompanyBranches()).unwrap();
  };

  const fetchWorkspaceBranches = () => {
    return dispatch(getWorkspaceBranches()).unwrap();
  };

  const fetchBranchById = (branchId) => {
    return dispatch(getBranchById(branchId)).unwrap();
  };

  const submitUpdateBranch = (branchId, payload) => {
    return dispatch(
      updateBranch({
        branchId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteBranch = (branchId) => {
    return dispatch(deleteBranch(branchId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearBranchError());
  };

  const clearMessage = () => {
    dispatch(clearBranchMessage());
  };

  const saveCurrentBranch = (payload) => {
    dispatch(setCurrentBranch(payload));
  };

  const removeCurrentBranch = () => {
    dispatch(clearCurrentBranch());
  };

  const removeBranches = () => {
    dispatch(clearBranches());
  };

  const removeManagedBranch = () => {
    dispatch(clearManagedBranch());
  };

  return {
    branches,
    currentBranch,
    managedBranch, // Exposed management state

    status,
    error,
    message,

    createBranchStatus,
    getCompanyBranchesStatus,
    getWorkspaceBranchesStatus,
    getBranchStatus,
    updateBranchStatus,
    deleteBranchStatus,

    createBranch: submitCreateBranch,
    getCompanyBranches: fetchCompanyBranches,
    getWorkspaceBranches: fetchWorkspaceBranches,
    getBranchById: fetchBranchById,
    updateBranch: submitUpdateBranch,
    deleteBranch: submitDeleteBranch,

    clearError,
    clearMessage,

    setCurrentBranch: saveCurrentBranch,
    clearCurrentBranch: removeCurrentBranch,
    clearBranches: removeBranches,
    clearManagedBranch: removeManagedBranch, // Clean-up handler for pages
  };
};

export default useBranch;
