import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants";

import {
  AccessControlPage,
  RolesPage,
  CreateRolePage,
  EditRolePage,
  RoleDetailsPage,
  AssignRolePage,
  EditAccessPage,
  PermissionPage,
} from "../pages";

const accessControlRoutes = [
  {
    path: ROUTES.ACCESS_CONTROL,
    element: <AccessControlPage />,
  },
  {
    path: ROUTES.ROLES,
    element: <RolesPage />,
  },
  {
    path: ROUTES.CREATE_ROLE,
    element: <CreateRolePage />,
  },
  {
    path: ROUTES.EDIT_ROLE,
    element: <EditRolePage />,
  },
  {
    path: ROUTES.ROLE_DETAILS,
    element: <RoleDetailsPage />,
  },
  {
    path: ROUTES.MEMBER_ACCESS,
    element: <Navigate to={ROUTES.WORKSPACE_MEMBERS} replace />,
  },
  {
    path: ROUTES.ASSIGN_ACCESS,
    element: <Navigate to={ROUTES.WORKSPACE_MEMBERS} replace />,
  },
  {
    path: ROUTES.ASSIGN_ROLE,
    element: <AssignRolePage />,
  },
  {
    path: ROUTES.EDIT_ACCESS,
    element: <EditAccessPage />,
  },
  {
    path: ROUTES.PERMISSIONS,
    element: <PermissionPage />,
  },
];

export default accessControlRoutes;
