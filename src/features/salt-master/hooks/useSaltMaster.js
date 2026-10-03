import { useDispatch, useSelector } from "react-redux";

import {
  getSaltMasters,
  getSaltMasterById,
  getSaltMasterByName,
} from "../store/saltMasterThunk";

import {
  clearSaltMasterError,
  clearSaltMasterMessage,
  setCurrentSaltMaster,
  clearCurrentSaltMaster,
  clearSaltMasters,
} from "../store/saltMasterSlice";

import {
  selectSaltMasters,
  selectCurrentSaltMaster,
  selectSaltMasterStatus,
  selectSaltMasterError,
  selectSaltMasterMessage,
  selectGetSaltMastersStatus,
  selectGetSaltMasterStatus,
  selectSaltMasterPagination,
} from "../store/saltMasterSelector";

const useSaltMaster = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------
  const saltMasters = useSelector(selectSaltMasters);

  const currentSaltMaster = useSelector(selectCurrentSaltMaster);

  const pagination = useSelector(selectSaltMasterPagination);

  // ---------------------
  // Global State
  // ---------------------
  const status = useSelector(selectSaltMasterStatus);

  const error = useSelector(selectSaltMasterError);

  const message = useSelector(selectSaltMasterMessage);

  // ---------------------
  // Status
  // ---------------------
  const getSaltMastersStatus = useSelector(selectGetSaltMastersStatus);

  const getSaltMasterStatus = useSelector(selectGetSaltMasterStatus);

  // ---------------------
  // Thunks
  // ---------------------
  const fetchSaltMasters = (params = {}) => {
    return dispatch(getSaltMasters(params)).unwrap();
  };

  const fetchSaltMasterById = (saltId) => {
    return dispatch(getSaltMasterById(saltId)).unwrap();
  };

  const fetchSaltMasterByName = (name) => {
    return dispatch(getSaltMasterByName(name)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------
  const clearError = () => {
    dispatch(clearSaltMasterError());
  };

  const clearMessage = () => {
    dispatch(clearSaltMasterMessage());
  };

  const saveCurrentSaltMaster = (saltMaster) => {
    dispatch(setCurrentSaltMaster(saltMaster));
  };

  const removeCurrentSaltMaster = () => {
    dispatch(clearCurrentSaltMaster());
  };

  const removeSaltMasters = () => {
    dispatch(clearSaltMasters());
  };

  // ---------------------
  // Public API
  // ---------------------
  return {
    // Data
    saltMasters,
    currentSaltMaster,

    // Pagination
    pagination,

    // Global State
    status,
    error,
    message,

    // Status
    getSaltMastersStatus,
    getSaltMasterStatus,

    // API Actions
    getSaltMasters: fetchSaltMasters,
    getSaltMasterById: fetchSaltMasterById,
    getSaltMasterByName: fetchSaltMasterByName,

    // Local Actions
    clearError,
    clearMessage,

    setCurrentSaltMaster: saveCurrentSaltMaster,
    clearCurrentSaltMaster: removeCurrentSaltMaster,
    clearSaltMasters: removeSaltMasters,
  };
};

export default useSaltMaster;
