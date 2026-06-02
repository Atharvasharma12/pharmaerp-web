// src/features/company/routes/companyRoutes.js

import { ROUTES } from "@/constants";

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
    element: <CompaniesPage />,
  },
  {
    path: ROUTES.CREATE_COMPANY,
    element: <CreateCompanyPage />,
  },
  {
    path: ROUTES.EDIT_COMPANY,
    element: <EditCompanyPage />,
  },
  {
    path: ROUTES.COMPANY_DETAILS,
    element: <CompanyDetailsPage />,
  },
  {
    path: ROUTES.COMPANY_SETTINGS,
    element: <CompanySettingsPage />,
  },
];

export default companyRoutes;
