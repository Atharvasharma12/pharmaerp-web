import React from "react";
import { ROUTES } from "@/constants";

import { FundTransfersPage } from "../pages";

const fundTransferRoutes = [
  {
    path: ROUTES.FUND_TRANSFERS,
    element: <FundTransfersPage />,
  },
];

export default fundTransferRoutes;
