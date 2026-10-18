import React from "react";
import { ROUTES } from "@/constants";

import {
  CashTransactionsPage,
} from "../pages";

const cashTransactionRoutes = [
  {
    path: ROUTES.CASH_TRANSACTIONS,
    element: <CashTransactionsPage />,
  },
];

export default cashTransactionRoutes;
