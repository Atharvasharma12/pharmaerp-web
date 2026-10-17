import { createAsyncThunk } from "@reduxjs/toolkit";
import doctorService from "../services/doctorService";
import { getErrorMessage } from "@/utils";

export const createDoctor = createAsyncThunk(
  "doctor/createDoctor",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await doctorService.createDoctor(payload);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getDoctors = createAsyncThunk(
  "doctor/getDoctors",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctors(params);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getDoctorById = createAsyncThunk(
  "doctor/getDoctorById",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorById(doctorId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ doctorId, payload }, { rejectWithValue }) => {
    try {
      const response = await doctorService.updateDoctor(doctorId, payload);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteDoctor = createAsyncThunk(
  "doctor/deleteDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      await doctorService.deleteDoctor(doctorId);
      return doctorId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
