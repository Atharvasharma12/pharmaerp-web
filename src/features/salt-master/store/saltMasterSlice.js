import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getSaltMasters,
  getSaltMasterById,
  getSaltMasterByName,
} from "./saltMasterThunk";

const initialState = {
  saltMasters: [],
  currentSaltMaster: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getSaltMastersStatus: API_STATUS.IDLE,
  getSaltMasterStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const saltMasterSlice = createSlice({
  name: "saltMaster",

  initialState,

  reducers: {
    clearSaltMasterError(state) {
      state.error = null;
    },

    clearSaltMasterMessage(state) {
      state.message = null;
    },

    setCurrentSaltMaster(state, action) {
      state.currentSaltMaster = action.payload || null;
    },

    clearCurrentSaltMaster(state) {
      state.currentSaltMaster = null;
    },

    clearSaltMasters(state) {
      state.saltMasters = [];

      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------------
      // GET SALT MASTERS (LIST)
      // ---------------------
      .addCase(getSaltMasters.pending, (state) => {
        state.getSaltMastersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getSaltMasters.fulfilled, (state, action) => {
        state.getSaltMastersStatus = API_STATUS.SUCCESS;

        state.saltMasters = action.payload?.saltMasters || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "Salt master records fetched successfully";
      })
      .addCase(getSaltMasters.rejected, (state, action) => {
        state.getSaltMastersStatus = API_STATUS.ERROR;

        state.error = action.payload || "Failed to fetch salt master records";
      })

      // ---------------------
      // GET SALT MASTER BY ID
      // ---------------------
      .addCase(getSaltMasterById.pending, (state) => {
        setPending(state);

        state.getSaltMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getSaltMasterById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;

        state.getSaltMasterStatus = API_STATUS.SUCCESS;

        state.currentSaltMaster = action.payload || null;

        state.message = "Salt master record fetched successfully";
      })
      .addCase(getSaltMasterById.rejected, (state, action) => {
        setRejected(state, action);

        state.getSaltMasterStatus = API_STATUS.ERROR;
      })

      // ---------------------
      // GET SALT MASTER BY NAME
      // ---------------------
      .addCase(getSaltMasterByName.pending, (state) => {
        setPending(state);

        state.getSaltMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getSaltMasterByName.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;

        state.getSaltMasterStatus = API_STATUS.SUCCESS;

        state.currentSaltMaster = action.payload || null;

        state.message = "Salt master record fetched successfully";
      })
      .addCase(getSaltMasterByName.rejected, (state, action) => {
        setRejected(state, action);

        state.getSaltMasterStatus = API_STATUS.ERROR;
      });
  },
});

export const {
  clearSaltMasterError,
  clearSaltMasterMessage,
  setCurrentSaltMaster,
  clearCurrentSaltMaster,
  clearSaltMasters,
} = saltMasterSlice.actions;

export default saltMasterSlice.reducer;
