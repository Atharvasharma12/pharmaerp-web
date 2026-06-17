import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getHsnMasters,
  getHsnMasterById,
  getHsnMasterByCode,
} from "./hsnMasterThunk";

const initialState = {
  hsnMasters: [],
  currentHsnMaster: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getHsnMastersStatus: API_STATUS.IDLE,
  getHsnMasterStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const hsnMasterSlice = createSlice({
  name: "hsnMaster",
  initialState,

  reducers: {
    clearHsnMasterError(state) {
      state.error = null;
    },

    clearHsnMasterMessage(state) {
      state.message = null;
    },

    setCurrentHsnMaster(state, action) {
      state.currentHsnMaster = action.payload || null;
    },

    clearCurrentHsnMaster(state) {
      state.currentHsnMaster = null;
    },

    clearHsnMasters(state) {
      state.hsnMasters = [];
      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------------
      // GET HSN MASTERS (LIST)
      // ---------------------
      .addCase(getHsnMasters.pending, (state) => {
        state.getHsnMastersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getHsnMasters.fulfilled, (state, action) => {
        state.getHsnMastersStatus = API_STATUS.SUCCESS;

        state.hsnMasters = action.payload?.hsnMasters || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "HSN master records fetched successfully";
      })
      .addCase(getHsnMasters.rejected, (state, action) => {
        state.getHsnMastersStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch HSN master records";
      })

      // ---------------------
      // GET HSN MASTER BY ID
      // ---------------------
      .addCase(getHsnMasterById.pending, (state) => {
        setPending(state);
        state.getHsnMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getHsnMasterById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getHsnMasterStatus = API_STATUS.SUCCESS;

        state.currentHsnMaster = action.payload || null;

        state.message = "HSN master record fetched successfully";
      })
      .addCase(getHsnMasterById.rejected, (state, action) => {
        setRejected(state, action);
        state.getHsnMasterStatus = API_STATUS.ERROR;
      })

      // ---------------------
      // GET HSN MASTER BY CODE
      // ---------------------
      .addCase(getHsnMasterByCode.pending, (state) => {
        setPending(state);
        state.getHsnMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getHsnMasterByCode.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getHsnMasterStatus = API_STATUS.SUCCESS;

        state.currentHsnMaster = action.payload || null;

        state.message = "HSN master record fetched successfully";
      })
      .addCase(getHsnMasterByCode.rejected, (state, action) => {
        setRejected(state, action);
        state.getHsnMasterStatus = API_STATUS.ERROR;
      });
  },
});

export const {
  clearHsnMasterError,
  clearHsnMasterMessage,
  setCurrentHsnMaster,
  clearCurrentHsnMaster,
  clearHsnMasters,
} = hsnMasterSlice.actions;

export default hsnMasterSlice.reducer;
