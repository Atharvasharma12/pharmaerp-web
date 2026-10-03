import { useDispatch, useSelector } from "react-redux";

import { getUomMasters, getUomMasterById } from "../store/uomMasterThunk";

import {
  clearUomMasterError,
  clearUomMasterMessage,
  setCurrentUomMaster,
  clearCurrentUomMaster,
  clearUomMasters,
} from "../store/uomMasterSlice";

import {
  selectUomMasters,
  selectCurrentUomMaster,
  selectUomMasterStatus,
  selectUomMasterError,
  selectUomMasterMessage,
  selectGetUomMastersStatus,
  selectGetUomMasterStatus,
  selectUomMasterPagination,
} from "../store/uomMasterSelector";

const useUomMaster = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------
  const uomMasters = useSelector(selectUomMasters);

  const currentUomMaster = useSelector(selectCurrentUomMaster);

  const pagination = useSelector(selectUomMasterPagination);

  // ---------------------
  // Global State
  // ---------------------
  const status = useSelector(selectUomMasterStatus);

  const error = useSelector(selectUomMasterError);

  const message = useSelector(selectUomMasterMessage);

  // ---------------------
  // Status
  // ---------------------
  const getUomMastersStatus = useSelector(selectGetUomMastersStatus);

  const getUomMasterStatus = useSelector(selectGetUomMasterStatus);

  // ---------------------
  // Thunks
  // ---------------------
  const fetchUomMasters = (params = {}) => {
    return dispatch(getUomMasters(params)).unwrap();
  };

  const fetchUomMasterById = (uomId) => {
    return dispatch(getUomMasterById(uomId)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------
  const clearError = () => {
    dispatch(clearUomMasterError());
  };

  const clearMessage = () => {
    dispatch(clearUomMasterMessage());
  };

  const saveCurrentUomMaster = (uomMaster) => {
    dispatch(setCurrentUomMaster(uomMaster));
  };

  const removeCurrentUomMaster = () => {
    dispatch(clearCurrentUomMaster());
  };

  const removeUomMasters = () => {
    dispatch(clearUomMasters());
  };

  // ---------------------
  // Public API
  // ---------------------
  return {
    // Data
    uomMasters,
    currentUomMaster,

    // Pagination
    pagination,

    // Global State
    status,
    error,
    message,

    // Status
    getUomMastersStatus,
    getUomMasterStatus,

    // API Actions
    getUomMasters: fetchUomMasters,
    getUomMasterById: fetchUomMasterById,

    // Local Actions
    clearError,
    clearMessage,

    setCurrentUomMaster: saveCurrentUomMaster,
    clearCurrentUomMaster: removeCurrentUomMaster,
    clearUomMasters: removeUomMasters,
  };
};

export default useUomMaster;
