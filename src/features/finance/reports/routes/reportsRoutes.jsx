import React from "react";
import { ROUTES } from "@/constants";

import { ReportsPage, ReportViewerPage } from "../pages";

const reportsRoutes = [
  {
    path: ROUTES.REPORTS,
    element: <ReportsPage />,
  },
  {
    path: ROUTES.REPORT_VIEWER,
    element: <ReportViewerPage />,
  },
];

export default reportsRoutes;
