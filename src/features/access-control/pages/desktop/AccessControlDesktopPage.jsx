import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiKey,
  FiRefreshCw,
  FiShield,
  FiSliders,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

import {
  AppAlert,
  AppBox,
  AppButton,
  AppCard,
  AppErrorState,
  AppHeading,
  AppStack,
  AppTableSkeleton,
  AppTag,
  AppText,
} from "@/components";

const statIcons = {
  roles: <FiUsers />,
  members: <FiUsers />,
  companies: <HiOutlineBuildingOffice2 />,
  branches: <LuStore />,
  permissions: <FiShield />,
};

const overviewIcons = {
  roles: <FiUsers />,
  memberAccess: <FiUsers />,
  permissions: <FiShield />,
  accessSummary: <FiSliders />,
};

const activityIcons = {
  success: <FiUsers />,
  info: <FiUsers />,
  warning: <FiShield />,
};

const AccessControlDesktopPage = ({
  dashboardStats = [],
  accessOverviewItems = [],
  recentAccessActivity = [],

  isLoading,
  hasError,
  error,
  message,

  hasRoles,
  hasPermissions,

  handleRefresh,
  handleViewRoles,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasRoles && !hasPermissions;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader isLoading={isLoading} onRefresh={handleRefresh} />

        <StatsGrid stats={dashboardStats} />

        {error && !hasError ? (
          <AppAlert
            severity="error"
            variant="soft"
            title="Something went wrong"
            closable
            onClose={handleRefresh}
            sx={alertSx}
          >
            {error}
          </AppAlert>
        ) : null}

        {hasError ? (
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={stateCardSx}
          >
            <AppErrorState
              title="Unable to load access control"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          </AppCard>
        ) : showInitialSkeleton ? (
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_390px] gap-5">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sectionCardSx}
            >
              <AppTableSkeleton rows={5} columns={3} showHeader={false} />
            </AppCard>

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sectionCardSx}
            >
              <AppTableSkeleton rows={5} columns={2} showHeader={false} />
            </AppCard>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_390px] gap-5">
            <div className="space-y-5">
              <AccessOverviewCard items={accessOverviewItems} />

              <RecentActivityCard
                activities={recentAccessActivity}
                onViewAll={handleViewRoles}
              />
            </div>

            <RightSidebar />
          </div>
        )}
      </div>
    </section>
  );
};

const TopToast = ({ message, onClose }) => (
  <div className="fixed left-1/2 top-4 z-[1400] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
    <AppAlert
      severity="success"
      variant="filled"
      title={message}
      closable
      onClose={onClose}
      sx={toastSx}
    />
  </div>
);

const PageHeader = ({ isLoading, onRefresh }) => (
  <div className="flex items-center justify-between w-full">
    <AppStack direction="row" align="center" gap={1.4}>
      <IconBox icon={<FiShield />} colorVariant="success" large plain />

      <AppBox>
        <AppHeading level={1} weight={800} sx={pageTitleSx}>
          Access Control
        </AppHeading>

        <AppText variant="body2" sx={pageSubtitleSx}>
          Manage roles, permissions and control access for your workspace.
        </AppText>
      </AppBox>
    </AppStack>

    <AppButton
      type="button"
      variant="outlined"
      colorVariant="neutral"
      rounded="md"
      size="small"
      startIcon={<FiRefreshCw />}
      onClick={onRefresh}
      loading={isLoading}
      disabled={isLoading}
      sx={secondaryButtonSx}
    >
      Refresh
    </AppButton>
  </div>
);

const StatsGrid = ({ stats }) => (
  <div className="mt-4 grid grid-cols-5 gap-3">
    {stats.map((stat) => (
      <StatCard key={stat.id} stat={stat} />
    ))}
  </div>
);

