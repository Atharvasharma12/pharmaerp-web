import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getCategoryMasters,
  getCategoryMasterById,
  getCategoryMasterBySlug,
} from "./categoryMasterThunk";

const initialState = {
  categoryMasters: [],
  currentCategoryMaster: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getCategoryMastersStatus: API_STATUS.IDLE,
  getCategoryMasterStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const categoryMasterSlice = createSlice({
  name: "categoryMaster",

  initialState,

  reducers: {
    clearCategoryMasterError(state) {
      state.error = null;
    },

    clearCategoryMasterMessage(state) {
      state.message = null;
    },

    setCurrentCategoryMaster(state, action) {
      state.currentCategoryMaster = action.payload || null;
    },

    clearCurrentCategoryMaster(state) {
      state.currentCategoryMaster = null;
    },

    clearCategoryMasters(state) {
      state.categoryMasters = [];

      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------------
      // GET CATEGORY MASTERS (LIST)
      // ---------------------
      .addCase(getCategoryMasters.pending, (state) => {
        state.getCategoryMastersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getCategoryMasters.fulfilled, (state, action) => {
        state.getCategoryMastersStatus = API_STATUS.SUCCESS;

        state.categoryMasters = action.payload?.categoryMasters || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "Category master records fetched successfully";
      })
      .addCase(getCategoryMasters.rejected, (state, action) => {
        state.getCategoryMastersStatus = API_STATUS.ERROR;
        state.error =
          action.payload || "Failed to fetch category master records";
      })

      // ---------------------
      // GET CATEGORY MASTER BY ID
      // ---------------------
      .addCase(getCategoryMasterById.pending, (state) => {
        setPending(state);
        state.getCategoryMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getCategoryMasterById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getCategoryMasterStatus = API_STATUS.SUCCESS;

        state.currentCategoryMaster = action.payload || null;

        state.message = "Category master record fetched successfully";
      })
      .addCase(getCategoryMasterById.rejected, (state, action) => {
        setRejected(state, action);
        state.getCategoryMasterStatus = API_STATUS.ERROR;
      })

      // ---------------------
      // GET CATEGORY MASTER BY SLUG
      // ---------------------
      .addCase(getCategoryMasterBySlug.pending, (state) => {
        setPending(state);
        state.getCategoryMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getCategoryMasterBySlug.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getCategoryMasterStatus = API_STATUS.SUCCESS;

        state.currentCategoryMaster = action.payload || null;

        state.message = "Category master record fetched successfully";
      })
      .addCase(getCategoryMasterBySlug.rejected, (state, action) => {
        setRejected(state, action);
        state.getCategoryMasterStatus = API_STATUS.ERROR;
      });
  },
});

export const {
  clearCategoryMasterError,
  clearCategoryMasterMessage,
  setCurrentCategoryMaster,
  clearCurrentCategoryMaster,
  clearCategoryMasters,
} = categoryMasterSlice.actions;

export default categoryMasterSlice.reducer;
