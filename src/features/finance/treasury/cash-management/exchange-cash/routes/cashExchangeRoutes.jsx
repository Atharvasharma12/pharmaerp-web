import React from "react";
import { useParams } from "react-router-dom";
import { ROUTES } from "@/constants";

import { CashExchangesPage } from "../pages";

// Direct exchange details wrapper (opens modal on main page)
const DirectExchangeDetailsRoute = () => {
  const { cashExchangeId } = useParams();
  return <CashExchangesPage initialExchangeId={cashExchangeId} />;
};

const cashExchangeRoutes = [
  {
    path: ROUTES.CASH_EXCHANGES,
    element: <CashExchangesPage />,
  },
  {
    path: ROUTES.CREATE_CASH_EXCHANGE,
    element: <CashExchangesPage initialOpenCreate />,
  },
  {
    path: ROUTES.CASH_EXCHANGE_DETAILS(),
    element: <DirectExchangeDetailsRoute />,
  },
];

export default cashExchangeRoutes;
