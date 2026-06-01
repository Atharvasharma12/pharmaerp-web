// src/features/branch/routes/branchRoutes.js

import { ROUTES } from "@/constants";
import { ProtectedRoute } from "@/guards";

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
    element: (
      <ProtectedRoute>
        <BranchesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CREATE_BRANCH,
    element: (
      <ProtectedRoute>
        <CreateBranchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.EDIT_BRANCH,
    element: (
      <ProtectedRoute>
        <EditBranchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.BRANCH_DETAILS,
    element: (
      <ProtectedRoute>
        <BranchDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.BRANCH_SETTINGS,
    element: (
      <ProtectedRoute>
        <BranchSettingsPage />
      </ProtectedRoute>
    ),
  },
];

export default branchRoutes;
