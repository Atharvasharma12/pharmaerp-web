import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/constants";
import { getReport } from "./reportsThunk";

const initialState = {
  reportData: null,
  status: API_STATUS.IDLE,
  error: null,
  message: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportsError(state) {
      state.error = null;
    },
    clearReportsMessage(state) {
      state.message = null;
    },
    clearReportData(state) {
      state.reportData = null;
      state.status = API_STATUS.IDLE;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReport.pending, (state) => {
        state.status = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.reportData = action.payload;
        state.message = "Report generated successfully";
      })
      .addCase(getReport.rejected, (state, action) => {
        state.status = API_STATUS.ERROR;
        state.error = action.payload || "Failed to generate report";
      });
  },
});

export const { clearReportsError, clearReportsMessage, clearReportData } = reportsSlice.actions;
export default reportsSlice.reducer;
