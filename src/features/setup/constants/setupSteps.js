// src/features/setup/constants/setupSteps.js

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
  {
    id: "team",
    title: "Invite Team",
    description: "Invite staff members and assign access to your workspace.",
    actionText: "Invite Team",
    route: ROUTES.INVITE_WORKSPACE_MEMBER,
    completed: false,
    disabled: true,
    requiredFields: ["company"],
    colorVariant: "warning",
  },
  {
    id: "products",
    title: "Add Products",
    description: "Add medicines and products to prepare your catalog.",
    actionText: "Add Products",
    route: "/catalog/products",
    completed: false,
    disabled: true,
    requiredFields: ["company", "branch"],
    colorVariant: "error",
  },
  {
    id: "purchase",
    title: "Create First Purchase",
    description: "Record your first purchase to add stock into inventory.",
    actionText: "Create Purchase",
    route: "/purchase/create",
    completed: false,
    disabled: true,
    requiredFields: [
      "company",
      "branch",
      "products",
    ],
    colorVariant: "primary",
  },
];

export default setupSteps;
