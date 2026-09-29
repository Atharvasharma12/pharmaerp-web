import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplierLedger,
  getSupplierOutstanding,
  getSupplierPurchases,
  getSupplierPayments,
} from "../store/supplierThunk";

import {
  clearSupplierError,
  clearSupplierMessage,
  setCurrentSupplier,
  clearCurrentSupplier,
  clearSupplierLedger,
  clearSupplierOutstanding,
  clearSupplierPurchases,
  clearSupplierPayments,
} from "../store/supplierSlice";

import {
  selectSuppliers,
  selectCurrentSupplier,
  selectSupplierLedger,
  selectSupplierOutstanding,
  selectSupplierPurchases,
  selectSupplierPayments,
  selectSupplierTotal,
  selectSupplierPage,
  selectSupplierLimit,
  selectSupplierStatus,
  selectSupplierError,
  selectSupplierMessage,
  selectCreateSupplierStatus,
  selectGetSuppliersStatus,
  selectGetSupplierStatus,
  selectUpdateSupplierStatus,
  selectDeleteSupplierStatus,
  selectGetSupplierLedgerStatus,
  selectGetSupplierOutstandingStatus,
  selectGetSupplierPurchasesStatus,
  selectGetSupplierPaymentsStatus,
} from "../store/supplierSelector";

const useSupplier = () => {
  const dispatch = useDispatch();

  const suppliers = useSelector(selectSuppliers);
  const currentSupplier = useSelector(selectCurrentSupplier);

  const ledger = useSelector(selectSupplierLedger);
  const outstanding = useSelector(selectSupplierOutstanding);
  const purchases = useSelector(selectSupplierPurchases);
  const payments = useSelector(selectSupplierPayments);

  const total = useSelector(selectSupplierTotal);
  const page = useSelector(selectSupplierPage);
  const limit = useSelector(selectSupplierLimit);

  const status = useSelector(selectSupplierStatus);
  const error = useSelector(selectSupplierError);
  const message = useSelector(selectSupplierMessage);

  const createSupplierStatus = useSelector(selectCreateSupplierStatus);

  const getSuppliersStatus = useSelector(selectGetSuppliersStatus);

  const getSupplierStatus = useSelector(selectGetSupplierStatus);

  const updateSupplierStatus = useSelector(selectUpdateSupplierStatus);

  const deleteSupplierStatus = useSelector(selectDeleteSupplierStatus);

  const getSupplierLedgerStatus = useSelector(selectGetSupplierLedgerStatus);

  const getSupplierOutstandingStatus = useSelector(
    selectGetSupplierOutstandingStatus,
  );

  const getSupplierPurchasesStatus = useSelector(
    selectGetSupplierPurchasesStatus,
  );

  const getSupplierPaymentsStatus = useSelector(
    selectGetSupplierPaymentsStatus,
  );

  /*
  |--------------------------------------------------------------------------
  | CRUD
  |--------------------------------------------------------------------------
  */

  const submitCreateSupplier = useCallback((payload) => {
    return dispatch(createSupplier(payload)).unwrap();
  }, [dispatch]);

  const fetchSuppliers = useCallback((params = {}) => {
    return dispatch(getSuppliers(params)).unwrap();
  }, [dispatch]);

  const fetchSupplierById = useCallback((supplierId) => {
    return dispatch(getSupplierById(supplierId)).unwrap();
  }, [dispatch]);

  const submitUpdateSupplier = useCallback((supplierId, payload) => {
    return dispatch(
      updateSupplier({
        supplierId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitDeleteSupplier = useCallback((supplierId) => {
    return dispatch(deleteSupplier(supplierId)).unwrap();
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Financial
  |--------------------------------------------------------------------------
  */

  const fetchSupplierLedger = useCallback(({ supplierId, params }) => {
    return dispatch(getSupplierLedger({ supplierId, params })).unwrap();
  }, [dispatch]);

  const fetchSupplierOutstanding = useCallback((supplierId) => {
    return dispatch(getSupplierOutstanding(supplierId)).unwrap();
  }, [dispatch]);

  const fetchSupplierPurchases = useCallback(({ supplierId, params }) => {
    return dispatch(getSupplierPurchases({ supplierId, params })).unwrap();
  }, [dispatch]);

  const fetchSupplierPayments = useCallback((supplierId) => {
    return dispatch(getSupplierPayments(supplierId)).unwrap();
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Local Actions
  |--------------------------------------------------------------------------
  */

  const clearError = useCallback(() => {
    dispatch(clearSupplierError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearSupplierMessage());
  }, [dispatch]);

  const saveCurrentSupplier = useCallback((payload) => {
    dispatch(setCurrentSupplier(payload));
  }, [dispatch]);

  const removeCurrentSupplier = useCallback(() => {
    dispatch(clearCurrentSupplier());
  }, [dispatch]);

  const removeSupplierLedger = useCallback(() => {
    dispatch(clearSupplierLedger());
  }, [dispatch]);

  const removeSupplierOutstanding = useCallback(() => {
    dispatch(clearSupplierOutstanding());
  }, [dispatch]);

  const removeSupplierPurchases = useCallback(() => {
    dispatch(clearSupplierPurchases());
  }, [dispatch]);

  const removeSupplierPayments = useCallback(() => {
    dispatch(clearSupplierPayments());
  }, [dispatch]);

  return {
    suppliers,
    currentSupplier,

    ledger,
    outstanding,
    purchases,
    payments,

    total,
    page,
    limit,

    status,
    error,
    message,

    createSupplierStatus,
    getSuppliersStatus,
    getSupplierStatus,
    updateSupplierStatus,
    deleteSupplierStatus,

    getSupplierLedgerStatus,
    getSupplierOutstandingStatus,
    getSupplierPurchasesStatus,
    getSupplierPaymentsStatus,

    createSupplier: submitCreateSupplier,
    getSuppliers: fetchSuppliers,
    getSupplierById: fetchSupplierById,
    updateSupplier: submitUpdateSupplier,
    deleteSupplier: submitDeleteSupplier,

    getSupplierLedger: fetchSupplierLedger,
    getSupplierOutstanding: fetchSupplierOutstanding,
    getSupplierPurchases: fetchSupplierPurchases,
    getSupplierPayments: fetchSupplierPayments,

    clearError,
    clearMessage,

    setCurrentSupplier: saveCurrentSupplier,
    clearCurrentSupplier: removeCurrentSupplier,

    clearSupplierLedger: removeSupplierLedger,
    clearSupplierOutstanding: removeSupplierOutstanding,
    clearSupplierPurchases: removeSupplierPurchases,
    clearSupplierPayments: removeSupplierPayments,
  };
};

export default useSupplier;
