import { ROUTES } from "@/constants";

import BankDepositSlipsPage from "../pages/BankDepositSlipsPage";
import CreateBankDepositSlipPage from "../pages/CreateBankDepositSlipPage";
import BankDepositSlipDetailsPage from "../pages/BankDepositSlipDetailsPage";

const bankDepositSlipRoutes = [
  {
    path: ROUTES.BANK_DEPOSIT_SLIPS,
    element: <BankDepositSlipsPage />,
  },
  {
    path: ROUTES.CREATE_BANK_DEPOSIT_SLIP,
    element: <CreateBankDepositSlipPage />,
  },
  {
    path: ROUTES.BANK_DEPOSIT_SLIP_DETAILS(),
    element: <BankDepositSlipDetailsPage />,
  },
];

export default bankDepositSlipRoutes;
