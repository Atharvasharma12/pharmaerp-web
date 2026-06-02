import { ROUTES } from "@/constants";

import {
  CreateWorkspacePage,
  ChoosePlanPage,
  TrialActivatedPage,
  SubscriptionSuccessPage,
} from "../pages";

const onboardingRoutes = [
  {
    path: ROUTES.CREATE_WORKSPACE,
    element: <CreateWorkspacePage />,
  },
  {
    path: ROUTES.CHOOSE_PLAN,
    element: <ChoosePlanPage />,
  },
  {
    path: ROUTES.TRIAL_ACTIVATED,
    element: <TrialActivatedPage />,
  },
  {
    path: ROUTES.SUBSCRIPTION_SUCCESS,
    element: <SubscriptionSuccessPage />,
  },
];

export default onboardingRoutes;
