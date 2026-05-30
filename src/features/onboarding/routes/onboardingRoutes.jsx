import { ROUTES } from "@/constants";
import { ProtectedRoute } from "@/guards";

import {
  CreateWorkspacePage,
  ChoosePlanPage,
  TrialActivatedPage,
  SubscriptionSuccessPage,
} from "../pages";

const onboardingRoutes = [
  {
    path: ROUTES.CREATE_WORKSPACE,
    element: (
      <ProtectedRoute>
        <CreateWorkspacePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.CHOOSE_PLAN,
    element: (
      <ProtectedRoute>
        <ChoosePlanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.TRIAL_ACTIVATED,
    element: (
      <ProtectedRoute>
        <TrialActivatedPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SUBSCRIPTION_SUCCESS,
    element: (
      <ProtectedRoute>
        <SubscriptionSuccessPage />
      </ProtectedRoute>
    ),
  },
];

export default onboardingRoutes;
