import React from "react";
import { ROUTES } from "@/constants";

import { LedgerPage } from "../pages";

const ledgerRoutes = [
  {
    path: ROUTES.LEDGER,
    element: <LedgerPage />,
  },
];

export default ledgerRoutes;
