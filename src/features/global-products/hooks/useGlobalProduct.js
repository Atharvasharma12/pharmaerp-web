// src/features/global-products/hooks/useGlobalProduct.js

import { useDispatch, useSelector } from "react-redux";

import {
  getGlobalProducts,
  getGlobalProductById,
  getGlobalProductByCode,
} from "../store/globalProductThunk";

import {
  clearGlobalProductError,
  clearGlobalProductMessage,
  setCurrentGlobalProduct,
  clearCurrentGlobalProduct,
  clearGlobalProducts,
} from "../store/globalProductSlice";

import {
  selectGlobalProducts,
  selectCurrentGlobalProduct,
  selectGlobalProductStatus,
  selectGlobalProductError,
  selectGlobalProductMessage,
  selectGetGlobalProductsStatus,
  selectGetGlobalProductStatus,
  selectGlobalProductPagination,
} from "../store/globalProductSelector";

const useGlobalProduct = () => {
  const dispatch = useDispatch();

  // ---------------------
  // Data
  // ---------------------

  const products = useSelector(selectGlobalProducts);

  const currentProduct = useSelector(selectCurrentGlobalProduct);

  const pagination = useSelector(selectGlobalProductPagination);

  // ---------------------
  // Global State
  // ---------------------

  const status = useSelector(selectGlobalProductStatus);

  const error = useSelector(selectGlobalProductError);

  const message = useSelector(selectGlobalProductMessage);

  // ---------------------
  // Status
  // ---------------------

  const getGlobalProductsStatus = useSelector(selectGetGlobalProductsStatus);

  const getGlobalProductStatus = useSelector(selectGetGlobalProductStatus);

  // ---------------------
  // Thunks
  // ---------------------

  const fetchGlobalProducts = (params = {}) => {
    return dispatch(getGlobalProducts(params)).unwrap();
  };

  const fetchGlobalProductById = (productId) => {
    return dispatch(getGlobalProductById(productId)).unwrap();
  };

  const fetchGlobalProductByCode = (productCode) => {
    return dispatch(getGlobalProductByCode(productCode)).unwrap();
  };

  // ---------------------
  // Local Actions
  // ---------------------

  const clearError = () => {
    dispatch(clearGlobalProductError());
  };

  const clearMessage = () => {
    dispatch(clearGlobalProductMessage());
  };

  const saveCurrentGlobalProduct = (product) => {
    dispatch(setCurrentGlobalProduct(product));
  };

  const removeCurrentGlobalProduct = () => {
    dispatch(clearCurrentGlobalProduct());
  };

  const removeGlobalProducts = () => {
    dispatch(clearGlobalProducts());
  };

  // ---------------------
  // Public API
  // ---------------------

  return {
    // Data
    products,
    currentProduct,

    // Pagination
    pagination,

    // Global State
    status,
    error,
    message,

    // Status
    getGlobalProductsStatus,
    getGlobalProductStatus,

    // API Actions
    getGlobalProducts: fetchGlobalProducts,

    getGlobalProductById: fetchGlobalProductById,

    getGlobalProductByCode: fetchGlobalProductByCode,

    // Local Actions
    clearError,
    clearMessage,

    setCurrentGlobalProduct: saveCurrentGlobalProduct,

    clearCurrentGlobalProduct: removeCurrentGlobalProduct,

    clearGlobalProducts: removeGlobalProducts,
  };
};

export default useGlobalProduct;
