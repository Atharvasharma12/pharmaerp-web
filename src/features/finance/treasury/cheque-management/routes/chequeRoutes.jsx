import React from "react";
import { ROUTES } from "@/constants";

import {
  ChequesPage,
  CreateChequePage,
  ChequeDetailsPage,
} from "../pages";

const chequeRoutes = [
  {
    path: ROUTES.CHEQUES,
    element: <ChequesPage />,
  },
  {
    path: ROUTES.CREATE_CHEQUE,
    element: <CreateChequePage />,
  },
  {
    path: ROUTES.CHEQUE_DETAILS(),
    element: <ChequeDetailsPage />,
  },
];

export default chequeRoutes;
