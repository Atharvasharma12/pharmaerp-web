import React from "react";
import { ROUTES } from "@/constants";

import {
  CashTransactionsPage,
  CreateCashTransactionPage,
} from "../pages";

const cashTransactionRoutes = [
  {
    path: ROUTES.CASH_TRANSACTIONS,
    element: <CashTransactionsPage />,
  },
  {
    path: ROUTES.CREATE_CASH_TRANSACTION,
    element: <CreateCashTransactionPage />,
  },
];

export default cashTransactionRoutes;
