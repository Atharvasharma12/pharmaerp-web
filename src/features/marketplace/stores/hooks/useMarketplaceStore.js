// src/features/marketplace/stores/hooks/useMarketplaceStore.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectMarketplaceStores,
  selectCurrentMarketplaceStore,
  selectMarketplaceStorePagination,
  selectMarketplaceStoreStatus,
  selectMarketplaceStoreError,
  selectMarketplaceStoreMessage,
  selectGetMarketplaceStoresStatus,
  selectGetMarketplaceStoreStatus,
  selectCreateMarketplaceStoreStatus,
  selectUpdateMarketplaceStoreStatus,
  selectDeleteMarketplaceStoreStatus,
  selectStatusToggleStatus,
} from "../store/marketplaceStoreSelector";

import {
  getMarketplaceStores,
  getMarketplaceStoreById,
  createMarketplaceStore,
  updateMarketplaceStore,
  deleteMarketplaceStore,
  goOnlineMarketplaceStore,
  goOfflineMarketplaceStore,
  pauseMarketplaceStore,
  resumeMarketplaceStore,
} from "../store/marketplaceStoreThunk";

import {
  clearMarketplaceStoreError,
  clearMarketplaceStoreMessage,
  setCurrentMarketplaceStore,
  clearCurrentMarketplaceStore,
  clearMarketplaceStores,
} from "../store/marketplaceStoreSlice";

export const useMarketplaceStore = () => {
  const dispatch = useDispatch();

  const stores = useSelector(selectMarketplaceStores);
  const currentStore = useSelector(selectCurrentMarketplaceStore);
  const pagination = useSelector(selectMarketplaceStorePagination);

  const status = useSelector(selectMarketplaceStoreStatus);
  const error = useSelector(selectMarketplaceStoreError);
  const message = useSelector(selectMarketplaceStoreMessage);

  const getMarketplaceStoresStatus = useSelector(selectGetMarketplaceStoresStatus);
  const getMarketplaceStoreStatus = useSelector(selectGetMarketplaceStoreStatus);
  const createMarketplaceStoreStatus = useSelector(selectCreateMarketplaceStoreStatus);
  const updateMarketplaceStoreStatus = useSelector(selectUpdateMarketplaceStoreStatus);
  const deleteMarketplaceStoreStatus = useSelector(selectDeleteMarketplaceStoreStatus);
  const statusToggleStatus = useSelector(selectStatusToggleStatus);

  const fetchStores = useCallback(
    (params) => dispatch(getMarketplaceStores(params)).unwrap(),
    [dispatch],
  );

  const fetchStoreById = useCallback(
    (storeId) => dispatch(getMarketplaceStoreById(storeId)).unwrap(),
    [dispatch],
  );

  const handleCreateStore = useCallback(
    (payload) => dispatch(createMarketplaceStore(payload)).unwrap(),
    [dispatch],
  );

  const handleUpdateStore = useCallback(
    (storeId, payload) =>
      dispatch(updateMarketplaceStore({ storeId, payload })).unwrap(),
    [dispatch],
  );

  const handleDeleteStore = useCallback(
    (storeId) => dispatch(deleteMarketplaceStore(storeId)).unwrap(),
    [dispatch],
  );

  const handleGoOnline = useCallback(
    (storeId) => dispatch(goOnlineMarketplaceStore(storeId)).unwrap(),
    [dispatch],
  );

  const handleGoOffline = useCallback(
    (storeId) => dispatch(goOfflineMarketplaceStore(storeId)).unwrap(),
    [dispatch],
  );

  const handlePause = useCallback(
    (storeId) => dispatch(pauseMarketplaceStore(storeId)).unwrap(),
    [dispatch],
  );

  const handleResume = useCallback(
    (storeId) => dispatch(resumeMarketplaceStore(storeId)).unwrap(),
    [dispatch],
  );

  const clearError = useCallback(
    () => dispatch(clearMarketplaceStoreError()),
    [dispatch],
  );

  const clearMessage = useCallback(
    () => dispatch(clearMarketplaceStoreMessage()),
    [dispatch],
  );

  const setStore = useCallback(
    (store) => dispatch(setCurrentMarketplaceStore(store)),
    [dispatch],
  );

  const clearStore = useCallback(
    () => dispatch(clearCurrentMarketplaceStore()),
    [dispatch],
  );

  const resetStores = useCallback(
    () => dispatch(clearMarketplaceStores()),
    [dispatch],
  );

  return {
    stores,
    currentStore,
    pagination,
    status,
    error,
    message,

    getMarketplaceStoresStatus,
    getMarketplaceStoreStatus,
    createMarketplaceStoreStatus,
    updateMarketplaceStoreStatus,
    deleteMarketplaceStoreStatus,
    statusToggleStatus,

    fetchStores,
    fetchStoreById,
    createStore: handleCreateStore,
    updateStore: handleUpdateStore,
    deleteStore: handleDeleteStore,
    goOnline: handleGoOnline,
    goOffline: handleGoOffline,
    pauseStore: handlePause,
    resumeStore: handleResume,

    clearError,
    clearMessage,
    setStore,
    clearStore,
    resetStores,
  };
};

export default useMarketplaceStore;
