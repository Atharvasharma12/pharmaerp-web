// src/features/billing/routes/billingRoutes.jsx

import React from "react";
import { ROUTES } from "@/constants";
import BillingPage from "../pages/BillingPage";

export const billingRoutes = [
  {
    path: ROUTES.BILLING,
    element: <BillingPage />,
  },
];

export default billingRoutes;
