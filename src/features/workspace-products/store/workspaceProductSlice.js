import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  searchBeforeCreateWorkspaceProduct,
  createWorkspaceProduct,
  getWorkspaceProducts,
  getWorkspaceProductById,
  getWorkspaceProductByCode,
  updateWorkspaceProduct,
  deleteWorkspaceProduct,
} from "./workspaceProductThunk";

const initialState = {
  products: [],
  currentProduct: null,

  // Search Before Create
  searchBeforeCreateResult: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  searchBeforeCreateStatus: API_STATUS.IDLE,
  createWorkspaceProductStatus: API_STATUS.IDLE,
  getWorkspaceProductsStatus: API_STATUS.IDLE,
  getWorkspaceProductStatus: API_STATUS.IDLE,
  updateWorkspaceProductStatus: API_STATUS.IDLE,
  deleteWorkspaceProductStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const workspaceProductSlice = createSlice({
  name: "workspaceProduct",

  initialState,

  reducers: {
    clearWorkspaceProductError(state) {
      state.error = null;
    },

    clearWorkspaceProductMessage(state) {
      state.message = null;
    },

    clearSearchBeforeCreateResult(state) {
      state.searchBeforeCreateResult = null;
      state.searchBeforeCreateStatus = API_STATUS.IDLE;
    },

    setCurrentWorkspaceProduct(state, action) {
      state.currentProduct = action.payload || null;
    },

    clearCurrentWorkspaceProduct(state) {
      state.currentProduct = null;
    },

    clearWorkspaceProducts(state) {
      state.products = [];
      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================================================
      // SEARCH BEFORE CREATE
      // =====================================================

      .addCase(searchBeforeCreateWorkspaceProduct.pending, (state) => {
        state.searchBeforeCreateStatus = API_STATUS.LOADING;
        state.error = null;
      })

      .addCase(
        searchBeforeCreateWorkspaceProduct.fulfilled,
        (state, action) => {
          state.searchBeforeCreateStatus = API_STATUS.SUCCESS;

          state.searchBeforeCreateResult = action.payload || null;
        },
      )

      .addCase(searchBeforeCreateWorkspaceProduct.rejected, (state, action) => {
        state.searchBeforeCreateStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to search matching products";
      })

      // =====================================================
      // CREATE
      // =====================================================

      .addCase(createWorkspaceProduct.pending, (state) => {
        state.createWorkspaceProductStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })

      .addCase(createWorkspaceProduct.fulfilled, (state, action) => {
        state.createWorkspaceProductStatus = API_STATUS.SUCCESS;

        if (action.payload) {
          state.products.unshift(action.payload);
          state.currentProduct = action.payload;
        }

        state.message = "Workspace product created successfully";
      })

      .addCase(createWorkspaceProduct.rejected, (state, action) => {
        state.createWorkspaceProductStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to create workspace product";
      })

      // =====================================================
      // GET PRODUCTS
      // =====================================================

      .addCase(getWorkspaceProducts.pending, (state) => {
        state.getWorkspaceProductsStatus = API_STATUS.LOADING;
        state.error = null;
      })

      .addCase(getWorkspaceProducts.fulfilled, (state, action) => {
        state.getWorkspaceProductsStatus = API_STATUS.SUCCESS;

        state.products = action.payload?.products || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "Workspace products fetched successfully";
      })

      .addCase(getWorkspaceProducts.rejected, (state, action) => {
        state.getWorkspaceProductsStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to fetch workspace products";
      })

      // =====================================================
      // GET PRODUCT BY ID
      // =====================================================

      .addCase(getWorkspaceProductById.pending, (state) => {
        setPending(state);

        state.getWorkspaceProductStatus = API_STATUS.LOADING;
      })

      .addCase(getWorkspaceProductById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;

        state.getWorkspaceProductStatus = API_STATUS.SUCCESS;

        state.currentProduct = action.payload || null;

        state.message = "Workspace product fetched successfully";
      })

      .addCase(getWorkspaceProductById.rejected, (state, action) => {
        setRejected(state, action);

        state.getWorkspaceProductStatus = API_STATUS.ERROR;
      })

      // =====================================================
      // GET PRODUCT BY CODE
      // =====================================================

      .addCase(getWorkspaceProductByCode.pending, (state) => {
        setPending(state);

        state.getWorkspaceProductStatus = API_STATUS.LOADING;
      })

      .addCase(getWorkspaceProductByCode.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;

        state.getWorkspaceProductStatus = API_STATUS.SUCCESS;

        state.currentProduct = action.payload || null;

        state.message = "Workspace product fetched successfully";
      })

      .addCase(getWorkspaceProductByCode.rejected, (state, action) => {
        setRejected(state, action);

        state.getWorkspaceProductStatus = API_STATUS.ERROR;
      })

      // =====================================================
      // UPDATE
      // =====================================================

      .addCase(updateWorkspaceProduct.pending, (state) => {
        state.updateWorkspaceProductStatus = API_STATUS.LOADING;

        state.error = null;
        state.message = null;
      })

      .addCase(updateWorkspaceProduct.fulfilled, (state, action) => {
        state.updateWorkspaceProductStatus = API_STATUS.SUCCESS;

        state.currentProduct = action.payload || state.currentProduct;

        state.products = state.products.map((product) =>
          product._id === action.payload?._id ? action.payload : product,
        );

        state.message = "Workspace product updated successfully";
      })

      .addCase(updateWorkspaceProduct.rejected, (state, action) => {
        state.updateWorkspaceProductStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to update workspace product";
      })

      // =====================================================
      // DELETE
      // =====================================================

      .addCase(deleteWorkspaceProduct.pending, (state) => {
        state.deleteWorkspaceProductStatus = API_STATUS.LOADING;

        state.error = null;
        state.message = null;
      })

      .addCase(deleteWorkspaceProduct.fulfilled, (state, action) => {
        state.deleteWorkspaceProductStatus = API_STATUS.SUCCESS;

        state.products = state.products.filter(
          (product) => product._id !== action.payload.productId,
        );

        if (state.currentProduct?._id === action.payload.productId) {
          state.currentProduct = null;
        }

        state.message = "Workspace product deleted successfully";
      })

      .addCase(deleteWorkspaceProduct.rejected, (state, action) => {
        state.deleteWorkspaceProductStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to delete workspace product";
      });
  },
});

export const {
  clearWorkspaceProductError,
  clearWorkspaceProductMessage,
  clearSearchBeforeCreateResult,
  setCurrentWorkspaceProduct,
  clearCurrentWorkspaceProduct,
  clearWorkspaceProducts,
} = workspaceProductSlice.actions;

export default workspaceProductSlice.reducer;
