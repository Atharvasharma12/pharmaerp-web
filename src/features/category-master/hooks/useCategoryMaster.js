import { useDispatch, useSelector } from "react-redux";

import {
  getCategoryMasters,
  getCategoryMasterById,
  getCategoryMasterBySlug,
} from "../store/categoryMasterThunk";

import {
  clearCategoryMasterError,
  clearCategoryMasterMessage,
  setCurrentCategoryMaster,
  clearCurrentCategoryMaster,
  clearCategoryMasters,
} from "../store/categoryMasterSlice";

import {
  selectCategoryMasters,
  selectCurrentCategoryMaster,
  selectCategoryMasterStatus,
  selectCategoryMasterError,
  selectCategoryMasterMessage,
  selectGetCategoryMastersStatus,
  selectGetCategoryMasterStatus,
  selectCategoryMasterPagination,
} from "../store/categoryMasterSelector";

const useCategoryMaster = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------
  const categoryMasters = useSelector(selectCategoryMasters);

  const currentCategoryMaster = useSelector(selectCurrentCategoryMaster);

  const pagination = useSelector(selectCategoryMasterPagination);

  // ---------------------
  // Global State
  // ---------------------
  const status = useSelector(selectCategoryMasterStatus);

  const error = useSelector(selectCategoryMasterError);

  const message = useSelector(selectCategoryMasterMessage);

  // ---------------------
  // Status
  // ---------------------
  const getCategoryMastersStatus = useSelector(selectGetCategoryMastersStatus);

  const getCategoryMasterStatus = useSelector(selectGetCategoryMasterStatus);

  // ---------------------
  // Thunks
  // ---------------------
  const fetchCategoryMasters = (params = {}) => {
    return dispatch(getCategoryMasters(params)).unwrap();
  };

  const fetchCategoryMasterById = (categoryId) => {
    return dispatch(getCategoryMasterById(categoryId)).unwrap();
  };

  const fetchCategoryMasterBySlug = (slug) => {
    return dispatch(getCategoryMasterBySlug(slug)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------
  const clearError = () => {
    dispatch(clearCategoryMasterError());
  };

  const clearMessage = () => {
    dispatch(clearCategoryMasterMessage());
  };

  const saveCurrentCategoryMaster = (categoryMaster) => {
    dispatch(setCurrentCategoryMaster(categoryMaster));
  };

  const removeCurrentCategoryMaster = () => {
    dispatch(clearCurrentCategoryMaster());
  };

  const removeCategoryMasters = () => {
    dispatch(clearCategoryMasters());
  };

  // ---------------------
  // Public API
  // ---------------------
  return {
    // Data
    categoryMasters,
    currentCategoryMaster,

    // Pagination
    pagination,

    // Global State
    status,
    error,
    message,

    // Status
    getCategoryMastersStatus,
    getCategoryMasterStatus,

    // API Actions
    getCategoryMasters: fetchCategoryMasters,
    getCategoryMasterById: fetchCategoryMasterById,
    getCategoryMasterBySlug: fetchCategoryMasterBySlug,

    // Local Actions
    clearError,
    clearMessage,

    setCurrentCategoryMaster: saveCurrentCategoryMaster,

    clearCurrentCategoryMaster: removeCurrentCategoryMaster,

    clearCategoryMasters: removeCategoryMasters,
  };
};

export default useCategoryMaster;
