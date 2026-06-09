// src/features/setup/pages/desktop/SetupCenterDesktopPage.jsx

import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiHeadphones,
  FiHome,
  FiLock,
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  PageHeader,
  PageRightSidebar,
} from "@/components";
import { ROUTES } from "@/constants";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";

const setupSteps = [
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
    colorVariant: "neutral",
  },
  {
    id: "team",
    title: "Invite Team",
    description: "Invite your team members and assign roles.",
    actionText: "Invite Team",
    route: ROUTES.INVITE_WORKSPACE_MEMBER,
    completedRoute: ROUTES.WORKSPACE_MEMBERS,
    requiredFields: ["workspace", "plan", "company", "branch"],
    colorVariant: "neutral",
  },
  {
    id: "products",
    title: "Add Products",
    description: "Add medicines and products to your inventory.",
    actionText: "Add Products",
    route: "/inventory/products/create",
    completedRoute: "/inventory/products",
    requiredFields: ["workspace", "plan", "company", "branch"],
    colorVariant: "neutral",
  },
  {
    id: "suppliers",
    title: "Add Suppliers",
    description: "Add your suppliers and manage supplier information.",
    actionText: "Add Suppliers",
    route: "/purchases/suppliers/create",
    completedRoute: "/purchases/suppliers",
    requiredFields: ["workspace", "plan", "company", "branch"],
    colorVariant: "neutral",
  },
  {
    id: "purchase",
    title: "Create First Purchase",
    description: "Create your first purchase order and stock your inventory.",
    actionText: "Create Purchase",
    route: "/purchases/create",
    completedRoute: "/purchases",
    requiredFields: ["workspace", "plan", "company", "branch"],
    colorVariant: "neutral",
  },
];

const setupIcons = {
  workspace: <FiHome />,
  plan: <FiCreditCard />,
  company: <FiBriefcase />,
  branch: <FiTruck />,
  team: <FiUsers />,
  products: <FiPackage />,
  suppliers: <FiTruck />,
  purchase: <FiShoppingCart />,
};

const ACTIVE_SUBSCRIPTION_STATUSES = [
  "ACTIVE",
  "TRIAL",
  "TRIALING",
  "TRIAL_ACTIVE",
  "PAID",
];

const getWorkspaceFromItem = (item) => item?.workspace || item || null;

const SetupCenterDesktopPage = () => {
  const navigate = useNavigate();
  const fetchedSubscriptionWorkspaceRef = useRef(null);

  const {
    workspace,
    workspaces,
    currentWorkspace,
    activeWorkspace,
    selectedWorkspace,
  } = useWorkspace();

  const { companies = [] } = useCompany();
  const { branches = [] } = useBranch();

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
      setupSteps.map((step) => {
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

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Setup Center"
          subtitle="Complete these simple steps to set up your pharmacy business and start using PharmaERP to its full potential."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Setup Center", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          actions={
            nextStep ? (
              <AppButton
                type="button"
                variant="contained"
                colorVariant="primary"
                rounded="md"
                size="small"
                endIcon={<FiArrowRight />}
                onClick={nextStep.onClick}
                sx={headerActionButtonSx}
              >
                Continue Setup
              </AppButton>
            ) : null
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_300px] items-start gap-5">
          <AppBox sx={{ minWidth: 0 }}>
            <ProgressPanel
              progress={progress}
              completed={completedStepsCount}
              total={mappedSetupSteps.length}
              nextStep={nextStep}
              onContinue={() => nextStep?.onClick?.()}
            />

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={mainCardSx}
            >
              {mappedSetupSteps.map((step, index) => (
                <SetupRow
                  key={step.id}
                  step={step}
                  index={index}
                  isLast={index === mappedSetupSteps.length - 1}
                />
              ))}
            </AppCard>
          </AppBox>

          <SetupRightSidebar onHelp={() => navigate("/help-center")} />
        </div>
      </div>
    </section>
  );
};

