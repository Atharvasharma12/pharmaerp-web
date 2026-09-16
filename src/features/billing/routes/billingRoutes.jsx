// src/features/billing/routes/billingRoutes.jsx

import React from "react";
import { ROUTES } from "@/constants";
import BillingPage from "../pages/BillingPage";
import POSTerminalPage from "../pages/POSTerminalPage";

export const billingRoutes = [
  {
    path: ROUTES.BILLING,
    element: <BillingPage />,
  },
  {
    path: ROUTES.POS_TERMINAL,
    element: <POSTerminalPage />,
  },
];

export default billingRoutes;
