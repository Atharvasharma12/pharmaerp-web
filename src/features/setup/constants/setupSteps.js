// src/features/setup/constants/setupSteps.js
// Only 2 active steps for now.
// To add more: append an entry here AND wire the matching controller + thunk.

import { ROUTES } from "@/constants";

export const setupSteps = [
  {
    id: "company",
    title: "Create Company",
    description: "Add your pharmacy business details, GST, PAN, and licenses.",
    actionText: "Create Company",
    route: ROUTES.CREATE_COMPANY,
    completed: false,
    disabled: false,
    requiredFields: [],
    colorVariant: "primary",
  },
  {
    id: "branch",
    title: "Create Branch",
    description: "Add your first store or pharmacy branch for operations.",
    actionText: "Create Branch",
    route: ROUTES.CREATE_BRANCH,
    completed: false,
    disabled: true,
    requiredFields: ["company"],
    colorVariant: "info",
  },
];

export default setupSteps;