const ProgressPanel = ({
  progress,
  completed,
  total,
  nextStep,
  onContinue,
}) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={progressPanelSx}
  >
    <AppStack direction="row" align="center" justify="space-between" gap={1.5}>
      <AppBox sx={{ minWidth: 0, flex: 1 }}>
        <AppStack direction="row" align="center" justify="space-between">
          <AppHeading level={2} weight={700} sx={progressHeadingSx}>
            Your Setup Progress
          </AppHeading>

          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10.5px] font-bold text-primary">
            {progress}%
          </span>
        </AppStack>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <AppText variant="body2" sx={progressCountSx}>
          {completed} of {total} steps completed
        </AppText>
      </AppBox>

      {nextStep ? (
        <AppButton
          type="button"
          variant="contained"
          colorVariant="primary"
          rounded="md"
          endIcon={<FiArrowRight />}
          onClick={onContinue}
          sx={continueButtonSx}
        >
          Continue
        </AppButton>
      ) : null}
    </AppStack>
  </AppCard>
);

const SetupRightSidebar = ({ onHelp }) => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "Why Setup is Important?",
        icon: <FiZap />,
        colorVariant: "primary",
        variant: "default",
        description:
          "Completing the setup helps you unlock all features of PharmaERP and manage your pharmacy business efficiently.",
        points: [
          "Streamlined operations",
          "Better inventory control",
          "Accurate reporting",
          "Business growth",
        ],
        pointIcon: <FiCheckCircle />,
        pointIconVariant: "check",
      },
      {
        title: "Setup Tips",
        icon: <FiBookOpen />,
        colorVariant: "info",
        variant: "default",
        custom: (
          <div className="space-y-2">
            <Tip text="Complete each unlocked step before moving ahead." />
            <Tip text="All data is secure and can be edited later." />
            <Tip text="Takes only a few minutes to get started." />
          </div>
        ),
      },
      {
        title: "Need Help?",
        icon: <FiHeadphones />,
        colorVariant: "neutral",
        variant: "default",
        custom: (
          <AppBox>
            <AppText variant="body2" sx={sideTextSx}>
              Our support team is ready to help you at every step.
            </AppText>

            <button
              type="button"
              onClick={onHelp}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-primary"
            >
              Contact Support <FiArrowRight />
            </button>
          </AppBox>
        ),
      },
    ]}
  />
);

const SetupRow = ({ step, index, isLast }) => {
  const statusText = step.completed
    ? "Completed"
    : step.locked
      ? "Locked"
      : "In Progress";

  return (
    <div
      className={`grid grid-cols-[52px_58px_1fr_150px_136px] items-center border-divider px-3.5 py-2 ${
        isLast ? "" : "border-b"
      }`}
    >
      <div className="relative flex h-full justify-center">
        {!isLast ? (
          <span
            className={`absolute left-1/2 top-7 h-[calc(100%+16px)] -translate-x-1/2 border-l ${
              step.completed ? "border-primary" : "border-border-strong"
            } border-dashed`}
          />
        ) : null}

        <span
          className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-[12px] font-semibold ${
            step.completed
              ? "border-primary bg-primary text-text-inverse"
              : step.locked
                ? "border-border-strong bg-surface text-text-muted"
                : "border-primary bg-primary text-text-inverse"
          }`}
        >
          {index + 1}
        </span>
      </div>

      <IconBox
        icon={setupIcons[step.id] || <FiBookOpen />}
        colorVariant={
          step.completed || !step.locked ? step.colorVariant : "neutral"
        }
        locked={step.locked}
      />

      <AppBox sx={{ minWidth: 0 }}>
        <AppStack direction="row" align="center" gap={0.65}>
          <AppHeading level={3} weight={650} sx={rowTitleSx}>
            {step.title}
          </AppHeading>

          <span
            className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold ${
              step.completed
                ? "bg-success-soft text-success"
                : step.locked
                  ? "bg-surface-alt text-text-muted"
                  : "bg-primary-soft text-primary"
            }`}
          >
            {statusText}
          </span>
        </AppStack>

        <AppText variant="body2" sx={rowSubtitleSx}>
          {step.description}
        </AppText>
      </AppBox>

      <StatusMeta step={step} />

      <AppButton
        type="button"
        variant={step.completed ? "outlined" : "contained"}
        colorVariant={
          step.completed ? "primary" : step.locked ? "neutral" : "primary"
        }
        rounded="md"
        disabled={step.locked}
        onClick={step.onClick}
        sx={actionButtonSx}
      >
        {step.completed
          ? step.id === "workspace"
            ? "View Workspace"
            : step.id === "plan"
              ? "View Plan"
              : "View"
          : step.actionText}
      </AppButton>
    </div>
  );
};

