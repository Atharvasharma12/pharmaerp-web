import { useDispatch, useSelector } from "react-redux";

import {
  getHsnMasters,
  getHsnMasterById,
  getHsnMasterByCode,
} from "../store/hsnMasterThunk";

import {
  clearHsnMasterError,
  clearHsnMasterMessage,
  setCurrentHsnMaster,
  clearCurrentHsnMaster,
  clearHsnMasters,
} from "../store/hsnMasterSlice";

import {
  selectHsnMasters,
  selectCurrentHsnMaster,
  selectHsnMasterStatus,
  selectHsnMasterError,
  selectHsnMasterMessage,
  selectGetHsnMastersStatus,
  selectGetHsnMasterStatus,
  selectHsnMasterPagination,
} from "../store/hsnMasterSelector";

const useHsnMaster = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------
  const hsnMasters = useSelector(selectHsnMasters);

  const currentHsnMaster = useSelector(selectCurrentHsnMaster);

  const pagination = useSelector(selectHsnMasterPagination);

  // ---------------------
  // Global State
  // ---------------------
  const status = useSelector(selectHsnMasterStatus);

  const error = useSelector(selectHsnMasterError);

  const message = useSelector(selectHsnMasterMessage);

  // ---------------------
  // Status
  // ---------------------
  const getHsnMastersStatus = useSelector(selectGetHsnMastersStatus);

  const getHsnMasterStatus = useSelector(selectGetHsnMasterStatus);

  // ---------------------
  // Thunks
  // ---------------------
  const fetchHsnMasters = (params = {}) => {
    return dispatch(getHsnMasters(params)).unwrap();
  };

  const fetchHsnMasterById = (hsnId) => {
    return dispatch(getHsnMasterById(hsnId)).unwrap();
  };

  const fetchHsnMasterByCode = (hsnCode) => {
    return dispatch(getHsnMasterByCode(hsnCode)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------
  const clearError = () => {
    dispatch(clearHsnMasterError());
  };

  const clearMessage = () => {
    dispatch(clearHsnMasterMessage());
  };

  const saveCurrentHsnMaster = (hsnMaster) => {
    dispatch(setCurrentHsnMaster(hsnMaster));
  };

  const removeCurrentHsnMaster = () => {
    dispatch(clearCurrentHsnMaster());
  };

  const removeHsnMasters = () => {
    dispatch(clearHsnMasters());
  };

  // ---------------------
  // Public API
  // ---------------------
  return {
    // Data
    hsnMasters,
    currentHsnMaster,

    // Pagination
    pagination,

    // Global State
    status,
    error,
    message,

    // Status
    getHsnMastersStatus,
    getHsnMasterStatus,

    // API Actions
    getHsnMasters: fetchHsnMasters,
    getHsnMasterById: fetchHsnMasterById,
    getHsnMasterByCode: fetchHsnMasterByCode,

    // Local Actions
    clearError,
    clearMessage,
    setCurrentHsnMaster: saveCurrentHsnMaster,
    clearCurrentHsnMaster: removeCurrentHsnMaster,
    clearHsnMasters: removeHsnMasters,
  };
};

export default useHsnMaster;
