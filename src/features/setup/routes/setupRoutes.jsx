import { ROUTES } from "@/constants";
import { PermissionGuard } from "@/guards";
import { SetupCenterPage } from "../pages";

const setupRoutes = [
  {
    path: ROUTES.SETUP_CENTER,
    element: (
      <PermissionGuard requireOwner>
        <SetupCenterPage />
      </PermissionGuard>
    ),
  },
];

export default setupRoutes;
