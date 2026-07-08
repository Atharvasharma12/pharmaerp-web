import { ROUTES } from "@/constants";

import {
  TrialActivatedPage,
  SubscriptionSuccessPage,
} from "../pages";

const onboardingRoutes = [
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
