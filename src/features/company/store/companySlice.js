import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "@/constants";
import {
  createCompany,
  getWorkspaceCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "./companyThunk";

const initialState = {
  companies: [],
  currentCompany: null,
  managedCompany: null,

  status: API_STATUS.IDLE,
  error: null,
  message: null,

  createCompanyStatus: API_STATUS.IDLE,
  getWorkspaceCompaniesStatus: API_STATUS.IDLE,
  getCompanyStatus: API_STATUS.IDLE,
  updateCompanyStatus: API_STATUS.IDLE,
  deleteCompanyStatus: API_STATUS.IDLE,
};

const setPending = (state) => {
  state.status = API_STATUS.LOADING;
  state.error = null;
  state.message = null;
};

const setRejected = (state, action) => {
  state.status = API_STATUS.ERROR;
  state.error = action.payload || "Something went wrong";
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyError(state) {
      state.error = null;
    },
    clearCompanyMessage(state) {
      state.message = null;
    },
    setCurrentCompany(state, action) {
      state.currentCompany = action.payload || null;
    },
    clearCurrentCompany(state) {
      state.currentCompany = null;
    },
    clearCompanies(state) {
      state.companies = [];
    },
    clearManagedCompany(state) {
      state.managedCompany = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE COMPANY
      .addCase(createCompany.pending, (state) => {
        state.createCompanyStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.createCompanyStatus = API_STATUS.SUCCESS;
        state.currentCompany = action.payload || null;
        if (action.payload) {
          state.companies.unshift(action.payload);
        }
        state.message = "Company created successfully";
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.createCompanyStatus = API_STATUS.ERROR;
        state.error = action.payload || "Company creation failed";
      })

      // GET WORKSPACE COMPANIES
      .addCase(getWorkspaceCompanies.pending, (state) => {
        state.getWorkspaceCompaniesStatus = API_STATUS.LOADING;
        state.error = null;
      })
      .addCase(getWorkspaceCompanies.fulfilled, (state, action) => {
        state.getWorkspaceCompaniesStatus = API_STATUS.SUCCESS;
        state.companies = action.payload || [];

        // Keep active company in memory if already set; otherwise let layout handle initial assignment
        state.currentCompany = state.currentCompany || null;
        state.message = "Companies fetched successfully";
      })
      .addCase(getWorkspaceCompanies.rejected, (state, action) => {
        state.getWorkspaceCompaniesStatus = API_STATUS.ERROR;
        state.error = action.payload || "Failed to fetch companies";
      })

      // GET COMPANY BY ID
      .addCase(getCompanyById.pending, setPending)
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.status = API_STATUS.SUCCESS;
        state.getCompanyStatus = API_STATUS.SUCCESS;
        state.managedCompany = action.payload || null;
        state.message = "Company fetched successfully";
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        setRejected(state, action);
        state.getCompanyStatus = API_STATUS.ERROR;
      })

      // UPDATE COMPANY
      .addCase(updateCompany.pending, (state) => {
        state.updateCompanyStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.updateCompanyStatus = API_STATUS.SUCCESS;
        state.companies = state.companies.map((company) =>
          company?._id === action.payload?._id ? action.payload : company,
        );
        state.managedCompany = action.payload || state.managedCompany;

        if (
          state.currentCompany?._id === action.payload?._id &&
          action.payload
        ) {
          state.currentCompany = action.payload;
        }
        state.message = "Company updated successfully";
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.updateCompanyStatus = API_STATUS.ERROR;
        state.error = action.payload || "Company update failed";
      })

      // DELETE COMPANY
      .addCase(deleteCompany.pending, (state) => {
        state.deleteCompanyStatus = API_STATUS.LOADING;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.deleteCompanyStatus = API_STATUS.SUCCESS;
        state.companies = state.companies.filter(
          (company) => company?._id !== action.meta.arg,
        );
        if (state.managedCompany?._id === action.meta.arg) {
          state.managedCompany = null;
        }
        if (state.currentCompany?._id === action.meta.arg) {
          state.currentCompany = null;
        }
        state.message = "Company deleted successfully";
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.deleteCompanyStatus = API_STATUS.ERROR;
        state.error = action.payload || "Company delete failed";
      });
  },
});

export const {
  clearCompanyError,
  clearCompanyMessage,
  setCurrentCompany,
  clearCurrentCompany,
  clearCompanies,
  clearManagedCompany,
} = companySlice.actions;

export default companySlice.reducer;
