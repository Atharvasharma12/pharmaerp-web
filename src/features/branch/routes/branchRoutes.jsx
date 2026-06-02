// src/features/branch/routes/branchRoutes.js

import { ROUTES } from "@/constants";

import {
  BranchesPage,
  CreateBranchPage,
  EditBranchPage,
  BranchDetailsPage,
  BranchSettingsPage,
} from "../pages";

const branchRoutes = [
  {
    path: ROUTES.BRANCHES,
    element: <BranchesPage />,
  },
  {
    path: ROUTES.CREATE_BRANCH,
    element: <CreateBranchPage />,
  },
  {
    path: ROUTES.EDIT_BRANCH,
    element: <EditBranchPage />,
  },
  {
    path: ROUTES.BRANCH_DETAILS,
    element: <BranchDetailsPage />,
  },
  {
    path: ROUTES.BRANCH_SETTINGS,
    element: <BranchSettingsPage />,
  },
];

export default branchRoutes;
