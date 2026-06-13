// src/features/setup/pages/SetupCenterPage.jsx

import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";

import SetupCenterDesktopPage from "./desktop/SetupCenterDesktopPage";
import SetupCenterMobilePage from "./mobile/SetupCenterMobilePage";

const setupStepsConfig = [
  {
    id: "workspace",
    title: "Create Workspace",
    description: "Create your workspace to manage all pharmacy operations.",
    actionText: "Create Workspace",
    route: ROUTES.CREATE_WORKSPACE,
    completedRoute: ROUTES.WORKSPACE_DETAILS,
    requiredFields: [],
    colorVariant: "primary",
  },
  {
    id: "plan",
    title: "Choose Plan",
    description: "Choose the perfect plan for your pharmacy business.",
    actionText: "View Plan",
    route: ROUTES.CHOOSE_PLAN,
    completedRoute: ROUTES.CHOOSE_PLAN,
    requiredFields: ["workspace"],
    colorVariant: "success",
  },
  {
    id: "company",
    title: "Create Company",
    description: "Add your company details and set up your business profile.",
    actionText: "Create Company",
    route: ROUTES.CREATE_COMPANY,
    completedRoute: ROUTES.COMPANIES,
    requiredFields: ["workspace", "plan"],
    colorVariant: "info",
  },
  {
    id: "branch",
    title: "Create Branch",
    description: "Add your pharmacy branch or store location.",
    actionText: "Create Branch",
    route: ROUTES.CREATE_BRANCH,
    completedRoute: ROUTES.BRANCHES,
    requiredFields: ["workspace", "plan", "company"],
    colorVariant: "secondary",
  },
  {
    id: "team",
    title: "Invite Team",
    description: "Invite your team members and assign roles.",
    actionText: "Invite Team",
    route: ROUTES.INVITE_WORKSPACE_MEMBER,
    completedRoute: ROUTES.WORKSPACE_MEMBERS,
    requiredFields: ["workspace", "plan", "company", "branch"],
    colorVariant: "primary",
  },
  {
    id: "products",
    title: "Add Products",
    description: "Add medicines and products to your inventory.",
    actionText: "Add Products",
    route: "/inventory/products/create",
    completedRoute: "/inventory/products",
    requiredFields: ["workspace", "plan", "company", "branch"],
    colorVariant: "warning",
  },
  {
    id: "suppliers",
    title: "Add Suppliers",
    description: "Add your suppliers and manage supplier information.",
    actionText: "Add Suppliers",
    route: "/purchases/suppliers/create",
    completedRoute: "/purchases/suppliers",
    requiredFields: ["workspace", "plan", "company", "branch"],
    colorVariant: "info",
  },
  {
    id: "purchase",
    title: "Create First Purchase",
    description: "Create your first purchase order and stock your inventory.",
    actionText: "Create Purchase",
    route: "/purchases/create",
    completedRoute: "/purchases",
    requiredFields: ["workspace", "plan", "company", "branch"],
    colorVariant: "error",
  },
];

const ACTIVE_SUBSCRIPTION_STATUSES = [
  "ACTIVE",
  "TRIAL",
  "TRIALING",
  "TRIAL_ACTIVE",
  "PAID",
];

const getWorkspaceFromItem = (item) => item?.workspace || item || null;

const SetupCenterPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const fetchedSubscriptionWorkspaceRef = useRef(null);
  const fetchedBranchesWorkspaceRef = useRef(null);

  const {
    workspace,
    workspaces,
    currentWorkspace,
    activeWorkspace,
    selectedWorkspace,
  } = useWorkspace();

  const { companies = [] } = useCompany();
  const { branches = [], getWorkspaceBranches } = useBranch();
  const { getWorkspaceCurrentSubscription, currentWorkspaceSubscription } =
    useSubscription();

  const resolvedWorkspace = useMemo(() => {
    if (currentWorkspace) return currentWorkspace;
    if (activeWorkspace) return activeWorkspace;
    if (selectedWorkspace) return selectedWorkspace;
    if (workspace) return workspace;

    const firstWorkspaceItem = Array.isArray(workspaces) ? workspaces[0] : null;
    return getWorkspaceFromItem(firstWorkspaceItem);
  }, [
    activeWorkspace,
    currentWorkspace,
    selectedWorkspace,
    workspace,
    workspaces,
  ]);

  const workspaceId = resolvedWorkspace?._id || resolvedWorkspace?.id;
  const hasWorkspace = Boolean(workspaceId);

  useEffect(() => {
    if (!workspaceId) return;
    if (fetchedSubscriptionWorkspaceRef.current === workspaceId) return;

    fetchedSubscriptionWorkspaceRef.current = workspaceId;
    getWorkspaceCurrentSubscription(workspaceId).catch(() => {});
  }, [workspaceId, getWorkspaceCurrentSubscription]);

  useEffect(() => {
    if (!workspaceId) return;
    if (fetchedBranchesWorkspaceRef.current === workspaceId) return;

    fetchedBranchesWorkspaceRef.current = workspaceId;
    getWorkspaceBranches().catch(() => {});
  }, [workspaceId, getWorkspaceBranches]);

  const workspaceSubscription =
    currentWorkspaceSubscription ||
    resolvedWorkspace?.subscription ||
    resolvedWorkspace?.activeSubscription ||
    resolvedWorkspace?.currentSubscription ||
    null;

  const subscriptionStatus =
    workspaceSubscription?.status || resolvedWorkspace?.subscriptionStatus;

  const hasSubscription = Boolean(
    workspaceSubscription?._id ||
    workspaceSubscription?.id ||
    ACTIVE_SUBSCRIPTION_STATUSES.includes(
      String(subscriptionStatus || "").toUpperCase(),
    ),
  );

  const hasCompany = Array.isArray(companies) && companies.length > 0;
  const hasBranch = Array.isArray(branches) && branches.length > 0;

  const setupState = useMemo(
    () => ({
      workspace: hasWorkspace,
      plan: hasSubscription,
      company: hasCompany,
      branch: hasBranch,
      team: false,
      products: false,
      suppliers: false,
      purchase: false,
    }),
    [hasWorkspace, hasSubscription, hasCompany, hasBranch],
  );

  const mappedSetupSteps = useMemo(
    () =>
      setupStepsConfig.map((step) => {
        const locked = step.requiredFields.some((field) => !setupState[field]);
        const completed = Boolean(setupState[step.id]);
        const targetRoute = completed
          ? step.completedRoute || step.route
          : step.route;

        return {
          ...step,
          completed,
          locked,
          disabled: locked,
          onClick: () => {
            if (!locked && targetRoute) {
              navigate(targetRoute);
            }
          },
        };
      }),
    [navigate, setupState],
  );

  const completedStepsCount = mappedSetupSteps.filter(
    (step) => step.completed,
  ).length;

  const progress = mappedSetupSteps.length
    ? Math.round((completedStepsCount / mappedSetupSteps.length) * 100)
    : 0;

  const nextStep = mappedSetupSteps.find(
    (step) => !step.completed && !step.locked,
  );

  const pageProps = {
    mappedSetupSteps,
    completedStepsCount,
    progress,
    nextStep,
  };

  return isMobile ? (
    <SetupCenterMobilePage {...pageProps} />
  ) : (
    <SetupCenterDesktopPage {...pageProps} />
  );
};

export default SetupCenterPage;
