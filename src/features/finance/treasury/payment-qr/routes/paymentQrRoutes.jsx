import React from "react";
import { ROUTES } from "@/constants";

import {
  PaymentQrsPage,
  CreatePaymentQrPage,
  EditPaymentQrPage,
  PaymentQrDetailsPage,
} from "../pages";

const paymentQrRoutes = [
  {
    path: ROUTES.PAYMENT_QRS,
    element: <PaymentQrsPage />,
  },
  {
    path: ROUTES.CREATE_PAYMENT_QR,
    element: <CreatePaymentQrPage />,
  },
  {
    path: ROUTES.PAYMENT_QR_DETAILS(),
    element: <PaymentQrDetailsPage />,
  },
  {
    path: ROUTES.EDIT_PAYMENT_QR(),
    element: <EditPaymentQrPage />,
  },
];

export default paymentQrRoutes;
