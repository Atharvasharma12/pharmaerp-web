import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerLedger,
  getCustomerOutstanding,
  getCustomerSales,
  getCustomerPayments,
} from "../store/customerThunk";

import {
  clearCustomerError,
  clearCustomerMessage,
  setCurrentCustomer,
  clearCurrentCustomer,
  clearCustomerLedger,
  clearCustomerOutstanding,
  clearCustomerSales,
  clearCustomerPayments,
} from "../store/customerSlice";

import {
  selectCustomers,
  selectCurrentCustomer,
  selectCustomerLedger,
  selectCustomerOutstanding,
  selectCustomerSales,
  selectCustomerPayments,
  selectCustomerTotal,
  selectCustomerPage,
  selectCustomerLimit,
  selectCustomerStats,
  selectCustomerStatus,
  selectCustomerError,
  selectCustomerMessage,
  selectCreateCustomerStatus,
  selectGetCustomersStatus,
  selectGetCustomerStatus,
  selectUpdateCustomerStatus,
  selectDeleteCustomerStatus,
  selectGetCustomerLedgerStatus,
  selectGetCustomerOutstandingStatus,
  selectGetCustomerSalesStatus,
  selectGetCustomerPaymentsStatus,
} from "../store/customerSelector";

const useCustomer = () => {
  const dispatch = useDispatch();

  const customers = useSelector(selectCustomers);
  const currentCustomer = useSelector(selectCurrentCustomer);

  const ledger = useSelector(selectCustomerLedger);
  const outstanding = useSelector(selectCustomerOutstanding);
  const sales = useSelector(selectCustomerSales);
  const payments = useSelector(selectCustomerPayments);

  const total = useSelector(selectCustomerTotal);
  const page = useSelector(selectCustomerPage);
  const limit = useSelector(selectCustomerLimit);
  const stats = useSelector(selectCustomerStats);

  const status = useSelector(selectCustomerStatus);
  const error = useSelector(selectCustomerError);
  const message = useSelector(selectCustomerMessage);

  const createCustomerStatus = useSelector(selectCreateCustomerStatus);

  const getCustomersStatus = useSelector(selectGetCustomersStatus);

  const getCustomerStatus = useSelector(selectGetCustomerStatus);

  const updateCustomerStatus = useSelector(selectUpdateCustomerStatus);

  const deleteCustomerStatus = useSelector(selectDeleteCustomerStatus);

  const getCustomerLedgerStatus = useSelector(selectGetCustomerLedgerStatus);

  const getCustomerOutstandingStatus = useSelector(
    selectGetCustomerOutstandingStatus,
  );

  const getCustomerSalesStatus = useSelector(selectGetCustomerSalesStatus);

  const getCustomerPaymentsStatus = useSelector(
    selectGetCustomerPaymentsStatus,
  );

  /*
  |--------------------------------------------------------------------------
  | CRUD
  |--------------------------------------------------------------------------
  */

  const submitCreateCustomer = useCallback((payload) => {
    return dispatch(createCustomer(payload)).unwrap();
  }, [dispatch]);

  const fetchCustomers = useCallback((params = {}) => {
    return dispatch(getCustomers(params)).unwrap();
  }, [dispatch]);

  const fetchCustomerById = useCallback((customerId) => {
    return dispatch(getCustomerById(customerId)).unwrap();
  }, [dispatch]);

  const submitUpdateCustomer = useCallback((customerId, payload) => {
    return dispatch(
      updateCustomer({
        customerId,
        payload,
      }),
    ).unwrap();
  }, [dispatch]);

  const submitDeleteCustomer = useCallback((customerId) => {
    return dispatch(deleteCustomer(customerId)).unwrap();
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Ledger
  |--------------------------------------------------------------------------
  */

  const fetchCustomerLedger = useCallback((customerId) => {
    return dispatch(getCustomerLedger(customerId)).unwrap();
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Outstanding
  |--------------------------------------------------------------------------
  */

  const fetchCustomerOutstanding = useCallback((customerId) => {
    return dispatch(getCustomerOutstanding(customerId)).unwrap();
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Sales
  |--------------------------------------------------------------------------
  */

  const fetchCustomerSales = useCallback((customerId) => {
    return dispatch(getCustomerSales(customerId)).unwrap();
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Payments
  |--------------------------------------------------------------------------
  */

  const fetchCustomerPayments = useCallback((customerId) => {
    return dispatch(getCustomerPayments(customerId)).unwrap();
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const clearError = useCallback(() => {
    dispatch(clearCustomerError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearCustomerMessage());
  }, [dispatch]);

  const saveCurrentCustomer = useCallback((payload) => {
    dispatch(setCurrentCustomer(payload));
  }, [dispatch]);

  const removeCurrentCustomer = useCallback(() => {
    dispatch(clearCurrentCustomer());
  }, [dispatch]);

  const removeCustomerLedger = useCallback(() => {
    dispatch(clearCustomerLedger());
  }, [dispatch]);

  const removeCustomerOutstanding = useCallback(() => {
    dispatch(clearCustomerOutstanding());
  }, [dispatch]);

  const removeCustomerSales = useCallback(() => {
    dispatch(clearCustomerSales());
  }, [dispatch]);

  const removeCustomerPayments = useCallback(() => {
    dispatch(clearCustomerPayments());
  }, [dispatch]);

  return {
    customers,
    currentCustomer,

    ledger,
    outstanding,
    sales,
    payments,

    total,
    page,
    limit,
    stats,

    status,
    error,
    message,

    createCustomerStatus,
    getCustomersStatus,
    getCustomerStatus,
    updateCustomerStatus,
    deleteCustomerStatus,

    getCustomerLedgerStatus,
    getCustomerOutstandingStatus,
    getCustomerSalesStatus,
    getCustomerPaymentsStatus,

    createCustomer: submitCreateCustomer,
    getCustomers: fetchCustomers,
    getCustomerById: fetchCustomerById,
    updateCustomer: submitUpdateCustomer,
    deleteCustomer: submitDeleteCustomer,

    getCustomerLedger: fetchCustomerLedger,
    getCustomerOutstanding: fetchCustomerOutstanding,
    getCustomerSales: fetchCustomerSales,
    getCustomerPayments: fetchCustomerPayments,

    clearError,
    clearMessage,

    setCurrentCustomer: saveCurrentCustomer,
    clearCurrentCustomer: removeCurrentCustomer,

    clearCustomerLedger: removeCustomerLedger,
    clearCustomerOutstanding: removeCustomerOutstanding,
    clearCustomerSales: removeCustomerSales,
    clearCustomerPayments: removeCustomerPayments,
  };
};

export default useCustomer;
