import React from "react";
import { ROUTES } from "@/constants";

import {
  BankTransactionsPage,
  BankTransactionDetailsPage,
} from "../pages";

const bankTransactionRoutes = [
  {
    path: ROUTES.BANK_TRANSACTIONS,
    element: <BankTransactionsPage />,
  },
  {
    path: ROUTES.BANK_TRANSACTION_DETAILS(),
    element: <BankTransactionDetailsPage />,
  },
];

export default bankTransactionRoutes;
