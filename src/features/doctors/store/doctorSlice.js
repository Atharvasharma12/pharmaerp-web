import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/constants";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "./doctorThunk";

const initialState = {
  doctors: [],
  currentDoctor: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  summary: {
    totalDoctors: 0,
    activeDoctors: 0,
    hospitalsCount: 0,
    specialtiesCount: 0,
  },

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createDoctorStatus: API_STATUS.IDLE,
  getDoctorsStatus: API_STATUS.IDLE,
  getDoctorStatus: API_STATUS.IDLE,
  updateDoctorStatus: API_STATUS.IDLE,
  deleteDoctorStatus: API_STATUS.IDLE,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,

  reducers: {
    clearDoctorError(state) {
      state.error = null;
    },

    clearDoctorMessage(state) {
      state.message = null;
    },

    setCurrentDoctor(state, action) {
      state.currentDoctor = action.payload;
    },

    resetDoctorState() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createDoctor.pending, (state) => {
        state.createDoctorStatus = API_STATUS.PENDING;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.createDoctorStatus = API_STATUS.FULFILLED;
        if (action.payload) {
          state.doctors.unshift(action.payload);
          state.total += 1;
        }
        state.message = "Doctor created successfully";
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.createDoctorStatus = API_STATUS.REJECTED;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getDoctors.pending, (state) => {
        state.getDoctorsStatus = API_STATUS.PENDING;
        state.error = null;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.getDoctorsStatus = API_STATUS.FULFILLED;
        state.doctors = action.payload?.doctors || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.limit || 20;
        state.totalPages = action.payload?.totalPages || 1;
        if (action.payload?.summary) {
          state.summary = action.payload.summary;
        }
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.getDoctorsStatus = API_STATUS.REJECTED;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getDoctorById.pending, (state) => {
        state.getDoctorStatus = API_STATUS.PENDING;
        state.error = null;
      })
      .addCase(getDoctorById.fulfilled, (state, action) => {
        state.getDoctorStatus = API_STATUS.FULFILLED;
        state.currentDoctor = action.payload;
      })
      .addCase(getDoctorById.rejected, (state, action) => {
        state.getDoctorStatus = API_STATUS.REJECTED;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDoctor.pending, (state) => {
        state.updateDoctorStatus = API_STATUS.PENDING;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.updateDoctorStatus = API_STATUS.FULFILLED;
        if (action.payload) {
          const index = state.doctors.findIndex(
            (d) => (d._id || d.id) === (action.payload._id || action.payload.id)
          );
          if (index !== -1) {
            state.doctors[index] = action.payload;
          }
          if (
            state.currentDoctor &&
            (state.currentDoctor._id || state.currentDoctor.id) ===
              (action.payload._id || action.payload.id)
          ) {
            state.currentDoctor = action.payload;
          }
        }
        state.message = "Doctor updated successfully";
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.updateDoctorStatus = API_STATUS.REJECTED;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteDoctor.pending, (state) => {
        state.deleteDoctorStatus = API_STATUS.PENDING;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.deleteDoctorStatus = API_STATUS.FULFILLED;
        state.doctors = state.doctors.filter(
          (d) => (d._id || d.id) !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
        if (
          state.currentDoctor &&
          (state.currentDoctor._id || state.currentDoctor.id) === action.payload
        ) {
          state.currentDoctor = null;
        }
        state.message = "Doctor deleted successfully";
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.deleteDoctorStatus = API_STATUS.REJECTED;
        state.error = action.payload;
      });
  },
});

export const {
  clearDoctorError,
  clearDoctorMessage,
  setCurrentDoctor,
  resetDoctorState,
} = doctorSlice.actions;

export default doctorSlice.reducer;
