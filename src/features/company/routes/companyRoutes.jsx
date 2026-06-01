// src/features/company/routes/companyRoutes.js

import { ROUTES } from "@/constants";
import { ProtectedRoute } from "@/guards";

import {
  CompaniesPage,
  CreateCompanyPage,
  EditCompanyPage,
  CompanyDetailsPage,
  CompanySettingsPage,
} from "../pages";

const companyRoutes = [
  {
    path: ROUTES.COMPANIES,
    element: (
      <ProtectedRoute>
        <CompaniesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CREATE_COMPANY,
    element: (
      <ProtectedRoute>
        <CreateCompanyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.EDIT_COMPANY,
    element: (
      <ProtectedRoute>
        <EditCompanyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.COMPANY_DETAILS,
    element: (
      <ProtectedRoute>
        <CompanyDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.COMPANY_SETTINGS,
    element: (
      <ProtectedRoute>
        <CompanySettingsPage />
      </ProtectedRoute>
    ),
  },
];

export default companyRoutes;