const StatCard = ({ stat }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={statCardSx}
  >
    <AppStack direction="row" align="flex-start" gap={1.1}>
      <IconBox
        icon={statIcons[stat.id] || <FiShield />}
        colorVariant={stat.colorVariant}
        stat
      />

      <AppBox sx={{ minWidth: 0 }}>
        <AppText variant="body2" sx={statTitleSx}>
          {stat.title}
        </AppText>

        <AppHeading level={2} weight={650} sx={statValueSx}>
          {stat.value}
        </AppHeading>

        <AppText variant="body2" sx={statDescriptionSx}>
          {stat.description}
        </AppText>
      </AppBox>
    </AppStack>
  </AppCard>
);

const AccessOverviewCard = ({ items = [] }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <SectionHeader
      title="Access Control Overview"
      subtitle="Manage workspace roles, member access and permissions from one place."
    />

    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <OverviewRow key={item.id} item={item} />
      ))}
    </div>
  </AppCard>
);

const OverviewRow = ({ item }) => (
  <button
    type="button"
    onClick={item.onClick}
    className="block w-full text-left"
  >
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="none"
      padding="none"
      sx={overviewRowSx}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_24px] items-center gap-3">
        <AppStack direction="row" align="center" gap={1.5} sx={{ minWidth: 0 }}>
          <IconBox
            icon={overviewIcons[item.id] || <FiShield />}
            colorVariant={item.colorVariant}
          />

          <AppBox sx={{ minWidth: 0 }}>
            <AppHeading level={3} weight={700} sx={rowTitleSx}>
              {item.title}
            </AppHeading>

            <AppText variant="body2" sx={rowSubtitleSx}>
              {item.description}
            </AppText>
          </AppBox>
        </AppStack>

        <span className="flex h-full items-center justify-end">
          <FiArrowRight className="text-[17px] text-text-muted" />
        </span>
      </div>
    </AppCard>
  </button>
);

const RecentActivityCard = ({ activities = [], onViewAll }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={activityCardSx}
  >
    <SectionHeader
      title="Recent Access Activity"
      subtitle="Latest changes in roles and member access"
      action={
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="primary"
          rounded="md"
          size="small"
          onClick={onViewAll}
          sx={sectionActionSx}
        >
          View All
        </AppButton>
      }
    />

    <div className="mt-3 divide-y divide-border">
      {activities.map((activity) => (
        <ActivityRow key={activity.id} activity={activity} />
      ))}
    </div>
  </AppCard>
);

const ActivityRow = ({ activity }) => (
  <div className="grid grid-cols-[minmax(0,1fr)_140px] items-center gap-3 py-3.5">
    <AppStack direction="row" align="center" gap={1.2} sx={{ minWidth: 0 }}>
      <IconBox
        icon={activityIcons[activity.colorVariant] || <FiShield />}
        colorVariant={activity.colorVariant}
        small
      />

      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={3} weight={700} sx={activityTitleSx}>
          {activity.title}
        </AppHeading>

        <AppText variant="body2" sx={activitySubtitleSx}>
          {activity.description}
        </AppText>
      </AppBox>
    </AppStack>

    <div className="flex justify-end">
      <AppTag
        label={activity.label}
        variant="soft"
        colorVariant={activity.colorVariant}
        rounded="md"
        sx={activityTagSx}
      />
    </div>
  </div>
);
const RightSidebar = () => (
  <div className="space-y-5">
    <InfoCard
      title="What is Access Control?"
      description="Access Control helps you manage roles, permissions and member access across your workspace."
      points={[
        "Create roles and set permissions",
        "Assign roles to members",
        "Control company and branch access",
        "Secure your pharmacy business",
      ]}
    />

    <InfoCard
      title="Best Practices"
      points={[
        "Create role based on responsibilities",
        "Assign minimum required permissions",
        "Review access regularly",
        "Remove access when not needed",
      ]}
      soft
    />

    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={sideCardSx}
    >
      <AppHeading level={3} weight={700} sx={sideTitleSx}>
        Need Help?
      </AppHeading>

      <AppText variant="body2" sx={sideTextSx}>
        Learn more about Access Control management in PharmaERP.
      </AppText>

      <button
        type="button"
        className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-primary"
      >
        <FiBookOpen /> View User Guide <FiArrowRight />
      </button>
    </AppCard>
  </div>
);

