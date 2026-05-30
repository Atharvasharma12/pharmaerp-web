import { ROUTES } from "@/constants";
import { ProtectedRoute } from "@/guards";

import { DashboardPage } from "../pages";

const dashboardRoutes = [
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
];

export default dashboardRoutes;
