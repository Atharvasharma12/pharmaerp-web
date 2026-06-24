import { ROUTES } from "@/constants";

import {
  CashAccountsPage,
  CreateCashAccountPage,
  EditCashAccountPage,
  CashAccountDetailsPage,
} from "../pages";

const cashAccountRoutes = [
  {
    path: ROUTES.CASH_ACCOUNTS,
    element: <CashAccountsPage />,
  },

  {
    path: ROUTES.CREATE_CASH_ACCOUNT,
    element: <CreateCashAccountPage />,
  },

  {
    path: ROUTES.CASH_ACCOUNT_DETAILS(),
    element: <CashAccountDetailsPage />,
  },

  {
    path: ROUTES.EDIT_CASH_ACCOUNT(),
    element: <EditCashAccountPage />,
  },
];

export default cashAccountRoutes;
