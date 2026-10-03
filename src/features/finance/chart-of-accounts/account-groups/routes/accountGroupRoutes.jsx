import { ROUTES } from "@/constants";

import {
  AccountGroupsPage,
  CreateAccountGroupPage,
  EditAccountGroupPage,
  AccountGroupDetailsPage,
} from "../pages";

const accountGroupRoutes = [
  {
    path: ROUTES.ACCOUNT_GROUPS,
    element: <AccountGroupsPage />,
  },

  {
    path: ROUTES.CREATE_ACCOUNT_GROUP,
    element: <CreateAccountGroupPage />,
  },

  {
    path: ROUTES.ACCOUNT_GROUP_DETAILS(),
    element: <AccountGroupDetailsPage />,
  },

  {
    path: ROUTES.EDIT_ACCOUNT_GROUP(),
    element: <EditAccountGroupPage />,
  },
];

export default accountGroupRoutes;
