// src/features/marketplace/products/store/marketplaceProductSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/constants";

import {
  getMarketplaceProducts,
  getMarketplaceProductById,
  enableMarketplaceProduct,
  updateMarketplaceProduct,
  disableMarketplaceProduct,
} from "./marketplaceProductThunk";

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

  getMarketplaceProductsStatus: API_STATUS.IDLE,
  getMarketplaceProductStatus: API_STATUS.IDLE,
  enableMarketplaceProductStatus: API_STATUS.IDLE,
  updateMarketplaceProductStatus: API_STATUS.IDLE,
  disableMarketplaceProductStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const updateProductInState = (state, updatedProduct) => {
  if (!updatedProduct || !updatedProduct._id) return;

  if (state.currentProduct?._id === updatedProduct._id) {
    state.currentProduct = updatedProduct;
  }

  state.products = state.products.map((product) =>
    product._id === updatedProduct._id ? updatedProduct : product,
  );
};

const marketplaceProductSlice = createSlice({
  name: "marketplaceProduct",

  initialState,

  reducers: {
    clearMarketplaceProductError(state) {
      state.error = null;
    },

    clearMarketplaceProductMessage(state) {
      state.message = null;
    },

    setCurrentMarketplaceProduct(state, action) {
      state.currentProduct = action.payload || null;
    },

    clearCurrentMarketplaceProduct(state) {
      state.currentProduct = null;
    },

    clearMarketplaceProducts(state) {
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
      // GET PRODUCTS
      // =====================================================
      .addCase(getMarketplaceProducts.pending, (state) => {
        state.getMarketplaceProductsStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getMarketplaceProducts.fulfilled, (state, action) => {
        state.getMarketplaceProductsStatus = API_STATUS.SUCCESS;

        const data = action.payload;
        if (Array.isArray(data)) {
          state.products = data;
          state.total = data.length;
          state.page = 1;
          state.limit = 20;
          state.totalPages = 1;
        } else {
          state.products = data?.products || data?.docs || [];
          state.total = data?.total || data?.totalDocs || 0;
          state.page = data?.page || 1;
          state.limit = data?.limit || 20;
          state.totalPages = data?.totalPages || 1;
        }

        state.message = "Marketplace products fetched successfully";
      })
      .addCase(getMarketplaceProducts.rejected, (state, action) => {
        state.getMarketplaceProductsStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch marketplace products";
      })

      // =====================================================
      // GET PRODUCT BY ID
      // =====================================================
      .addCase(getMarketplaceProductById.pending, (state) => {
        setPending(state);
        state.getMarketplaceProductStatus = API_STATUS.LOADING;
      })
      .addCase(getMarketplaceProductById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getMarketplaceProductStatus = API_STATUS.SUCCESS;
        state.currentProduct = action.payload || null;
        state.message = "Marketplace product details fetched successfully";
      })
      .addCase(getMarketplaceProductById.rejected, (state, action) => {
        setRejected(state, action);
        state.getMarketplaceProductStatus = API_STATUS.ERROR;
      })

      // =====================================================
      // ENABLE PRODUCT
      // =====================================================
      .addCase(enableMarketplaceProduct.pending, (state) => {
        state.enableMarketplaceProductStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(enableMarketplaceProduct.fulfilled, (state, action) => {
        state.enableMarketplaceProductStatus = API_STATUS.SUCCESS;
        if (action.payload) {
          state.products.unshift(action.payload);
          state.currentProduct = action.payload;
        }
        state.message = "Marketplace product enabled successfully";
      })
      .addCase(enableMarketplaceProduct.rejected, (state, action) => {
        state.enableMarketplaceProductStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to enable marketplace product";
      })

      // =====================================================
      // UPDATE PRODUCT
      // =====================================================
      .addCase(updateMarketplaceProduct.pending, (state) => {
        state.updateMarketplaceProductStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateMarketplaceProduct.fulfilled, (state, action) => {
        state.updateMarketplaceProductStatus = API_STATUS.SUCCESS;
        updateProductInState(state, action.payload);
        state.message = "Marketplace product updated successfully";
      })
      .addCase(updateMarketplaceProduct.rejected, (state, action) => {
        state.updateMarketplaceProductStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update marketplace product";
      })

      // =====================================================
      // DISABLE PRODUCT
      // =====================================================
      .addCase(disableMarketplaceProduct.pending, (state) => {
        state.disableMarketplaceProductStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(disableMarketplaceProduct.fulfilled, (state, action) => {
        state.disableMarketplaceProductStatus = API_STATUS.SUCCESS;
        const deletedId = action.payload?.productId;
        state.products = state.products.filter((p) => p._id !== deletedId);
        if (state.currentProduct?._id === deletedId) {
          state.currentProduct = null;
        }
        state.message = "Marketplace product disabled successfully";
      })
      .addCase(disableMarketplaceProduct.rejected, (state, action) => {
        state.disableMarketplaceProductStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to disable marketplace product";
      });
  },
});

export const {
  clearMarketplaceProductError,
  clearMarketplaceProductMessage,
  setCurrentMarketplaceProduct,
  clearCurrentMarketplaceProduct,
  clearMarketplaceProducts,
} = marketplaceProductSlice.actions;

export default marketplaceProductSlice.reducer;
