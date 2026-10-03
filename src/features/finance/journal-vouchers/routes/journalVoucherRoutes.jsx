import React from "react";
import { ROUTES } from "@/constants";
import {
  JournalVouchersPage,
  CreateJournalVoucherPage,
  EditJournalVoucherPage,
  JournalVoucherDetailsPage,
} from "../pages";

const journalVoucherRoutes = [
  {
    path: ROUTES.JOURNAL_VOUCHERS,
    element: <JournalVouchersPage />,
  },
  {
    path: ROUTES.CREATE_JOURNAL_VOUCHER,
    element: <CreateJournalVoucherPage />,
  },
  {
    path: ROUTES.JOURNAL_VOUCHER_DETAILS(),
    element: <JournalVoucherDetailsPage />,
  },
  {
    path: ROUTES.EDIT_JOURNAL_VOUCHER(),
    element: <EditJournalVoucherPage />,
  },
];

export default journalVoucherRoutes;
