import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getManufacturerMasters,
  getManufacturerMasterById,
  getManufacturerMasterByName,
} from "./manufacturerMasterThunk";

const initialState = {
  manufacturerMasters: [],
  currentManufacturerMaster: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getManufacturerMastersStatus: API_STATUS.IDLE,
  getManufacturerMasterStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const manufacturerMasterSlice = createSlice({
  name: "manufacturerMaster",

  initialState,

  reducers: {
    clearManufacturerMasterError(state) {
      state.error = null;
    },

    clearManufacturerMasterMessage(state) {
      state.message = null;
    },

    setCurrentManufacturerMaster(state, action) {
      state.currentManufacturerMaster = action.payload || null;
    },

    clearCurrentManufacturerMaster(state) {
      state.currentManufacturerMaster = null;
    },

    clearManufacturerMasters(state) {
      state.manufacturerMasters = [];

      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------------
      // GET MANUFACTURER MASTERS (LIST)
      // ---------------------
      .addCase(getManufacturerMasters.pending, (state) => {
        state.getManufacturerMastersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getManufacturerMasters.fulfilled, (state, action) => {
        state.getManufacturerMastersStatus = API_STATUS.SUCCESS;

        state.manufacturerMasters = action.payload?.manufacturerMasters || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "Manufacturer master records fetched successfully";
      })
      .addCase(getManufacturerMasters.rejected, (state, action) => {
        state.getManufacturerMastersStatus = API_STATUS.ERROR;
        state.error =
          action.payload || "Failed to fetch manufacturer master records";
      })

      // ---------------------
      // GET MANUFACTURER MASTER BY ID
      // ---------------------
      .addCase(getManufacturerMasterById.pending, (state) => {
        setPending(state);
        state.getManufacturerMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getManufacturerMasterById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getManufacturerMasterStatus = API_STATUS.SUCCESS;

        state.currentManufacturerMaster = action.payload || null;

        state.message = "Manufacturer master record fetched successfully";
      })
      .addCase(getManufacturerMasterById.rejected, (state, action) => {
        setRejected(state, action);
        state.getManufacturerMasterStatus = API_STATUS.ERROR;
      })

      // ---------------------
      // GET MANUFACTURER MASTER BY NAME
      // ---------------------
      .addCase(getManufacturerMasterByName.pending, (state) => {
        setPending(state);
        state.getManufacturerMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getManufacturerMasterByName.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getManufacturerMasterStatus = API_STATUS.SUCCESS;

        state.currentManufacturerMaster = action.payload || null;

        state.message = "Manufacturer master record fetched successfully";
      })
      .addCase(getManufacturerMasterByName.rejected, (state, action) => {
        setRejected(state, action);
        state.getManufacturerMasterStatus = API_STATUS.ERROR;
      });
  },
});

export const {
  clearManufacturerMasterError,
  clearManufacturerMasterMessage,
  setCurrentManufacturerMaster,
  clearCurrentManufacturerMaster,
  clearManufacturerMasters,
} = manufacturerMasterSlice.actions;

export default manufacturerMasterSlice.reducer;
