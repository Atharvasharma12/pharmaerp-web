import {
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiRefreshCw,
  FiZap,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppErrorState,
  AppHeading,
  AppStack,
  AppStatCard,
  AppTableSkeleton,
  AppText,
  HELP_SUPPORT_CARD,
  PageHeader,
  PageRightSidebar,
} from "@/components";

import { HiOutlineCube } from "react-icons/hi2";

const statIcons = {
  global: <FiBox />,
  workspace: <FiBox />,
  hsnMaster: <HiOutlineCube />,
};

const overviewIcons = {
  globalProducts: <FiBox />,
  workspaceProducts: <FiBox />,
  hsnMaster: <HiOutlineCube />,
};

const CatalogDesktopPage = ({
  dashboardStats = [],
  catalogModules = [],

  isLoading,
  hasError,
  error,
  message,

  handleRefresh,
  clearMessage,
}) => {
  const showInitialSkeleton = isLoading;

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          title="Catalog"
          subtitle="Manage your global and workspace product catalogs."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Catalog", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          actions={
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiRefreshCw />}
              onClick={handleRefresh}
              loading={isLoading}
              disabled={isLoading}
              sx={secondaryButtonSx}
            >
              Refresh
            </AppButton>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

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
              title="Unable to load catalog"
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
              <CatalogOverviewCard items={catalogModules} />
            </div>

            <CatalogRightSidebar />
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

const StatsGrid = ({ stats }) => (
  <div className="mt-4 grid grid-cols-5 gap-3">
    {stats.map((stat) => (
      <AppStatCard
        key={stat.id}
        title={stat.title}
        value={stat.value}
        subtitle={stat.description}
        icon={statIcons[stat.id] || <FiBox />}
        colorVariant={stat.colorVariant}
        variant="default"
        sx={statCardSx}
        iconSx={statIconSx}
      />
    ))}
  </div>
);

const CatalogOverviewCard = ({ items = [] }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <SectionHeader
      title="Catalog Overview"
      subtitle="Access all product catalogs from one place."
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
            icon={overviewIcons[item.id] || <FiBox />}
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

const CatalogRightSidebar = () => (
  <PageRightSidebar
    spacing={4}
    cards={[
      {
        title: "What is the Catalog?",
        icon: <FiBox />,
        colorVariant: "primary",
        variant: "default",
        description:
          "The catalog module helps you manage product listings across the entire system.",
        points: [
          "View global products",
          "Manage workspace-specific inventory",
          "Organize categories (Coming Soon)",
          "Manage platform HSN codes",
        ],
        pointIcon: <FiCheckCircle />,
      },
      {
        title: "Best Practices",
        icon: <FiZap />,
        colorVariant: "primary",
        variant: "soft",
        soft: true,
        points: [
          "Keep product details up to date",
          "Use standard taxonomy",
          "Review product lists regularly",
        ],
        pointIcon: <FiZap />,
        pointIconVariant: "zap",
      },
      HELP_SUPPORT_CARD,
    ]}
  />
);

const SectionHeader = ({ title, subtitle, action }) => (
  <AppBox
    display="flex"
    alignItems="flex-start"
    justifyContent="space-between"
    sx={{ width: "100%" }}
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
  </AppBox>
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
  minHeight: 88,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",

  "& .MuiCardContent-root": {
    p: 0,
  },

  p: 1.5,

  "& p:first-of-type": {
    fontSize: "11px",
  },

  "& h1, & h2, & h3, & h4, & h5, & h6": {
    fontSize: "18px",
  },

  "& p:last-of-type": {
    fontSize: "11px",
  },
};

const statIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "11px",

  "& svg": {
    fontSize: 19,
  },
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

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default CatalogDesktopPage;
