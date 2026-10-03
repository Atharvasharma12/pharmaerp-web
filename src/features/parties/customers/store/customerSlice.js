import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

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
} from "./customerThunk";

const initialState = {
  customers: [],
  currentCustomer: null,

  ledger: {},
  outstanding: null,
  sales: {},
  payments: [],

  total: 0,
  page: 1,
  limit: 20,
  stats: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createCustomerStatus: API_STATUS.IDLE,
  getCustomersStatus: API_STATUS.IDLE,
  getCustomerStatus: API_STATUS.IDLE,
  updateCustomerStatus: API_STATUS.IDLE,
  deleteCustomerStatus: API_STATUS.IDLE,

  getCustomerLedgerStatus: API_STATUS.IDLE,
  getCustomerOutstandingStatus: API_STATUS.IDLE,
  getCustomerSalesStatus: API_STATUS.IDLE,
  getCustomerPaymentsStatus: API_STATUS.IDLE,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,

  reducers: {
    clearCustomerError(state) {
      state.error = null;
    },

    clearCustomerMessage(state) {
      state.message = null;
    },

    setCurrentCustomer(state, action) {
      state.currentCustomer = action.payload || null;
    },

    clearCurrentCustomer(state) {
      state.currentCustomer = null;
    },

    clearCustomerLedger(state) {
      state.ledger = {};
    },

    clearCustomerOutstanding(state) {
      state.outstanding = null;
    },

    clearCustomerSales(state) {
      state.sales = {};
    },

    clearCustomerPayments(state) {
      state.payments = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | CREATE CUSTOMER
      |--------------------------------------------------------------------------
      */

      .addCase(createCustomer.pending, (state) => {
        state.createCustomerStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })

      .addCase(createCustomer.fulfilled, (state, action) => {
        state.createCustomerStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.customers.unshift(action.payload);
        }

        state.currentCustomer = action.payload || null;

        state.message = "Customer created successfully";
      })

      .addCase(createCustomer.rejected, (state, action) => {
        state.createCustomerStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create customer";
      })

      /*
      |--------------------------------------------------------------------------
      | GET CUSTOMERS
      |--------------------------------------------------------------------------
      */

      .addCase(getCustomers.pending, (state) => {
        state.getCustomersStatus = API_STATUS.LOADING;
        state.error = null;
      })

      .addCase(getCustomers.fulfilled, (state, action) => {
        state.getCustomersStatus = API_STATUS.SUCCESS;

        state.customers = action.payload?.customers || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.stats = action.payload?.stats || null;

        state.message = "Customers fetched successfully";
      })

      .addCase(getCustomers.rejected, (state, action) => {
        state.getCustomersStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch customers";
      })

      /*
      |--------------------------------------------------------------------------
      | GET CUSTOMER BY ID
      |--------------------------------------------------------------------------
      */

      .addCase(getCustomerById.pending, (state) => {
        state.getCustomerStatus = API_STATUS.LOADING;
        state.error = null;
      })

      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.getCustomerStatus = API_STATUS.SUCCESS;

        state.currentCustomer = action.payload || null;

        state.message = "Customer fetched successfully";
      })

      .addCase(getCustomerById.rejected, (state, action) => {
        state.getCustomerStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch customer";
      })

      /*
      |--------------------------------------------------------------------------
      | UPDATE CUSTOMER
      |--------------------------------------------------------------------------
      */

      .addCase(updateCustomer.pending, (state) => {
        state.updateCustomerStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })

      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updateCustomerStatus = API_STATUS.SUCCESS;

        state.currentCustomer = action.payload || state.currentCustomer;

        state.customers = state.customers.map((customer) =>
          customer._id === action.payload?._id ? action.payload : customer,
        );

        state.message = "Customer updated successfully";
      })

      .addCase(updateCustomer.rejected, (state, action) => {
        state.updateCustomerStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update customer";
      })

      /*
      |--------------------------------------------------------------------------
      | DELETE CUSTOMER
      |--------------------------------------------------------------------------
      */

      .addCase(deleteCustomer.pending, (state) => {
        state.deleteCustomerStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })

      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleteCustomerStatus = API_STATUS.SUCCESS;

        state.customers = state.customers.filter(
          (customer) => customer._id !== action.payload.customerId,
        );

        if (state.currentCustomer?._id === action.payload.customerId) {
          state.currentCustomer = null;
        }

        state.message = "Customer deleted successfully";
      })

      .addCase(deleteCustomer.rejected, (state, action) => {
        state.deleteCustomerStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to delete customer";
      })

      /*
      |--------------------------------------------------------------------------
      | LEDGER
      |--------------------------------------------------------------------------
      */

      .addCase(getCustomerLedger.pending, (state) => {
        state.getCustomerLedgerStatus = API_STATUS.LOADING;
      })

      .addCase(getCustomerLedger.fulfilled, (state, action) => {
        state.getCustomerLedgerStatus = API_STATUS.SUCCESS;
        state.ledger = action.payload || [];
      })

      .addCase(getCustomerLedger.rejected, (state, action) => {
        state.getCustomerLedgerStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch ledger";
      })

      /*
      |--------------------------------------------------------------------------
      | OUTSTANDING
      |--------------------------------------------------------------------------
      */

      .addCase(getCustomerOutstanding.pending, (state) => {
        state.getCustomerOutstandingStatus = API_STATUS.LOADING;
      })

      .addCase(getCustomerOutstanding.fulfilled, (state, action) => {
        state.getCustomerOutstandingStatus = API_STATUS.SUCCESS;
        state.outstanding = action.payload || null;
      })

      .addCase(getCustomerOutstanding.rejected, (state, action) => {
        state.getCustomerOutstandingStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch outstanding";
      })

      /*
      |--------------------------------------------------------------------------
      | SALES
      |--------------------------------------------------------------------------
      */

      .addCase(getCustomerSales.pending, (state) => {
        state.getCustomerSalesStatus = API_STATUS.LOADING;
      })

      .addCase(getCustomerSales.fulfilled, (state, action) => {
        state.getCustomerSalesStatus = API_STATUS.SUCCESS;
        state.sales = action.payload || [];
      })

      .addCase(getCustomerSales.rejected, (state, action) => {
        state.getCustomerSalesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch sales";
      })

      /*
      |--------------------------------------------------------------------------
      | PAYMENTS
      |--------------------------------------------------------------------------
      */

      .addCase(getCustomerPayments.pending, (state) => {
        state.getCustomerPaymentsStatus = API_STATUS.LOADING;
      })

      .addCase(getCustomerPayments.fulfilled, (state, action) => {
        state.getCustomerPaymentsStatus = API_STATUS.SUCCESS;
        state.payments = action.payload || [];
      })

      .addCase(getCustomerPayments.rejected, (state, action) => {
        state.getCustomerPaymentsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch payments";
      });
  },
});

export const {
  clearCustomerError,
  clearCustomerMessage,

  setCurrentCustomer,
  clearCurrentCustomer,

  clearCustomerLedger,
  clearCustomerOutstanding,
  clearCustomerSales,
  clearCustomerPayments,
} = customerSlice.actions;

export default customerSlice.reducer;