const StatusMeta = ({ step }) => {
  if (step.completed) {
    return (
      <AppStack direction="row" align="center" justify="flex-end" gap={0.7}>
        <AppText variant="body2" sx={metaTextSx}>
          Completed
        </AppText>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] text-text-inverse">
          <FiCheck />
        </span>
      </AppStack>
    );
  }

  if (step.locked) {
    return (
      <AppStack direction="row" align="center" justify="flex-end" gap={0.7}>
        <FiLock className="text-[14px] text-text-muted" />
        <AppBox>
          <AppText variant="body2" sx={lockedTitleSx}>
            Locked
          </AppText>
          <AppText variant="body2" sx={lockedSubTextSx}>
            Complete previous step
          </AppText>
        </AppBox>
      </AppStack>
    );
  }

  return <span />;
};

const Tip = ({ text }) => (
  <AppStack direction="row" align="flex-start" gap={0.8}>
    <span className="mt-0.5 text-[13px] text-text-muted">›</span>
    <AppText variant="body2" sx={tipTextSx}>
      {text}
    </AppText>
  </AppStack>
);

const IconBox = ({ icon, colorVariant = "primary", locked = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: 38,
      height: 38,
      minWidth: 38,
      borderRadius: "10px",
      bgcolor: locked
        ? "var(--app-color-surface-alt)"
        : `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: locked
        ? "var(--app-color-text-muted)"
        : `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: "19px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const pageHeaderSx = {
  width: "100%",
};

const pageHeaderContentSx = {
  minWidth: 0,

  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "25px",
    lineHeight: 1.15,
    letterSpacing: "-0.45px",
    color: "var(--app-color-text)",
  },
};

const breadcrumbSx = {
  mt: 1,
};

const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const headerActionButtonSx = {
  height: 36,
  px: 1.6,
  fontSize: "12px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const progressPanelSx = {
  px: 1.7,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const progressHeadingSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const progressCountSx = {
  mt: 0.7,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const continueButtonSx = {
  height: 32,
  px: 1.25,
  fontSize: "11.5px",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const mainCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const rowTitleSx = {
  m: 0,
  fontSize: "12.6px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const rowSubtitleSx = {
  mt: 0.25,
  fontSize: "10.8px",
  lineHeight: 1.25,
  color: "var(--app-color-text-muted)",
};

const metaTextSx = {
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

const lockedTitleSx = {
  fontSize: "11px",
  fontWeight: 650,
  lineHeight: 1.05,
  color: "var(--app-color-text)",
};

const lockedSubTextSx = {
  mt: 0.15,
  fontSize: "10px",
  lineHeight: 1.05,
  color: "var(--app-color-text-muted)",
};

const actionButtonSx = {
  justifySelf: "end",
  width: 124,
  height: 29,
  px: 0.8,
  fontSize: "10.8px",
  fontWeight: 650,
  whiteSpace: "nowrap",
};

const sideTextSx = {
  mt: 0,
  fontSize: "12px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const tipTextSx = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

export default SetupCenterDesktopPage;
