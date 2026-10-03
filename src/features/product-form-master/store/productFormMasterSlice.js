import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getProductFormMasters,
  getProductFormMasterById,
} from "./productFormMasterThunk";

const initialState = {
  productFormMasters: [],
  currentProductFormMaster: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getProductFormMastersStatus: API_STATUS.IDLE,
  getProductFormMasterStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const productFormMasterSlice = createSlice({
  name: "productFormMaster",
  initialState,

  reducers: {
    clearProductFormMasterError(state) {
      state.error = null;
    },

    clearProductFormMasterMessage(state) {
      state.message = null;
    },

    setCurrentProductFormMaster(state, action) {
      state.currentProductFormMaster = action.payload || null;
    },

    clearCurrentProductFormMaster(state) {
      state.currentProductFormMaster = null;
    },

    clearProductFormMasters(state) {
      state.productFormMasters = [];

      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------------
      // GET PRODUCT FORM MASTERS (LIST)
      // ---------------------
      .addCase(getProductFormMasters.pending, (state) => {
        state.getProductFormMastersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getProductFormMasters.fulfilled, (state, action) => {
        state.getProductFormMastersStatus = API_STATUS.SUCCESS;

        state.productFormMasters = action.payload?.productFormMasters || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "Product form master records fetched successfully";
      })
      .addCase(getProductFormMasters.rejected, (state, action) => {
        state.getProductFormMastersStatus = API_STATUS.ERROR;
        state.error =
          action.payload || "Failed to fetch product form master records";
      })

      // ---------------------
      // GET PRODUCT FORM MASTER BY ID
      // ---------------------
      .addCase(getProductFormMasterById.pending, (state) => {
        setPending(state);
        state.getProductFormMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getProductFormMasterById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getProductFormMasterStatus = API_STATUS.SUCCESS;

        state.currentProductFormMaster = action.payload || null;

        state.message = "Product form master record fetched successfully";
      })
      .addCase(getProductFormMasterById.rejected, (state, action) => {
        setRejected(state, action);
        state.getProductFormMasterStatus = API_STATUS.ERROR;
      });
  },
});

export const {
  clearProductFormMasterError,
  clearProductFormMasterMessage,
  setCurrentProductFormMaster,
  clearCurrentProductFormMaster,
  clearProductFormMasters,
} = productFormMasterSlice.actions;

export default productFormMasterSlice.reducer;
