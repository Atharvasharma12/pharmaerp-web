import { ROUTES } from "@/constants";

import {
  WorkspaceMembersPage,
  WorkspaceMemberDetailsPage,
  WorkspaceInvitationsPage,
  InviteWorkspaceMemberPage,
} from "../pages";

const workspaceRoutes = [
  {
    path: ROUTES.WORKSPACE_MEMBERS,
    element: <WorkspaceMembersPage />,
  },
  {
    path: "/members/:memberId",
    element: <WorkspaceMemberDetailsPage />,
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