const InfoCard = ({ title, description, points = [], soft = false }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={soft ? softSideCardSx : sideCardSx}
  >
    <AppHeading
      level={3}
      weight={700}
      sx={soft ? bestPracticeTitleSx : sideTitleSx}
    >
      {title}
    </AppHeading>

    {description ? (
      <AppText variant="body2" sx={sideTextSx}>
        {description}
      </AppText>
    ) : null}

    <div className="mt-4 space-y-3">
      {points.map((point) => (
        <AppStack key={point} direction="row" align="center" gap={1}>
          {soft ? (
            <FiZap className="shrink-0 text-[15px] text-primary" />
          ) : (
            <FiCheckCircle className="shrink-0 text-[15px] text-primary" />
          )}
          <AppText variant="body2" sx={pointTextSx}>
            {point}
          </AppText>
        </AppStack>
      ))}
    </div>
  </AppCard>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <AppStack
    direction="row"
    align="flex-start"
    justify="space-between"
    gap={1.5}
  >
    <AppBox sx={{ minWidth: 0 }}>
      <AppHeading level={2} weight={700} sx={sectionTitleSx}>
        {title}
      </AppHeading>

      {subtitle ? (
        <AppText variant="body2" sx={sectionSubtitleSx}>
          {subtitle}
        </AppText>
      ) : null}
    </AppBox>

    {action}
  </AppStack>
);

const IconBox = ({
  icon,
  colorVariant = "primary",
  large = false,
  small = false,
  stat = false,
  plain = false,
}) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 48 : small ? 32 : stat ? 38 : 44,
      height: large ? 48 : small ? 32 : stat ? 38 : 44,
      minWidth: large ? 48 : small ? 32 : stat ? 38 : 44,
      borderRadius: large ? "14px" : small ? "9px" : stat ? "11px" : "12px",
      bgcolor: plain
        ? "transparent"
        : `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: large ? "34px" : small ? "16px" : stat ? "19px" : "22px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const pageTitleSx = {
  m: 0,
  fontSize: "25px",
  lineHeight: 1.15,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.55,
  fontSize: "14px",
  lineHeight: "22px",
  color: "var(--app-color-text-muted)",
};

const secondaryButtonSx = {
  height: 36,
  minWidth: 110,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statCardSx = {
  px: 1.5,
  py: 1.35,
  minHeight: 88,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const statTitleSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const statValueSx = {
  mt: 0.45,
  mb: 0,
  fontSize: "18px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.65,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const alertSx = {
  mt: 3,
};

const stateCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const stateSx = {
  minHeight: 390,
};

const sectionCardSx = {
  p: 2.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const activityTagSx = {
  minWidth: 110,
  height: 36,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const activityCardSx = {
  p: 2.2,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",

  "& .divide-y > *": {
    minHeight: 72,
  },
};

const sectionTitleSx = {
  m: 0,
  fontSize: "18px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const sectionActionSx = {
  height: 30,
  px: 1.2,
  fontSize: "11.5px",
  fontWeight: 700,
};

const overviewRowSx = {
  px: 1.4,
  py: 1.25,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "border-color 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    borderColor: "var(--app-color-primary)",
    boxShadow: "var(--app-shadow-xs)",
  },
};

const rowTitleSx = {
  m: 0,
  fontSize: "13.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const rowSubtitleSx = {
  mt: 0.35,
  fontSize: "11.8px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const activityTitleSx = {
  m: 0,
  maxWidth: 520,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const activitySubtitleSx = {
  mt: 0.35,
  maxWidth: 520,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const sideCardSx = {
  px: 2.2,
  py: 2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const softSideCardSx = {
  ...sideCardSx,
  bgcolor: "var(--app-color-readonly-bg)",
};

const sideTitleSx = {
  m: 0,
  fontSize: "16px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const bestPracticeTitleSx = {
  ...sideTitleSx,
  color: "var(--app-color-primary)",
};

const sideTextSx = {
  mt: 1,
  fontSize: "13px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const pointTextSx = {
  fontSize: "12.5px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default AccessControlDesktopPage;
