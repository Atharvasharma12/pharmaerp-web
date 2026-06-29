import React from "react";
import { ROUTES } from "@/constants";

import { AccountBalancesPage, AccountBalanceDetailsPage } from "../pages";

const accountBalanceRoutes = [
  {
    path: ROUTES.ACCOUNT_BALANCES,
    element: <AccountBalancesPage />,
  },
  {
    path: ROUTES.ACCOUNT_BALANCE_DETAILS(),
    element: <AccountBalanceDetailsPage />,
  },
];

export default accountBalanceRoutes;
