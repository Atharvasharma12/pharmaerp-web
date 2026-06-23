import { ROUTES } from "@/constants";

import {
  AccountsPage,
  CreateAccountPage,
  EditAccountPage,
  AccountDetailsPage,
} from "../pages";

const accountRoutes = [
  {
    path: ROUTES.ACCOUNTS,
    element: <AccountsPage />,
  },

  {
    path: ROUTES.CREATE_ACCOUNT,
    element: <CreateAccountPage />,
  },

  {
    path: ROUTES.ACCOUNT_DETAILS(),
    element: <AccountDetailsPage />,
  },

  {
    path: ROUTES.EDIT_ACCOUNT(),
    element: <EditAccountPage />,
  },
];

export default accountRoutes;
