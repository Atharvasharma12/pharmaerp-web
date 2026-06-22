import { useDispatch, useSelector } from "react-redux";

import {
  getBankMasters,
  getBankMasterById,
  getBankMasterByName,
} from "../store/bankMasterThunk";

import {
  clearBankMasterError,
  clearBankMasterMessage,
  setCurrentBankMaster,
  clearCurrentBankMaster,
  clearBankMasters,
} from "../store/bankMasterSlice";

import {
  selectBankMasters,
  selectCurrentBankMaster,
  selectBankMasterStatus,
  selectBankMasterError,
  selectBankMasterMessage,
  selectGetBankMastersStatus,
  selectGetBankMasterStatus,
  selectBankMasterPagination,
} from "../store/bankMasterSelector";

const useBankMaster = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------
  const bankMasters = useSelector(selectBankMasters);

  const currentBankMaster = useSelector(selectCurrentBankMaster);

  const pagination = useSelector(selectBankMasterPagination);

  // ---------------------
  // Global State
  // ---------------------
  const status = useSelector(selectBankMasterStatus);

  const error = useSelector(selectBankMasterError);

  const message = useSelector(selectBankMasterMessage);

  // ---------------------
  // Status
  // ---------------------
  const getBankMastersStatus = useSelector(selectGetBankMastersStatus);

  const getBankMasterStatus = useSelector(selectGetBankMasterStatus);

  // ---------------------
  // Thunks
  // ---------------------
  const fetchBankMasters = (params = {}) => {
    return dispatch(getBankMasters(params)).unwrap();
  };

  const fetchBankMasterById = (bankId) => {
    return dispatch(getBankMasterById(bankId)).unwrap();
  };

  const fetchBankMasterByName = (name) => {
    return dispatch(getBankMasterByName(name)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------
  const clearError = () => {
    dispatch(clearBankMasterError());
  };

  const clearMessage = () => {
    dispatch(clearBankMasterMessage());
  };

  const saveCurrentBankMaster = (bankMaster) => {
    dispatch(setCurrentBankMaster(bankMaster));
  };

  const removeCurrentBankMaster = () => {
    dispatch(clearCurrentBankMaster());
  };

  const removeBankMasters = () => {
    dispatch(clearBankMasters());
  };

  // ---------------------
  // Public API
  // ---------------------
  return {
    // Data
    bankMasters,
    currentBankMaster,

    // Pagination
    pagination,

    // Global State
    status,
    error,
    message,

    // Status
    getBankMastersStatus,
    getBankMasterStatus,

    // API Actions
    getBankMasters: fetchBankMasters,
    getBankMasterById: fetchBankMasterById,
    getBankMasterByName: fetchBankMasterByName,

    // Local Actions
    clearError,
    clearMessage,

    setCurrentBankMaster: saveCurrentBankMaster,

    clearCurrentBankMaster: removeCurrentBankMaster,

    clearBankMasters: removeBankMasters,
  };
};

export default useBankMaster;
