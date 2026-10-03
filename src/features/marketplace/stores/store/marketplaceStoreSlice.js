// src/features/marketplace/stores/store/marketplaceStoreSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/constants";

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
} from "./marketplaceStoreThunk";

const initialState = {
  stores: [],
  currentStore: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getMarketplaceStoresStatus: API_STATUS.IDLE,
  getMarketplaceStoreStatus: API_STATUS.IDLE,
  createMarketplaceStoreStatus: API_STATUS.IDLE,
  updateMarketplaceStoreStatus: API_STATUS.IDLE,
  deleteMarketplaceStoreStatus: API_STATUS.IDLE,
  statusToggleStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const updateStoreInState = (state, updatedStore) => {
  if (!updatedStore || !updatedStore._id) return;
  
  if (state.currentStore?._id === updatedStore._id) {
    state.currentStore = updatedStore;
  }

  state.stores = state.stores.map((store) =>
    store._id === updatedStore._id ? updatedStore : store,
  );
};

const marketplaceStoreSlice = createSlice({
  name: "marketplaceStore",

  initialState,

  reducers: {
    clearMarketplaceStoreError(state) {
      state.error = null;
    },

    clearMarketplaceStoreMessage(state) {
      state.message = null;
    },

    setCurrentMarketplaceStore(state, action) {
      state.currentStore = action.payload || null;
    },

    clearCurrentMarketplaceStore(state) {
      state.currentStore = null;
    },

    clearMarketplaceStores(state) {
      state.stores = [];
      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================================================
      // GET STORES
      // =====================================================
      .addCase(getMarketplaceStores.pending, (state) => {
        state.getMarketplaceStoresStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getMarketplaceStores.fulfilled, (state, action) => {
        state.getMarketplaceStoresStatus = API_STATUS.SUCCESS;

        const data = action.payload;
        if (Array.isArray(data)) {
          state.stores = data;
          state.total = data.length;
          state.page = 1;
          state.limit = 20;
          state.totalPages = 1;
        } else {
          state.stores = data?.stores || data?.docs || [];
          state.total = data?.total || data?.totalDocs || 0;
          state.page = data?.page || 1;
          state.limit = data?.limit || 20;
          state.totalPages = data?.totalPages || 1;
        }

        state.message = "Marketplace stores fetched successfully";
      })
      .addCase(getMarketplaceStores.rejected, (state, action) => {
        state.getMarketplaceStoresStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch marketplace stores";
      })

      // =====================================================
      // GET STORE BY ID
      // =====================================================
      .addCase(getMarketplaceStoreById.pending, (state) => {
        setPending(state);
        state.getMarketplaceStoreStatus = API_STATUS.LOADING;
      })
      .addCase(getMarketplaceStoreById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getMarketplaceStoreStatus = API_STATUS.SUCCESS;
        state.currentStore = action.payload || null;
        state.message = "Marketplace store details fetched successfully";
      })
      .addCase(getMarketplaceStoreById.rejected, (state, action) => {
        setRejected(state, action);
        state.getMarketplaceStoreStatus = API_STATUS.ERROR;
      })

      // =====================================================
      // CREATE STORE
      // =====================================================
      .addCase(createMarketplaceStore.pending, (state) => {
        state.createMarketplaceStoreStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createMarketplaceStore.fulfilled, (state, action) => {
        state.createMarketplaceStoreStatus = API_STATUS.SUCCESS;
        if (action.payload) {
          state.stores.unshift(action.payload);
          state.currentStore = action.payload;
        }
        state.message = "Marketplace store created successfully";
      })
      .addCase(createMarketplaceStore.rejected, (state, action) => {
        state.createMarketplaceStoreStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create marketplace store";
      })

      // =====================================================
      // UPDATE STORE
      // =====================================================
      .addCase(updateMarketplaceStore.pending, (state) => {
        state.updateMarketplaceStoreStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateMarketplaceStore.fulfilled, (state, action) => {
        state.updateMarketplaceStoreStatus = API_STATUS.SUCCESS;
        updateStoreInState(state, action.payload);
        state.message = "Marketplace store updated successfully";
      })
      .addCase(updateMarketplaceStore.rejected, (state, action) => {
        state.updateMarketplaceStoreStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to update marketplace store";
      })

      // =====================================================
      // DELETE STORE
      // =====================================================
      .addCase(deleteMarketplaceStore.pending, (state) => {
        state.deleteMarketplaceStoreStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteMarketplaceStore.fulfilled, (state, action) => {
        state.deleteMarketplaceStoreStatus = API_STATUS.SUCCESS;
        const deletedId = action.payload?.storeId;
        state.stores = state.stores.filter((store) => store._id !== deletedId);
        if (state.currentStore?._id === deletedId) {
          state.currentStore = null;
        }
        state.message = "Marketplace store deleted successfully";
      })
      .addCase(deleteMarketplaceStore.rejected, (state, action) => {
        state.deleteMarketplaceStoreStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to delete marketplace store";
      })

      // =====================================================
      // GO ONLINE
      // =====================================================
      .addCase(goOnlineMarketplaceStore.pending, (state) => {
        state.statusToggleStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(goOnlineMarketplaceStore.fulfilled, (state, action) => {
        state.statusToggleStatus = API_STATUS.SUCCESS;
        updateStoreInState(state, action.payload);
        state.message = "Store is now online";
      })
      .addCase(goOnlineMarketplaceStore.rejected, (state, action) => {
        state.statusToggleStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to set store online";
      })

      // =====================================================
      // GO OFFLINE
      // =====================================================
      .addCase(goOfflineMarketplaceStore.pending, (state) => {
        state.statusToggleStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(goOfflineMarketplaceStore.fulfilled, (state, action) => {
        state.statusToggleStatus = API_STATUS.SUCCESS;
        updateStoreInState(state, action.payload);
        state.message = "Store is now offline";
      })
      .addCase(goOfflineMarketplaceStore.rejected, (state, action) => {
        state.statusToggleStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to set store offline";
      })

      // =====================================================
      // PAUSE STORE
      // =====================================================
      .addCase(pauseMarketplaceStore.pending, (state) => {
        state.statusToggleStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(pauseMarketplaceStore.fulfilled, (state, action) => {
        state.statusToggleStatus = API_STATUS.SUCCESS;
        updateStoreInState(state, action.payload);
        state.message = "Store paused successfully";
      })
      .addCase(pauseMarketplaceStore.rejected, (state, action) => {
        state.statusToggleStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to pause store";
      })

      // =====================================================
      // RESUME STORE
      // =====================================================
      .addCase(resumeMarketplaceStore.pending, (state) => {
        state.statusToggleStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(resumeMarketplaceStore.fulfilled, (state, action) => {
        state.statusToggleStatus = API_STATUS.SUCCESS;
        updateStoreInState(state, action.payload);
        state.message = "Store resumed successfully";
      })
      .addCase(resumeMarketplaceStore.rejected, (state, action) => {
        state.statusToggleStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to resume store";
      });
  },
});

export const {
  clearMarketplaceStoreError,
  clearMarketplaceStoreMessage,
  setCurrentMarketplaceStore,
  clearCurrentMarketplaceStore,
  clearMarketplaceStores,
} = marketplaceStoreSlice.actions;

export default marketplaceStoreSlice.reducer;
