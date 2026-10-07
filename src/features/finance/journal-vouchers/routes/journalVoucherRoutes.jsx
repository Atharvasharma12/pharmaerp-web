import React from "react";
import { ROUTES } from "@/constants";
import { JournalVouchersPage } from "../pages";

const journalVoucherRoutes = [
  {
    path: ROUTES.JOURNAL_VOUCHERS,
    element: <JournalVouchersPage />,
  },
];

export default journalVoucherRoutes;

