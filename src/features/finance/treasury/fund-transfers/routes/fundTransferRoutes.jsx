import React from "react";
import { ROUTES } from "@/constants";

import {
  FundTransfersPage,
  CreateFundTransferPage,
  FundTransferDetailsPage,
} from "../pages";

const fundTransferRoutes = [
  {
    path: ROUTES.FUND_TRANSFERS,
    element: <FundTransfersPage />,
  },
  {
    path: ROUTES.CREATE_FUND_TRANSFER,
    element: <CreateFundTransferPage />,
  },
  {
    path: ROUTES.FUND_TRANSFER_DETAILS(),
    element: <FundTransferDetailsPage />,
  },
];

export default fundTransferRoutes;
