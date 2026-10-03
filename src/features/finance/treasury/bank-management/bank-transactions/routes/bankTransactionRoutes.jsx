import React from "react";
import { ROUTES } from "@/constants";

import {
  BankTransactionsPage,
  CreateBankTransactionPage,
  BankTransactionDetailsPage,
} from "../pages";

const bankTransactionRoutes = [
  {
    path: ROUTES.BANK_TRANSACTIONS,
    element: <BankTransactionsPage />,
  },
  {
    path: ROUTES.CREATE_BANK_TRANSACTION,
    element: <CreateBankTransactionPage />,
  },
  {
    path: ROUTES.BANK_TRANSACTION_DETAILS(),
    element: <BankTransactionDetailsPage />,
  },
];

export default bankTransactionRoutes;
