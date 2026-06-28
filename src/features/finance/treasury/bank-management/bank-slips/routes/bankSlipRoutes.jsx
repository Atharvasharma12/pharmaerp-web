import React from "react";
import { ROUTES } from "@/constants";

import {
  BankSlipsPage,
  CreateBankSlipPage,
  BankSlipDetailsPage,
} from "../pages";

const bankSlipRoutes = [
  {
    path: ROUTES.BANK_SLIPS,
    element: <BankSlipsPage />,
  },
  {
    path: ROUTES.CREATE_BANK_SLIP,
    element: <CreateBankSlipPage />,
  },
  {
    path: ROUTES.BANK_SLIP_DETAILS(),
    element: <BankSlipDetailsPage />,
  },
];

export default bankSlipRoutes;
