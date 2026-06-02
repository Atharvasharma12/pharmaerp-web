import { createSlice } from "@reduxjs/toolkit";

import { API_STATUS } from "@/constants";
import { storage } from "@/utils";

import {
  createCompany,
  getWorkspaceCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "./companyThunk";

const COMPANY_STORAGE_KEY = "companyId";

const persistCurrentCompany = (company) => {
  if (company?._id) {
    storage.set(COMPANY_STORAGE_KEY, company._id);
  }
};

const removePersistedCompany = () => {
  storage.remove(COMPANY_STORAGE_KEY);
};

const initialState = {
  companies: [],
  currentCompany: null,

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

      if (state.currentCompany?._id) {
        persistCurrentCompany(state.currentCompany);
      } else {
        removePersistedCompany();
      }
    },

    clearCurrentCompany(state) {
      state.currentCompany = null;
      removePersistedCompany();
    },

    clearCompanies(state) {
      state.companies = [];
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
          persistCurrentCompany(action.payload);
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

        const firstCompany = state.companies[0] || null;

        state.currentCompany = state.currentCompany || firstCompany;

        if (state.currentCompany?._id) {
          persistCurrentCompany(state.currentCompany);
        } else {
          removePersistedCompany();
        }

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
        state.currentCompany = action.payload || null;

        if (action.payload?._id) {
          persistCurrentCompany(action.payload);
        } else {
          removePersistedCompany();
        }

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
        state.currentCompany = action.payload || state.currentCompany;

        state.companies = state.companies.map((company) =>
          company?._id === action.payload?._id ? action.payload : company,
        );

        if (state.currentCompany?._id) {
          persistCurrentCompany(state.currentCompany);
        } else {
          removePersistedCompany();
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

        if (state.currentCompany?._id === action.meta.arg) {
          state.currentCompany = null;
          removePersistedCompany();
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
} = companySlice.actions;

export default companySlice.reducer;
