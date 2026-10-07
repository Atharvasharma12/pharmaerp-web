import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants";

import {
  RolesPage,
  PermissionPage,
} from "../pages";

const accessControlRoutes = [
  // Primary Roles & Permissions Routes
  {
    path: ROUTES.ROLES,
    element: <RolesPage />,
  },
  {
    path: ROUTES.PERMISSIONS,
    element: <PermissionPage />,
  },

  // Legacy route redirects
  {
    path: "/access-control",
    element: <Navigate to={ROUTES.ROLES} replace />,
  },
  {
    path: "/access-control/roles",
    element: <Navigate to={ROUTES.ROLES} replace />,
  },
  {
    path: "/access-control/permissions",
    element: <Navigate to={ROUTES.PERMISSIONS} replace />,
  },
  {
    path: "/access-control/*",
    element: <Navigate to={ROUTES.ROLES} replace />,
  },
];

export default accessControlRoutes;

