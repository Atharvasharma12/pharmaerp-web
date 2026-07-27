// src/features/marketplace/products/hooks/useMarketplaceProduct.js

import { useDispatch, useSelector } from "react-redux";

import {
  getMarketplaceProducts,
  getMarketplaceProductById,
  enableMarketplaceProduct,
  updateMarketplaceProduct,
  disableMarketplaceProduct,
} from "../store/marketplaceProductThunk";

import {
  clearMarketplaceProductError,
  clearMarketplaceProductMessage,
  setCurrentMarketplaceProduct,
  clearCurrentMarketplaceProduct,
  clearMarketplaceProducts,
} from "../store/marketplaceProductSlice";

import {
  selectMarketplaceProducts,
  selectCurrentMarketplaceProduct,
  selectMarketplaceProductStatus,
  selectMarketplaceProductError,
  selectMarketplaceProductMessage,
  selectEnableMarketplaceProductStatus,
  selectGetMarketplaceProductsStatus,
  selectGetMarketplaceProductStatus,
  selectUpdateMarketplaceProductStatus,
  selectDisableMarketplaceProductStatus,
  selectMarketplaceProductPagination,
} from "../store/marketplaceProductSelector";

const useMarketplaceProduct = () => {
  const dispatch = useDispatch();

  const products = useSelector(selectMarketplaceProducts);
  const currentProduct = useSelector(selectCurrentMarketplaceProduct);
  const status = useSelector(selectMarketplaceProductStatus);
  const error = useSelector(selectMarketplaceProductError);
  const message = useSelector(selectMarketplaceProductMessage);
  const pagination = useSelector(selectMarketplaceProductPagination);

  const enableMarketplaceProductStatus = useSelector(selectEnableMarketplaceProductStatus);
  const getMarketplaceProductsStatus = useSelector(selectGetMarketplaceProductsStatus);
  const getMarketplaceProductStatus = useSelector(selectGetMarketplaceProductStatus);
  const updateMarketplaceProductStatus = useSelector(selectUpdateMarketplaceProductStatus);
  const disableMarketplaceProductStatus = useSelector(selectDisableMarketplaceProductStatus);

  const fetchMarketplaceProducts = (params = {}) => {
    return dispatch(getMarketplaceProducts(params)).unwrap();
  };

  const fetchMarketplaceProductById = (productId) => {
    return dispatch(getMarketplaceProductById(productId)).unwrap();
  };

  const submitEnableMarketplaceProduct = (payload) => {
    return dispatch(enableMarketplaceProduct(payload)).unwrap();
  };

  const submitUpdateMarketplaceProduct = (productId, payload) => {
    return dispatch(
      updateMarketplaceProduct({
        productId,
        payload,
      }),
    ).unwrap();
  };

  const submitDisableMarketplaceProduct = (productId) => {
    return dispatch(disableMarketplaceProduct(productId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearMarketplaceProductError());
  };

  const clearMessage = () => {
    dispatch(clearMarketplaceProductMessage());
  };

  const saveCurrentProduct = (product) => {
    dispatch(setCurrentMarketplaceProduct(product));
  };

  const removeCurrentProduct = () => {
    dispatch(clearCurrentMarketplaceProduct());
  };

  const removeProducts = () => {
    dispatch(clearMarketplaceProducts());
  };

  return {
    products,
    currentProduct,
    status,
    error,
    message,
    pagination,

    enableMarketplaceProductStatus,
    getMarketplaceProductsStatus,
    getMarketplaceProductStatus,
    updateMarketplaceProductStatus,
    disableMarketplaceProductStatus,

    getMarketplaceProducts: fetchMarketplaceProducts,
    getMarketplaceProductById: fetchMarketplaceProductById,
    enableMarketplaceProduct: submitEnableMarketplaceProduct,
    updateMarketplaceProduct: submitUpdateMarketplaceProduct,
    disableMarketplaceProduct: submitDisableMarketplaceProduct,

    clearError,
    clearMessage,
    setCurrentMarketplaceProduct: saveCurrentProduct,
    clearCurrentMarketplaceProduct: removeCurrentProduct,
    clearMarketplaceProducts: removeProducts,
  };
};

export default useMarketplaceProduct;
