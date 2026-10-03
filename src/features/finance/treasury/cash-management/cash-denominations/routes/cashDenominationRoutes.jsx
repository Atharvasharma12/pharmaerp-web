import React from "react";
import { ROUTES } from "@/constants";

import {
  CashDenominationsPage,
  CreateCashDenominationPage,
  CashDenominationDetailsPage,
} from "../pages";

const cashDenominationRoutes = [
  {
    path: ROUTES.CASH_DENOMINATIONS,
    element: <CashDenominationsPage />,
  },
  {
    path: ROUTES.CREATE_CASH_DENOMINATION,
    element: <CreateCashDenominationPage />,
  },
  {
    path: ROUTES.CASH_DENOMINATION_DETAILS(),
    element: <CashDenominationDetailsPage />,
  },
];

export default cashDenominationRoutes;
