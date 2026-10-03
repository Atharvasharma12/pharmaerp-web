import React from "react";
import { ROUTES } from "@/constants";

import {
  CashTransactionsPage,
  CreateCashTransactionPage,
  CashTransactionDetailsPage,
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
  {
    path: ROUTES.CASH_TRANSACTION_DETAILS(),
    element: <CashTransactionDetailsPage />,
  },
];

export default cashTransactionRoutes;
