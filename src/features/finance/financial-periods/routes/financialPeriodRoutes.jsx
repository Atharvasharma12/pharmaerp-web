import React from "react";
import { ROUTES } from "@/constants";

import { FinancialPeriodsPage, CreateFinancialPeriodPage } from "../pages";

const financialPeriodRoutes = [
  {
    path: ROUTES.FINANCIAL_PERIODS,
    element: <FinancialPeriodsPage />,
  },
  {
    path: ROUTES.CREATE_FINANCIAL_PERIOD,
    element: <CreateFinancialPeriodPage />,
  },
];

export default financialPeriodRoutes;
