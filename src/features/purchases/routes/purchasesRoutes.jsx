// src/features/purchases/routes/purchasesRoutes.jsx

import React from "react";
import { ROUTES } from "@/constants";
import PurchasesPage from "../pages/PurchasesPage";

export const purchasesRoutes = [
  {
    path: ROUTES.PURCHASES,
    element: <PurchasesPage />,
  },
];

export default purchasesRoutes;
