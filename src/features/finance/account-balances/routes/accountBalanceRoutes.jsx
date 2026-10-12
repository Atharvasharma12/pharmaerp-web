import React from "react";
import { ROUTES } from "@/constants";

import { AccountBalancesPage } from "../pages";

const accountBalanceRoutes = [
  {
    path: ROUTES.ACCOUNT_BALANCES,
    element: <AccountBalancesPage />,
  },
];

export default accountBalanceRoutes;
