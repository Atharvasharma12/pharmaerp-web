import { ROUTES } from "@/constants";

import {
  BankAccountsPage,
  CreateBankAccountPage,
  EditBankAccountPage,
  BankAccountDetailsPage,
} from "../pages";

const bankAccountRoutes = [
  {
    path: ROUTES.BANK_ACCOUNTS,
    element: <BankAccountsPage />,
  },
  {
    path: ROUTES.CREATE_BANK_ACCOUNT,
    element: <CreateBankAccountPage />,
  },
  {
    path: ROUTES.BANK_ACCOUNT_DETAILS(),
    element: <BankAccountDetailsPage />,
  },
  {
    path: ROUTES.EDIT_BANK_ACCOUNT(),
    element: <EditBankAccountPage />,
  },
];

export default bankAccountRoutes;
