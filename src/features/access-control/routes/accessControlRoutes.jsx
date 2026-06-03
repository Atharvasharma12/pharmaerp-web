// src/features/access-control/routes/accessControlRoutes.js

import { ROUTES } from "@/constants";

import {
  AccessControlPage,
  RolesPage,
  CreateRolePage,
  EditRolePage,
  RoleDetailsPage,
  MemberAccessPage,
  AssignAccessPage,
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
    element: <MemberAccessPage />,
  },
  {
    path: ROUTES.ASSIGN_ACCESS,
    element: <AssignAccessPage />,
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
