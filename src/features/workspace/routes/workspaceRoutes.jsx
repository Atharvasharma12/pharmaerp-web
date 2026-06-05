import { ROUTES } from "@/constants";

import {
  WorkspacePage,
  EditWorkspacePage,
  WorkspaceDetailsPage,
  WorkspaceMembersPage,
  WorkspaceInvitationsPage,
  InviteWorkspaceMemberPage,
} from "../pages";

const workspaceRoutes = [
  {
    path: ROUTES.WORKSPACE,
    element: <WorkspacePage />,
  },
  {
    path: ROUTES.EDIT_WORKSPACE,
    element: <EditWorkspacePage />,
  },
  {
    path: ROUTES.WORKSPACE_DETAILS,
    element: <WorkspaceDetailsPage />,
  },
  {
    path: ROUTES.WORKSPACE_MEMBERS,
    element: <WorkspaceMembersPage />,
  },
  {
    path: ROUTES.WORKSPACE_INVITATIONS,
    element: <WorkspaceInvitationsPage />,
  },
  {
    path: ROUTES.INVITE_WORKSPACE_MEMBER,
    element: <InviteWorkspaceMemberPage />,
  },
];

export default workspaceRoutes;
