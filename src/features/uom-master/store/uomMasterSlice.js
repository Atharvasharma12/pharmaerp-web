import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import { getUomMasters, getUomMasterById } from "./uomMasterThunk";

const initialState = {
  uomMasters: [],
  currentUomMaster: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getUomMastersStatus: API_STATUS.IDLE,
  getUomMasterStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const uomMasterSlice = createSlice({
  name: "uomMaster",

  initialState,

  reducers: {
    clearUomMasterError(state) {
      state.error = null;
    },

    clearUomMasterMessage(state) {
      state.message = null;
    },

    setCurrentUomMaster(state, action) {
      state.currentUomMaster = action.payload || null;
    },

    clearCurrentUomMaster(state) {
      state.currentUomMaster = null;
    },

    clearUomMasters(state) {
      state.uomMasters = [];

      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------------
      // GET UOM MASTERS (LIST)
      // ---------------------
      .addCase(getUomMasters.pending, (state) => {
        state.getUomMastersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getUomMasters.fulfilled, (state, action) => {
        state.getUomMastersStatus = API_STATUS.SUCCESS;

        state.uomMasters = action.payload?.uomMasters || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "UOM master records fetched successfully";
      })
      .addCase(getUomMasters.rejected, (state, action) => {
        state.getUomMastersStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch UOM master records";
      })

      // ---------------------
      // GET UOM MASTER BY ID
      // ---------------------
      .addCase(getUomMasterById.pending, (state) => {
        setPending(state);
        state.getUomMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getUomMasterById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getUomMasterStatus = API_STATUS.SUCCESS;

        state.currentUomMaster = action.payload || null;

        state.message = "UOM master record fetched successfully";
      })
      .addCase(getUomMasterById.rejected, (state, action) => {
        setRejected(state, action);
        state.getUomMasterStatus = API_STATUS.ERROR;
      });
  },
});

export const {
  clearUomMasterError,
  clearUomMasterMessage,
  setCurrentUomMaster,
  clearCurrentUomMaster,
  clearUomMasters,
} = uomMasterSlice.actions;

export default uomMasterSlice.reducer;
