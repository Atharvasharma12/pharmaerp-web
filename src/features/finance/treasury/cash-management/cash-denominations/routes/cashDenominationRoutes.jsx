import React from "react";
import { ROUTES } from "@/constants";

import { CashDenominationsPage } from "../pages";

const cashDenominationRoutes = [
  {
    path: ROUTES.CASH_DENOMINATIONS,
    element: <CashDenominationsPage />,
  },
];

export default cashDenominationRoutes;
