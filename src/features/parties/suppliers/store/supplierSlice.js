import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

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
} from "./supplierThunk";

const initialState = {
  suppliers: [],
  currentSupplier: null,

  ledger: [],
  outstanding: null,
  purchases: [],
  payments: [],

  total: 0,
  page: 1,
  limit: 20,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createSupplierStatus: API_STATUS.IDLE,
  getSuppliersStatus: API_STATUS.IDLE,
  getSupplierStatus: API_STATUS.IDLE,
  updateSupplierStatus: API_STATUS.IDLE,
  deleteSupplierStatus: API_STATUS.IDLE,

  getSupplierLedgerStatus: API_STATUS.IDLE,
  getSupplierOutstandingStatus: API_STATUS.IDLE,
  getSupplierPurchasesStatus: API_STATUS.IDLE,
  getSupplierPaymentsStatus: API_STATUS.IDLE,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,

  reducers: {
    clearSupplierError(state) {
      state.error = null;
    },

    clearSupplierMessage(state) {
      state.message = null;
    },

    setCurrentSupplier(state, action) {
      state.currentSupplier = action.payload || null;
    },

    clearCurrentSupplier(state) {
      state.currentSupplier = null;
    },

    clearSupplierLedger(state) {
      state.ledger = [];
    },

    clearSupplierOutstanding(state) {
      state.outstanding = null;
    },

    clearSupplierPurchases(state) {
      state.purchases = [];
    },

    clearSupplierPayments(state) {
      state.payments = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | CREATE SUPPLIER
      |--------------------------------------------------------------------------
      */

      .addCase(createSupplier.pending, (state) => {
        state.createSupplierStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })

      .addCase(createSupplier.fulfilled, (state, action) => {
        state.createSupplierStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.suppliers.unshift(action.payload);
        }

        state.currentSupplier = action.payload || null;

        state.message = "Supplier created successfully";
      })

      .addCase(createSupplier.rejected, (state, action) => {
        state.createSupplierStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create supplier";
      })

      /*
      |--------------------------------------------------------------------------
      | GET SUPPLIERS
      |--------------------------------------------------------------------------
      */

      .addCase(getSuppliers.pending, (state) => {
        state.getSuppliersStatus = API_STATUS.LOADING;
        state.error = null;
      })

      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.getSuppliersStatus = API_STATUS.SUCCESS;

        state.suppliers = action.payload?.suppliers || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;

        state.message = "Suppliers fetched successfully";
      })

      .addCase(getSuppliers.rejected, (state, action) => {
        state.getSuppliersStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch suppliers";
      })

      /*
      |--------------------------------------------------------------------------
      | GET SUPPLIER BY ID
      |--------------------------------------------------------------------------
      */

      .addCase(getSupplierById.pending, (state) => {
        state.getSupplierStatus = API_STATUS.LOADING;
        state.error = null;
      })

      .addCase(getSupplierById.fulfilled, (state, action) => {
        state.getSupplierStatus = API_STATUS.SUCCESS;

        state.currentSupplier = action.payload || null;

        state.message = "Supplier fetched successfully";
      })

      .addCase(getSupplierById.rejected, (state, action) => {
        state.getSupplierStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch supplier";
      })

      /*
      |--------------------------------------------------------------------------
      | UPDATE SUPPLIER
      |--------------------------------------------------------------------------
      */

      .addCase(updateSupplier.pending, (state) => {
        state.updateSupplierStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })

      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.updateSupplierStatus = API_STATUS.SUCCESS;

        state.currentSupplier = action.payload || state.currentSupplier;

        state.suppliers = state.suppliers.map((supplier) =>
          supplier._id === action.payload?._id ? action.payload : supplier,
        );

        state.message = "Supplier updated successfully";
      })

      .addCase(updateSupplier.rejected, (state, action) => {
        state.updateSupplierStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update supplier";
      })

      /*
      |--------------------------------------------------------------------------
      | DELETE SUPPLIER
      |--------------------------------------------------------------------------
      */

      .addCase(deleteSupplier.pending, (state) => {
        state.deleteSupplierStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })

      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.deleteSupplierStatus = API_STATUS.SUCCESS;

        state.suppliers = state.suppliers.filter(
          (supplier) => supplier._id !== action.payload.supplierId,
        );

        if (state.currentSupplier?._id === action.payload.supplierId) {
          state.currentSupplier = null;
        }

        state.message = "Supplier deleted successfully";
      })

      .addCase(deleteSupplier.rejected, (state, action) => {
        state.deleteSupplierStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to delete supplier";
      })

      /*
      |--------------------------------------------------------------------------
      | LEDGER
      |--------------------------------------------------------------------------
      */

      .addCase(getSupplierLedger.pending, (state) => {
        state.getSupplierLedgerStatus = API_STATUS.LOADING;
      })

      .addCase(getSupplierLedger.fulfilled, (state, action) => {
        state.getSupplierLedgerStatus = API_STATUS.SUCCESS;
        state.ledger = action.payload || [];
      })

      .addCase(getSupplierLedger.rejected, (state, action) => {
        state.getSupplierLedgerStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch ledger";
      })

      /*
      |--------------------------------------------------------------------------
      | OUTSTANDING
      |--------------------------------------------------------------------------
      */

      .addCase(getSupplierOutstanding.pending, (state) => {
        state.getSupplierOutstandingStatus = API_STATUS.LOADING;
      })

      .addCase(getSupplierOutstanding.fulfilled, (state, action) => {
        state.getSupplierOutstandingStatus = API_STATUS.SUCCESS;
        state.outstanding = action.payload || null;
      })

      .addCase(getSupplierOutstanding.rejected, (state, action) => {
        state.getSupplierOutstandingStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch outstanding";
      })

      /*
      |--------------------------------------------------------------------------
      | PURCHASES
      |--------------------------------------------------------------------------
      */

      .addCase(getSupplierPurchases.pending, (state) => {
        state.getSupplierPurchasesStatus = API_STATUS.LOADING;
      })

      .addCase(getSupplierPurchases.fulfilled, (state, action) => {
        state.getSupplierPurchasesStatus = API_STATUS.SUCCESS;
        state.purchases = action.payload || [];
      })

      .addCase(getSupplierPurchases.rejected, (state, action) => {
        state.getSupplierPurchasesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch purchases";
      })

      /*
      |--------------------------------------------------------------------------
      | PAYMENTS
      |--------------------------------------------------------------------------
      */

      .addCase(getSupplierPayments.pending, (state) => {
        state.getSupplierPaymentsStatus = API_STATUS.LOADING;
      })

      .addCase(getSupplierPayments.fulfilled, (state, action) => {
        state.getSupplierPaymentsStatus = API_STATUS.SUCCESS;
        state.payments = action.payload || [];
      })

      .addCase(getSupplierPayments.rejected, (state, action) => {
        state.getSupplierPaymentsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch payments";
      });
  },
});

export const {
  clearSupplierError,
  clearSupplierMessage,

  setCurrentSupplier,
  clearCurrentSupplier,

  clearSupplierLedger,
  clearSupplierOutstanding,
  clearSupplierPurchases,
  clearSupplierPayments,
} = supplierSlice.actions;

export default supplierSlice.reducer;
