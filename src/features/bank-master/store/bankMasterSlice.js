import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";

import {
  getBankMasters,
  getBankMasterById,
  getBankMasterByName,
} from "./bankMasterThunk";

const initialState = {
  bankMasters: [],
  currentBankMaster: null,

  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  getBankMastersStatus: API_STATUS.IDLE,
  getBankMasterStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const bankMasterSlice = createSlice({
  name: "bankMaster",

  initialState,

  reducers: {
    clearBankMasterError(state) {
      state.error = null;
    },

    clearBankMasterMessage(state) {
      state.message = null;
    },

    setCurrentBankMaster(state, action) {
      state.currentBankMaster = action.payload || null;
    },

    clearCurrentBankMaster(state) {
      state.currentBankMaster = null;
    },

    clearBankMasters(state) {
      state.bankMasters = [];

      state.total = 0;
      state.page = 1;
      state.limit = 20;
      state.totalPages = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------------------
      // GET BANK MASTERS (LIST)
      // ---------------------
      .addCase(getBankMasters.pending, (state) => {
        state.getBankMastersStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getBankMasters.fulfilled, (state, action) => {
        state.getBankMastersStatus = API_STATUS.SUCCESS;

        state.bankMasters = action.payload?.bankMasters || [];

        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 0;

        state.message = "Bank master records fetched successfully";
      })
      .addCase(getBankMasters.rejected, (state, action) => {
        state.getBankMastersStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch bank master records";
      })

      // ---------------------
      // GET BANK MASTER BY ID
      // ---------------------
      .addCase(getBankMasterById.pending, (state) => {
        setPending(state);
        state.getBankMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getBankMasterById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getBankMasterStatus = API_STATUS.SUCCESS;

        state.currentBankMaster = action.payload || null;

        state.message = "Bank master record fetched successfully";
      })
      .addCase(getBankMasterById.rejected, (state, action) => {
        setRejected(state, action);
        state.getBankMasterStatus = API_STATUS.ERROR;
      })

      // ---------------------
      // GET BANK MASTER BY NAME
      // ---------------------
      .addCase(getBankMasterByName.pending, (state) => {
        setPending(state);
        state.getBankMasterStatus = API_STATUS.LOADING;
      })
      .addCase(getBankMasterByName.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getBankMasterStatus = API_STATUS.SUCCESS;

        state.currentBankMaster = action.payload || null;

        state.message = "Bank master record fetched successfully";
      })
      .addCase(getBankMasterByName.rejected, (state, action) => {
        setRejected(state, action);
        state.getBankMasterStatus = API_STATUS.ERROR;
      });
  },
});

export const {
  clearBankMasterError,
  clearBankMasterMessage,
  setCurrentBankMaster,
  clearCurrentBankMaster,
  clearBankMasters,
} = bankMasterSlice.actions;

export default bankMasterSlice.reducer;
