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

  const submitCreateCustomer = (payload) => {
    return dispatch(createCustomer(payload)).unwrap();
  };

  const fetchCustomers = (params = {}) => {
    return dispatch(getCustomers(params)).unwrap();
  };

  const fetchCustomerById = (customerId) => {
    return dispatch(getCustomerById(customerId)).unwrap();
  };

  const submitUpdateCustomer = (customerId, payload) => {
    return dispatch(
      updateCustomer({
        customerId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteCustomer = (customerId) => {
    return dispatch(deleteCustomer(customerId)).unwrap();
  };

  /*
  |--------------------------------------------------------------------------
  | Ledger
  |--------------------------------------------------------------------------
  */

  const fetchCustomerLedger = (customerId) => {
    return dispatch(getCustomerLedger(customerId)).unwrap();
  };

  /*
  |--------------------------------------------------------------------------
  | Outstanding
  |--------------------------------------------------------------------------
  */

  const fetchCustomerOutstanding = (customerId) => {
    return dispatch(getCustomerOutstanding(customerId)).unwrap();
  };

  /*
  |--------------------------------------------------------------------------
  | Sales
  |--------------------------------------------------------------------------
  */

  const fetchCustomerSales = (customerId) => {
    return dispatch(getCustomerSales(customerId)).unwrap();
  };

  /*
  |--------------------------------------------------------------------------
  | Payments
  |--------------------------------------------------------------------------
  */

  const fetchCustomerPayments = (customerId) => {
    return dispatch(getCustomerPayments(customerId)).unwrap();
  };

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const clearError = () => {
    dispatch(clearCustomerError());
  };

  const clearMessage = () => {
    dispatch(clearCustomerMessage());
  };

  const saveCurrentCustomer = (payload) => {
    dispatch(setCurrentCustomer(payload));
  };

  const removeCurrentCustomer = () => {
    dispatch(clearCurrentCustomer());
  };

  const removeCustomerLedger = () => {
    dispatch(clearCustomerLedger());
  };

  const removeCustomerOutstanding = () => {
    dispatch(clearCustomerOutstanding());
  };

  const removeCustomerSales = () => {
    dispatch(clearCustomerSales());
  };

  const removeCustomerPayments = () => {
    dispatch(clearCustomerPayments());
  };

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
