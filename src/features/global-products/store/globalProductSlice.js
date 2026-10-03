// src/features/global-products/store/globalProductSlice.js

import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getGlobalProducts,
  getGlobalProductById,
  getGlobalProductByCode,
} from "./globalProductThunk";

const initialState = {
  products: [],
  currentProduct: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getGlobalProductsStatus: API_STATUS.IDLE,
  getGlobalProductStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const globalProductSlice = createSlice({
  name: "globalProduct",
  initialState,

  reducers: {
    clearGlobalProductError(state) {
      state.error = null;
    },

    clearGlobalProductMessage(state) {
      state.message = null;
    },

    setCurrentGlobalProduct(state, action) {
      state.currentProduct = action.payload || null;
    },

    clearCurrentGlobalProduct(state) {
      state.currentProduct = null;
    },

    clearGlobalProducts(state) {
      state.products = [];
      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------------
      // GET GLOBAL PRODUCTS
      // ---------------------

      .addCase(getGlobalProducts.pending, (state) => {
        state.getGlobalProductsStatus = API_STATUS.LOADING;
        state.error = null;
      })

      .addCase(getGlobalProducts.fulfilled, (state, action) => {
        state.getGlobalProductsStatus = API_STATUS.SUCCESS;

        state.products = action.payload?.products || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "Global products fetched successfully";
      })

      .addCase(getGlobalProducts.rejected, (state, action) => {
        state.getGlobalProductsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch global products";
      })

      // ---------------------
      // GET GLOBAL PRODUCT BY ID
      // ---------------------

      .addCase(getGlobalProductById.pending, (state) => {
        setPending(state);
        state.getGlobalProductStatus = API_STATUS.LOADING;
      })

      .addCase(getGlobalProductById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getGlobalProductStatus = API_STATUS.SUCCESS;

        state.currentProduct = action.payload || null;

        state.message = "Global product fetched successfully";
      })

      .addCase(getGlobalProductById.rejected, (state, action) => {
        setRejected(state, action);
        state.getGlobalProductStatus = API_STATUS.ERROR;
      })

      // ---------------------
      // GET GLOBAL PRODUCT BY CODE
      // ---------------------

      .addCase(getGlobalProductByCode.pending, (state) => {
        setPending(state);
        state.getGlobalProductStatus = API_STATUS.LOADING;
      })

      .addCase(getGlobalProductByCode.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getGlobalProductStatus = API_STATUS.SUCCESS;

        state.currentProduct = action.payload || null;

        state.message = "Global product fetched successfully";
      })

      .addCase(getGlobalProductByCode.rejected, (state, action) => {
        setRejected(state, action);
        state.getGlobalProductStatus = API_STATUS.ERROR;
      });
  },
});

export const {
  clearGlobalProductError,
  clearGlobalProductMessage,
  setCurrentGlobalProduct,
  clearCurrentGlobalProduct,
  clearGlobalProducts,
} = globalProductSlice.actions;

export default globalProductSlice.reducer;
