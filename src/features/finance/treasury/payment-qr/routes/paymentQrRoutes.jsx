import React from "react";
import { ROUTES } from "@/constants";

import { PaymentQrsPage, UpiTransactionsPage } from "../pages";

const paymentQrRoutes = [
  {
    path: ROUTES.PAYMENT_QRS,
    element: <PaymentQrsPage />,
  },
  {
    path: ROUTES.UPI_TRANSACTIONS,
    element: <UpiTransactionsPage />,
  },
];

export default paymentQrRoutes;

