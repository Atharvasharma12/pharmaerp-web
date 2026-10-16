import { ROUTES } from "@/constants";

import BankDepositSlipsPage from "../pages/BankDepositSlipsPage";
import BankDepositSlipDetailsPage from "../pages/BankDepositSlipDetailsPage";
import CashInTransitPage from "../pages/CashInTransitPage";

const bankDepositSlipRoutes = [
  {
    path: ROUTES.BANK_DEPOSIT_SLIPS,
    element: <BankDepositSlipsPage />,
  },
  {
    path: ROUTES.BANK_DEPOSIT_SLIP_DETAILS(),
    element: <BankDepositSlipDetailsPage />,
  },
  {
    path: ROUTES.CASH_IN_TRANSIT,
    element: <CashInTransitPage />,
  },
];

export default bankDepositSlipRoutes;
