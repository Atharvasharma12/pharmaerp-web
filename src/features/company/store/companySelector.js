export const selectCompany = (state) => state.company;

export const selectCompanies = (state) => state.company.companies;

export const selectCurrentCompany = (state) => state.company.currentCompany;

// NEW: Added to select the company being viewed or edited separately
export const selectManagedCompany = (state) => state.company.managedCompany;

export const selectCompanyStatus = (state) => state.company.status;

export const selectCompanyError = (state) => state.company.error;

export const selectCompanyMessage = (state) => state.company.message;

export const selectCreateCompanyStatus = (state) =>
  state.company.createCompanyStatus;

export const selectGetWorkspaceCompaniesStatus = (state) =>
  state.company.getWorkspaceCompaniesStatus;

export const selectGetCompanyStatus = (state) => state.company.getCompanyStatus;

export const selectUpdateCompanyStatus = (state) =>
  state.company.updateCompanyStatus;

export const selectDeleteCompanyStatus = (state) =>
  state.company.deleteCompanyStatus;
