import React from "react";
import { ROUTES } from "@/constants";

import { FinancialPeriodsPage } from "../pages";

const financialPeriodRoutes = [
  {
    path: ROUTES.FINANCIAL_PERIODS,
    element: <FinancialPeriodsPage />,
  },
];

export default financialPeriodRoutes;
