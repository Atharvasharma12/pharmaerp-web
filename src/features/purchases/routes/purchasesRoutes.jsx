// src/features/purchases/routes/purchasesRoutes.jsx

import React from "react";
import { ROUTES } from "@/constants";
import PurchasesPage from "../pages/PurchasesPage";
import CreatePurchaseBillPage from "../pages/CreatePurchaseBillPage";

export const purchasesRoutes = [
  {
    path: ROUTES.PURCHASES,
    element: <PurchasesPage />,
  },
  {
    path: ROUTES.CREATE_PURCHASE_BILL,
    element: <CreatePurchaseBillPage />,
  },
];

export default purchasesRoutes;
