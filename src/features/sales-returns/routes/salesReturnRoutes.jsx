import React from "react";
import { ROUTES } from "@/constants";
import SalesReturnPage from "../pages/SalesReturnPage";

export const salesReturnRoutes = [
  {
    path: ROUTES.SALES_RETURNS,
    element: <SalesReturnPage />,
  },
];

export default salesReturnRoutes;
