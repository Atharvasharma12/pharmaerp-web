import { useDispatch, useSelector } from "react-redux";

import {
  getProductFormMasters,
  getProductFormMasterById,
} from "../store/productFormMasterThunk";

import {
  clearProductFormMasterError,
  clearProductFormMasterMessage,
  setCurrentProductFormMaster,
  clearCurrentProductFormMaster,
  clearProductFormMasters,
} from "../store/productFormMasterSlice";

import {
  selectProductFormMasters,
  selectCurrentProductFormMaster,
  selectProductFormMasterStatus,
  selectProductFormMasterError,
  selectProductFormMasterMessage,
  selectGetProductFormMastersStatus,
  selectGetProductFormMasterStatus,
  selectProductFormMasterPagination,
} from "../store/productFormMasterSelector";

const useProductFormMaster = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------
  const productFormMasters = useSelector(selectProductFormMasters);

  const currentProductFormMaster = useSelector(selectCurrentProductFormMaster);

  const pagination = useSelector(selectProductFormMasterPagination);

  // ---------------------
  // Global State
  // ---------------------
  const status = useSelector(selectProductFormMasterStatus);

  const error = useSelector(selectProductFormMasterError);

  const message = useSelector(selectProductFormMasterMessage);

  // ---------------------
  // Status
  // ---------------------
  const getProductFormMastersStatus = useSelector(
    selectGetProductFormMastersStatus,
  );

  const getProductFormMasterStatus = useSelector(
    selectGetProductFormMasterStatus,
  );

  // ---------------------
  // Thunks
  // ---------------------
  const fetchProductFormMasters = (params = {}) => {
    return dispatch(getProductFormMasters(params)).unwrap();
  };

  const fetchProductFormMasterById = (formId) => {
    return dispatch(getProductFormMasterById(formId)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------
  const clearError = () => {
    dispatch(clearProductFormMasterError());
  };

  const clearMessage = () => {
    dispatch(clearProductFormMasterMessage());
  };

  const saveCurrentProductFormMaster = (productFormMaster) => {
    dispatch(setCurrentProductFormMaster(productFormMaster));
  };

  const removeCurrentProductFormMaster = () => {
    dispatch(clearCurrentProductFormMaster());
  };

  const removeProductFormMasters = () => {
    dispatch(clearProductFormMasters());
  };

  // ---------------------
  // Public API
  // ---------------------
  return {
    // Data
    productFormMasters,
    currentProductFormMaster,

    // Pagination
    pagination,

    // Global State
    status,
    error,
    message,

    // Status
    getProductFormMastersStatus,
    getProductFormMasterStatus,

    // API Actions
    getProductFormMasters: fetchProductFormMasters,
    getProductFormMasterById: fetchProductFormMasterById,

    // Local Actions
    clearError,
    clearMessage,

    setCurrentProductFormMaster: saveCurrentProductFormMaster,

    clearCurrentProductFormMaster: removeCurrentProductFormMaster,

    clearProductFormMasters: removeProductFormMasters,
  };
};

export default useProductFormMaster;
