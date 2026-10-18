import React from "react";
import { ROUTES } from "@/constants";

import {
  CashExchangesPage,
  CashExchangeDetailsPage,
} from "../pages";

const cashExchangeRoutes = [
  {
    path: ROUTES.CASH_EXCHANGES,
    element: <CashExchangesPage />,
  },
  {
    path: ROUTES.CASH_EXCHANGE_DETAILS(),
    element: <CashExchangeDetailsPage />,
  },
];

export default cashExchangeRoutes;
