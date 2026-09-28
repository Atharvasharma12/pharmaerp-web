import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/constants";
import {
  createDayClosing,
  listDayClosings,
  getDayClosingById,
  updateDayClosingStatus,
} from "./dayClosingThunk";

const initialState = {
  dayClosings: [],
  currentDayClosing: null,
  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createDayClosingStatus: API_STATUS.IDLE,
  listDayClosingsStatus: API_STATUS.IDLE,
  getDayClosingStatus: API_STATUS.IDLE,
  updateDayClosingStatusStatus: API_STATUS.IDLE,
};

const dayClosingSlice = createSlice({
  name: "dayClosing",
  initialState,
  reducers: {
    clearDayClosingError(state) {
      state.error = null;
    },
    clearDayClosingMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createDayClosing.pending, (state) => {
        state.createDayClosingStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(createDayClosing.fulfilled, (state, action) => {
        state.createDayClosingStatus = API_STATUS.SUCCESS;
        if (action.payload) {
          state.dayClosings.unshift(action.payload);
        }
        state.message = "Day closing created successfully";
      })
      .addCase(createDayClosing.rejected, (state, action) => {
        state.createDayClosingStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to create day closing";
      })
      // LIST
      .addCase(listDayClosings.pending, (state) => {
        state.listDayClosingsStatus = API_STATUS.LOADING;
      })
      .addCase(listDayClosings.fulfilled, (state, action) => {
        state.listDayClosingsStatus = API_STATUS.SUCCESS;
        state.dayClosings = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(listDayClosings.rejected, (state, action) => {
        state.listDayClosingsStatus = API_STATUS.ERROR;
        state.error = action.payload;
      })
      // GET BY ID
      .addCase(getDayClosingById.pending, (state) => {
        state.getDayClosingStatus = API_STATUS.LOADING;
      })
      .addCase(getDayClosingById.fulfilled, (state, action) => {
        state.getDayClosingStatus = API_STATUS.SUCCESS;
        state.currentDayClosing = action.payload;
      })
      .addCase(getDayClosingById.rejected, (state, action) => {
        state.getDayClosingStatus = API_STATUS.ERROR;
        state.error = action.payload;
      })
      // UPDATE STATUS
      .addCase(updateDayClosingStatus.pending, (state) => {
        state.updateDayClosingStatusStatus = API_STATUS.LOADING;
      })
      .addCase(updateDayClosingStatus.fulfilled, (state, action) => {
        state.updateDayClosingStatusStatus = API_STATUS.SUCCESS;
        const updated = action.payload;
        state.dayClosings = state.dayClosings.map((d) => (d._id === updated._id ? updated : d));
        if (state.currentDayClosing?._id === updated._id) {
          state.currentDayClosing = updated;
        }
        state.message = "Day closing updated successfully";
      })
      .addCase(updateDayClosingStatus.rejected, (state, action) => {
        state.updateDayClosingStatusStatus = API_STATUS.ERROR;
        state.error = action.payload;
      });
  },
});

export const { clearDayClosingError, clearDayClosingMessage } = dayClosingSlice.actions;
export default dayClosingSlice.reducer;
