import { useDispatch, useSelector } from "react-redux";

import {
  getManufacturerMasters,
  getManufacturerMasterById,
  getManufacturerMasterByName,
} from "../store/manufacturerMasterThunk";

import {
  clearManufacturerMasterError,
  clearManufacturerMasterMessage,
  setCurrentManufacturerMaster,
  clearCurrentManufacturerMaster,
  clearManufacturerMasters,
} from "../store/manufacturerMasterSlice";

import {
  selectManufacturerMasters,
  selectCurrentManufacturerMaster,
  selectManufacturerMasterStatus,
  selectManufacturerMasterError,
  selectManufacturerMasterMessage,
  selectGetManufacturerMastersStatus,
  selectGetManufacturerMasterStatus,
  selectManufacturerMasterPagination,
} from "../store/manufacturerMasterSelector";

const useManufacturerMaster = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------
  const manufacturerMasters = useSelector(selectManufacturerMasters);

  const currentManufacturerMaster = useSelector(
    selectCurrentManufacturerMaster,
  );

  const pagination = useSelector(selectManufacturerMasterPagination);

  // ---------------------
  // Global State
  // ---------------------
  const status = useSelector(selectManufacturerMasterStatus);

  const error = useSelector(selectManufacturerMasterError);

  const message = useSelector(selectManufacturerMasterMessage);

  // ---------------------
  // Status
  // ---------------------
  const getManufacturerMastersStatus = useSelector(
    selectGetManufacturerMastersStatus,
  );

  const getManufacturerMasterStatus = useSelector(
    selectGetManufacturerMasterStatus,
  );

  // ---------------------
  // Thunks
  // ---------------------
  const fetchManufacturerMasters = (params = {}) => {
    return dispatch(getManufacturerMasters(params)).unwrap();
  };

  const fetchManufacturerMasterById = (manufacturerId) => {
    return dispatch(getManufacturerMasterById(manufacturerId)).unwrap();
  };

  const fetchManufacturerMasterByName = (name) => {
    return dispatch(getManufacturerMasterByName(name)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------
  const clearError = () => {
    dispatch(clearManufacturerMasterError());
  };

  const clearMessage = () => {
    dispatch(clearManufacturerMasterMessage());
  };

  const saveCurrentManufacturerMaster = (manufacturerMaster) => {
    dispatch(setCurrentManufacturerMaster(manufacturerMaster));
  };

  const removeCurrentManufacturerMaster = () => {
    dispatch(clearCurrentManufacturerMaster());
  };

  const removeManufacturerMasters = () => {
    dispatch(clearManufacturerMasters());
  };

  // ---------------------
  // Public API
  // ---------------------
  return {
    // Data
    manufacturerMasters,
    currentManufacturerMaster,

    // Pagination
    pagination,

    // Global State
    status,
    error,
    message,

    // Status
    getManufacturerMastersStatus,
    getManufacturerMasterStatus,

    // API Actions
    getManufacturerMasters: fetchManufacturerMasters,
    getManufacturerMasterById: fetchManufacturerMasterById,
    getManufacturerMasterByName: fetchManufacturerMasterByName,

    // Local Actions
    clearError,
    clearMessage,

    setCurrentManufacturerMaster: saveCurrentManufacturerMaster,

    clearCurrentManufacturerMaster: removeCurrentManufacturerMaster,

    clearManufacturerMasters: removeManufacturerMasters,
  };
};

export default useManufacturerMaster;
