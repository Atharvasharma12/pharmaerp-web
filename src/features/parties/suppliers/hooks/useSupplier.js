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

  const submitCreateSupplier = (payload) => {
    return dispatch(createSupplier(payload)).unwrap();
  };

  const fetchSuppliers = (params = {}) => {
    return dispatch(getSuppliers(params)).unwrap();
  };

  const fetchSupplierById = (supplierId) => {
    return dispatch(getSupplierById(supplierId)).unwrap();
  };

  const submitUpdateSupplier = (supplierId, payload) => {
    return dispatch(
      updateSupplier({
        supplierId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteSupplier = (supplierId) => {
    return dispatch(deleteSupplier(supplierId)).unwrap();
  };

  /*
  |--------------------------------------------------------------------------
  | Financial
  |--------------------------------------------------------------------------
  */

  const fetchSupplierLedger = (supplierId) => {
    return dispatch(getSupplierLedger(supplierId)).unwrap();
  };

  const fetchSupplierOutstanding = (supplierId) => {
    return dispatch(getSupplierOutstanding(supplierId)).unwrap();
  };

  const fetchSupplierPurchases = (supplierId) => {
    return dispatch(getSupplierPurchases(supplierId)).unwrap();
  };

  const fetchSupplierPayments = (supplierId) => {
    return dispatch(getSupplierPayments(supplierId)).unwrap();
  };

  /*
  |--------------------------------------------------------------------------
  | Local Actions
  |--------------------------------------------------------------------------
  */

  const clearError = () => {
    dispatch(clearSupplierError());
  };

  const clearMessage = () => {
    dispatch(clearSupplierMessage());
  };

  const saveCurrentSupplier = (payload) => {
    dispatch(setCurrentSupplier(payload));
  };

  const removeCurrentSupplier = () => {
    dispatch(clearCurrentSupplier());
  };

  const removeSupplierLedger = () => {
    dispatch(clearSupplierLedger());
  };

  const removeSupplierOutstanding = () => {
    dispatch(clearSupplierOutstanding());
  };

  const removeSupplierPurchases = () => {
    dispatch(clearSupplierPurchases());
  };

  const removeSupplierPayments = () => {
    dispatch(clearSupplierPayments());
  };

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
