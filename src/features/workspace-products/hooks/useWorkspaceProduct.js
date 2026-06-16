// src/features/workspace-products/hooks/useWorkspaceProduct.js

import { useDispatch, useSelector } from "react-redux";

import {
  searchBeforeCreateWorkspaceProduct,
  createWorkspaceProduct,
  getWorkspaceProducts,
  getWorkspaceProductById,
  getWorkspaceProductByCode,
  updateWorkspaceProduct,
  deleteWorkspaceProduct,
} from "../store/workspaceProductThunk";

import {
  clearWorkspaceProductError,
  clearWorkspaceProductMessage,
  clearSearchBeforeCreateResult,
  setCurrentWorkspaceProduct,
  clearCurrentWorkspaceProduct,
  clearWorkspaceProducts,
} from "../store/workspaceProductSlice";

import {
  selectWorkspaceProducts,
  selectCurrentWorkspaceProduct,
  selectSearchBeforeCreateResult,
  selectWorkspaceProductStatus,
  selectWorkspaceProductError,
  selectWorkspaceProductMessage,
  selectSearchBeforeCreateStatus,
  selectCreateWorkspaceProductStatus,
  selectGetWorkspaceProductsStatus,
  selectGetWorkspaceProductStatus,
  selectUpdateWorkspaceProductStatus,
  selectDeleteWorkspaceProductStatus,
  selectWorkspaceProductPagination,
} from "../store/workspaceProductSelector";

const useWorkspaceProduct = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------

  const products = useSelector(selectWorkspaceProducts);

  const currentProduct = useSelector(selectCurrentWorkspaceProduct);

  const searchBeforeCreateResult = useSelector(selectSearchBeforeCreateResult);

  // ---------------------
  // Global State
  // ---------------------

  const status = useSelector(selectWorkspaceProductStatus);

  const error = useSelector(selectWorkspaceProductError);

  const message = useSelector(selectWorkspaceProductMessage);

  const pagination = useSelector(selectWorkspaceProductPagination);

  // ---------------------
  // Status
  // ---------------------

  const searchBeforeCreateStatus = useSelector(selectSearchBeforeCreateStatus);

  const createWorkspaceProductStatus = useSelector(
    selectCreateWorkspaceProductStatus,
  );

  const getWorkspaceProductsStatus = useSelector(
    selectGetWorkspaceProductsStatus,
  );

  const getWorkspaceProductStatus = useSelector(
    selectGetWorkspaceProductStatus,
  );

  const updateWorkspaceProductStatus = useSelector(
    selectUpdateWorkspaceProductStatus,
  );

  const deleteWorkspaceProductStatus = useSelector(
    selectDeleteWorkspaceProductStatus,
  );

  // ---------------------
  // Thunks
  // ---------------------

  const searchProductBeforeCreate = (params) => {
    return dispatch(searchBeforeCreateWorkspaceProduct(params)).unwrap();
  };

  const submitCreateWorkspaceProduct = (payload) => {
    return dispatch(createWorkspaceProduct(payload)).unwrap();
  };

  const fetchWorkspaceProducts = (params = {}) => {
    return dispatch(getWorkspaceProducts(params)).unwrap();
  };

  const fetchWorkspaceProductById = (productId) => {
    return dispatch(getWorkspaceProductById(productId)).unwrap();
  };

  const fetchWorkspaceProductByCode = (productCode) => {
    return dispatch(getWorkspaceProductByCode(productCode)).unwrap();
  };

  const submitUpdateWorkspaceProduct = (productId, payload) => {
    return dispatch(
      updateWorkspaceProduct({
        productId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteWorkspaceProduct = (productId) => {
    return dispatch(deleteWorkspaceProduct(productId)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------

  const clearError = () => {
    dispatch(clearWorkspaceProductError());
  };

  const clearMessage = () => {
    dispatch(clearWorkspaceProductMessage());
  };

  const clearProductSearchResult = () => {
    dispatch(clearSearchBeforeCreateResult());
  };

  const saveCurrentWorkspaceProduct = (product) => {
    dispatch(setCurrentWorkspaceProduct(product));
  };

  const removeCurrentWorkspaceProduct = () => {
    dispatch(clearCurrentWorkspaceProduct());
  };

  const removeWorkspaceProducts = () => {
    dispatch(clearWorkspaceProducts());
  };

  // ---------------------
  // Public API
  // ---------------------

  return {
    // Data
    products,
    currentProduct,
    searchBeforeCreateResult,

    // Pagination
    pagination,

    // Global
    status,
    error,
    message,

    // Status
    searchBeforeCreateStatus,
    createWorkspaceProductStatus,
    getWorkspaceProductsStatus,
    getWorkspaceProductStatus,
    updateWorkspaceProductStatus,
    deleteWorkspaceProductStatus,

    // Search Before Create
    searchBeforeCreateWorkspaceProduct: searchProductBeforeCreate,

    // CRUD
    createWorkspaceProduct: submitCreateWorkspaceProduct,

    getWorkspaceProducts: fetchWorkspaceProducts,

    getWorkspaceProductById: fetchWorkspaceProductById,

    getWorkspaceProductByCode: fetchWorkspaceProductByCode,

    updateWorkspaceProduct: submitUpdateWorkspaceProduct,

    deleteWorkspaceProduct: submitDeleteWorkspaceProduct,

    // Utility Actions
    clearError,
    clearMessage,

    clearSearchBeforeCreateResult: clearProductSearchResult,

    setCurrentWorkspaceProduct: saveCurrentWorkspaceProduct,

    clearCurrentWorkspaceProduct: removeCurrentWorkspaceProduct,

    clearWorkspaceProducts: removeWorkspaceProducts,
  };
};

export default useWorkspaceProduct;
