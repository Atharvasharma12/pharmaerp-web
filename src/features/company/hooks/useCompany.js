import { useDispatch, useSelector } from "react-redux";

import {
  createCompany,
  getWorkspaceCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../store/companyThunk";

import {
  clearCompanyError,
  clearCompanyMessage,
  setCurrentCompany,
  clearCurrentCompany,
  clearCompanies,
  clearManagedCompany, // Added clear reducer
} from "../store/companySlice";

import {
  selectCompanies,
  selectCurrentCompany,
  selectManagedCompany, // Added selector
  selectCompanyStatus,
  selectCompanyError,
  selectCompanyMessage,
  selectCreateCompanyStatus,
  selectGetWorkspaceCompaniesStatus,
  selectGetCompanyStatus,
  selectUpdateCompanyStatus,
  selectDeleteCompanyStatus,
} from "../store/companySelector";

const useCompany = () => {
  const dispatch = useDispatch();

  const companies = useSelector(selectCompanies);
  const currentCompany = useSelector(selectCurrentCompany);
  const managedCompany = useSelector(selectManagedCompany); // Added hook state

  const status = useSelector(selectCompanyStatus);
  const error = useSelector(selectCompanyError);
  const message = useSelector(selectCompanyMessage);

  const createCompanyStatus = useSelector(selectCreateCompanyStatus);
  const getWorkspaceCompaniesStatus = useSelector(
    selectGetWorkspaceCompaniesStatus,
  );
  const getCompanyStatus = useSelector(selectGetCompanyStatus);
  const updateCompanyStatus = useSelector(selectUpdateCompanyStatus);
  const deleteCompanyStatus = useSelector(selectDeleteCompanyStatus);

  const submitCreateCompany = (payload) => {
    return dispatch(createCompany(payload)).unwrap();
  };

  const fetchWorkspaceCompanies = () => {
    return dispatch(getWorkspaceCompanies()).unwrap();
  };

  const fetchCompanyById = (companyId) => {
    return dispatch(getCompanyById(companyId)).unwrap();
  };

  const submitUpdateCompany = (companyId, payload) => {
    return dispatch(
      updateCompany({
        companyId,
        payload,
      }),
    ).unwrap();
  };

  const submitDeleteCompany = (companyId) => {
    return dispatch(deleteCompany(companyId)).unwrap();
  };

  const clearError = () => {
    dispatch(clearCompanyError());
  };

  const clearMessage = () => {
    dispatch(clearCompanyMessage());
  };

  const saveCurrentCompany = (payload) => {
    dispatch(setCurrentCompany(payload));
  };

  const removeCurrentCompany = () => {
    dispatch(clearCurrentCompany());
  };

  const removeCompanies = () => {
    dispatch(clearCompanies());
  };

  const removeManagedCompany = () => {
    dispatch(clearManagedCompany());
  };

  return {
    companies,
    currentCompany,
    managedCompany, // Exposed management state

    status,
    error,
    message,

    createCompanyStatus,
    getWorkspaceCompaniesStatus,
    getCompanyStatus,
    updateCompanyStatus,
    deleteCompanyStatus,

    createCompany: submitCreateCompany,
    getWorkspaceCompanies: fetchWorkspaceCompanies,
    getCompanyById: fetchCompanyById,
    updateCompany: submitUpdateCompany,
    deleteCompany: submitDeleteCompany,

    clearError,
    clearMessage,

    setCurrentCompany: saveCurrentCompany,
    clearCurrentCompany: removeCurrentCompany,
    clearCompanies: removeCompanies,
    clearManagedCompany: removeManagedCompany, // Clean-up handler for pages
  };
};

export default useCompany;
