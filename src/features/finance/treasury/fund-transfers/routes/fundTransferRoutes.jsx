import React from "react";
import { ROUTES } from "@/constants";

import {
  FundTransfersPage,
  FundTransferDetailsPage,
} from "../pages";

const fundTransferRoutes = [
  {
    path: ROUTES.FUND_TRANSFERS,
    element: <FundTransfersPage />,
  },
  {
    path: ROUTES.FUND_TRANSFER_DETAILS(),
    element: <FundTransferDetailsPage />,
  },
];

export default fundTransferRoutes;
