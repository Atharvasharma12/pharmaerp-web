import React from "react";
import { ROUTES } from "@/constants";

import {
  CashExchangesPage,
  CreateCashExchangePage,
  CashExchangeDetailsPage,
} from "../pages";

const cashExchangeRoutes = [
  {
    path: ROUTES.CASH_EXCHANGES,
    element: <CashExchangesPage />,
  },
  {
    path: ROUTES.CREATE_CASH_EXCHANGE,
    element: <CreateCashExchangePage />,
  },
  {
    path: ROUTES.CASH_EXCHANGE_DETAILS(),
    element: <CashExchangeDetailsPage />,
  },
];

export default cashExchangeRoutes;
