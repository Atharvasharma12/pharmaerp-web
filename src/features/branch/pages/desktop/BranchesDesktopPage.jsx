// src/features/branch/pages/desktop/BranchesDesktopPage.jsx

import {
  FiGitBranch,
  FiEdit2,
  FiEye,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppKeyValue,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppTable,
  AppTableSkeleton,
  AppTag,
  AppText,
  AppEmptyState,
  AppErrorState,
} from "@/components";

const statIcons = {
  total: <FiGitBranch />,
  active: <FiGitBranch />,
  inactive: <FiGitBranch />,
  suspended: <FiGitBranch />,
};

const BranchesDesktopPage = ({
  branches = [],
  stats = [],

  filters,
  activeFilterChips = [],
  statusOptions = [],
  branchTypeOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalBranches = 0,
  filteredBranchesCount = 0,
  hasBranches,
  hasFilteredBranches,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleCreateBranch,
  handleViewBranch,
  handleEditBranch,
  handleOpenSettings,
  handleDeleteBranch,
  handleRefresh,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasBranches;

  const columns = [
    {
      id: "branch",
      key: "name",
      label: "Branch",
      minWidth: 240,
      render: (_, branch) => <BranchCell branch={branch} />,
    },
    {
      id: "contact",
      key: "contact",
      label: "Contact",
      minWidth: 240,
      render: (_, branch) => <ContactCell branch={branch} />,
    },
    {
      id: "license",
      key: "license",
      label: "License",
      minWidth: 220,
      render: (_, branch) => <LicenseCell branch={branch} />,
    },
    {
      id: "pharmacist",
      key: "pharmacist",
      label: "Pharmacist",
      minWidth: 220,
      render: (_, branch) => <PharmacistCell branch={branch} />,
    },
    {
      id: "type",
      key: "type",
      label: "Type",
      minWidth: 150,
      render: (_, branch) => (
        <AppTag
          label={branch?.displayType || "-"}
          variant="soft"
          colorVariant="primary"
          size="small"
          rounded="full"
        />
      ),
    },
    {
      id: "primary",
      key: "isPrimary",
      label: "Primary",
      width: 100,
      render: (_, branch) =>
        branch?.isPrimary ? (
          <AppTag
            label="Primary"
            variant="soft"
            colorVariant="success"
            size="small"
            rounded="full"
          />
        ) : (
          <AppText variant="body2" sx={mutedTextSx}>
            -
          </AppText>
        ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      width: 115,
      render: (_, branch) => (
        <AppStatusBadge
          status={branch?.status || "inactive"}
          variant="soft"
          size="small"
          rounded="full"
        />
      ),
    },
    {
      id: "createdAt",
      key: "createdAt",
      label: "Created",
      width: 120,
      render: (_, branch) => (
        <AppText variant="body2" sx={tableValueSx}>
          {branch?.displayCreatedAt || "-"}
        </AppText>
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 155,
      render: (_, branch) => (
        <AppStack direction="row" align="center" justify="flex-end" gap={0.45}>
          <AppIconButton
            icon={<FiEye />}
            tooltip="View branch"
            variant="soft"
            colorVariant="info"
            size="small"
            rounded="md"
            onClick={() => handleViewBranch(branch)}
          />

          <AppIconButton
            icon={<FiEdit2 />}
            tooltip="Edit branch"
            variant="soft"
            colorVariant="primary"
            size="small"
            rounded="md"
            onClick={() => handleEditBranch(branch)}
          />

          <AppIconButton
            icon={<FiSettings />}
            tooltip="Branch settings"
            variant="soft"
            colorVariant="warning"
            size="small"
            rounded="md"
            onClick={() => handleOpenSettings(branch)}
          />

          <AppIconButton
            icon={<FiTrash2 />}
            tooltip="Delete branch"
            variant="soft"
            colorVariant="error"
            size="small"
            rounded="md"
            disabled={branch?.isPrimary}
            onClick={() => handleDeleteBranch(branch)}
          />
        </AppStack>
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onCreate={handleCreateBranch}
        />

        <StatsGrid stats={stats} />

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

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={tableCardSx}
        >
          <TableHeader
            filters={filters}
            activeFilterChips={activeFilterChips}
            statusOptions={statusOptions}
            branchTypeOptions={branchTypeOptions}
            totalBranches={totalBranches}
            filteredBranchesCount={filteredBranchesCount}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
            handleRemoveFilter={handleRemoveFilter}
            handleClearFilters={handleClearFilters}
          />

          {hasError ? (
            <AppErrorState
              title="Unable to load branches"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          ) : showInitialSkeleton ? (
            <AppTableSkeleton rows={6} columns={9} showHeader={false} />
          ) : !hasBranches ? (
            <AppEmptyState
              title="No branches yet"
              description="Create your first branch to start managing locations for this company."
              icon={<FiGitBranch />}
              action={
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  startIcon={<FiPlus />}
                  onClick={handleCreateBranch}
                >
                  Create Branch
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : !hasFilteredBranches ? (
            <AppEmptyState
              title="No branches found"
              description="Try changing your search or filters."
              icon={<FiSearch />}
              action={
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : (
            <AppTable
              columns={columns}
              rows={branches}
              getRowId={(row) => row._id}
              dense
              bordered={false}
              rounded={false}
              hover
              stickyHeader
              minWidth={1450}
              maxHeight="calc(100vh - 315px)"
              sx={tableSx}
              headSx={tableHeadSx}
              cellSx={tableCellSx}
            />
          )}
        </AppCard>
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

const PageHeader = ({ isLoading, onRefresh, onCreate }) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiGitBranch />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Branches
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Branches", current: true },
          ]}
          sx={breadcrumbSx}
          itemSx={breadcrumbItemSx}
          currentItemSx={breadcrumbCurrentSx}
        />
      </AppBox>
    </AppStack>

    <AppStack direction="row" align="center" gap={0.8}>
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

      <AppButton
        type="button"
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiPlus />}
        onClick={onCreate}
        sx={primaryButtonSx}
      >
        Create Branch
      </AppButton>
    </AppStack>
  </AppStack>
);

const StatsGrid = ({ stats }) => (
  <div className="mt-4 grid grid-cols-4 gap-3">
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
        icon={statIcons[stat.id] || <FiGitBranch />}
        colorVariant={stat.colorVariant}
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

const TableHeader = ({
  filters,
  activeFilterChips,
  statusOptions,
  branchTypeOptions,
  totalBranches,
  filteredBranchesCount,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3 py-2.5">
    <div className="grid grid-cols-[minmax(220px,1fr)_minmax(620px,auto)] items-center gap-5">
      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sectionTitleSx}>
          Branch Directory
        </AppHeading>

        <AppText variant="body2" sx={sectionSubtitleSx}>
          Showing {filteredBranchesCount} of {totalBranches} branches
        </AppText>
      </AppBox>

      <div className="grid min-w-[620px] grid-cols-[minmax(280px,1fr)_145px_185px] items-center gap-3 justify-self-end">
        <AppSearchInput
          name="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search branch, license, pharmacist..."
          clearable
          onClear={() => handleSearchChange("")}
          size="small"
          variant="bordered"
          rounded="md"
          sx={searchSx}
          inputSx={filterInputSx}
        />

        <AppSelect
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          options={statusOptions}
          size="small"
          variant="bordered"
          rounded="md"
          sx={selectSx}
          inputSx={filterInputSx}
        />

        <AppSelect
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          options={branchTypeOptions}
          size="small"
          variant="bordered"
          rounded="md"
          sx={typeSelectSx}
          inputSx={filterInputSx}
        />
      </div>
    </div>

    {activeFilterChips.length ? (
      <AppStack
        direction="row"
        align="center"
        justify="space-between"
        sx={{ mt: 1 }}
      >
        <AppStack direction="row" align="center" gap={0.55} wrap="wrap">
          {activeFilterChips.map((filter) => (
            <AppTag
              key={filter.key}
              label={filter.label}
              removable
              onDelete={() => handleRemoveFilter(filter.key)}
              variant="soft"
              colorVariant="primary"
              size="small"
              rounded="full"
            />
          ))}
        </AppStack>

        <AppButton
          type="button"
          variant="text"
          colorVariant="primary"
          size="small"
          rounded="md"
          startIcon={<FiX />}
          onClick={handleClearFilters}
          sx={clearButtonSx}
        >
          Clear
        </AppButton>
      </AppStack>
    ) : null}
  </div>
);

const BranchCell = ({ branch }) => (
  <AppStack direction="row" align="center" gap={0.8}>
    <IconBox icon={<FiGitBranch />} small />

    <AppBox sx={{ minWidth: 0 }}>
      <AppHeading level={3} weight={650} sx={branchNameSx}>
        {branch.displayName}
      </AppHeading>

      <AppStack direction="row" align="center" gap={0.6} sx={{ mt: 0.25 }}>
        <AppText variant="body2" sx={mutedTextSx}>
          {branch.branchCode || "-"}
        </AppText>

        {branch.address?.city ? (
          <>
            <span className="h-1 w-1 rounded-full bg-border-strong" />

            <AppText variant="body2" sx={mutedTextSx}>
              {branch.address.city}
            </AppText>
          </>
        ) : null}
      </AppStack>
    </AppBox>
  </AppStack>
);

const ContactCell = ({ branch = {} }) => (
  <AppStack direction="column" gap={0.5}>
    <MiniInfo icon={<FiMail />} value={branch.displayEmail} />
    <MiniInfo icon={<FiPhone />} value={branch.displayPhone} />
    <MiniInfo icon={<FiMapPin />} value={branch.displayAddress} ellipsis />
  </AppStack>
);

const LicenseCell = ({ branch = {} }) => (
  <AppStack direction="column" gap={0.5}>
    <AppKeyValue
      label="Drug Lic."
      value={branch.displayDrugLicenseNumber}
      direction="row"
      align="space-between"
      size="small"
      sx={keyValueSx}
      labelSx={keyLabelSx}
      valueSx={keyValueTextSx}
    />

    <AppKeyValue
      label="Type"
      value={branch.displayDrugLicenseType}
      direction="row"
      align="space-between"
      size="small"
      sx={keyValueSx}
      labelSx={keyLabelSx}
      valueSx={keyValueTextSx}
    />

    <AppKeyValue
      label="FSSAI"
      value={branch.displayFssaiNumber}
      direction="row"
      align="space-between"
      size="small"
      sx={keyValueSx}
      labelSx={keyLabelSx}
      valueSx={keyValueTextSx}
    />
  </AppStack>
);

const PharmacistCell = ({ branch = {} }) => (
  <AppStack direction="column" gap={0.5}>
    <MiniInfo icon={<FiUser />} value={branch.displayPharmacistName} />
    <MiniInfo icon={<FiPhone />} value={branch.displayPharmacistMobile} />
    <MiniInfo icon={<FiMail />} value={branch.displayPharmacistEmail} />
  </AppStack>
);

const MiniInfo = ({ icon, value, ellipsis = false }) => (
  <AppStack direction="row" align="center" gap={0.55} sx={{ minWidth: 0 }}>
    <span className="flex shrink-0 text-[12px] text-text-muted">{icon}</span>

    <AppText
      variant="body2"
      sx={{
        ...tableValueSx,
        ...(ellipsis
          ? {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 195,
            }
          : {}),
      }}
    >
      {value || "-"}
    </AppText>
  </AppStack>
);

const IconBox = ({
  icon,
  colorVariant = "primary",
  small = false,
  large = false,
}) => {
  const size = large ? 38 : small ? 31 : 38;

  return (
    <AppBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: large ? "11px" : small ? "9px" : "11px",
        bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
        color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
        fontSize: large ? "19px" : small ? "15px" : "19px",
        lineHeight: 0,
      }}
    >
      {icon}
    </AppBox>
  );
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
  border: "1px solid var(--app-color-success-soft)",
};

const pageTitleSx = {
  m: 0,
  fontSize: "20px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const breadcrumbSx = {
  mt: 0.2,
};

const breadcrumbItemSx = {
  fontSize: "11.5px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
};

const breadcrumbCurrentSx = {
  fontSize: "11.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const secondaryButtonSx = {
  height: 34,
  px: 1.55,
  fontSize: "12px",
  fontWeight: 600,
  bgcolor: "var(--app-color-surface)",
};

const primaryButtonSx = {
  height: 34,
  px: 1.65,
  fontSize: "12px",
  fontWeight: 650,
  boxShadow: "var(--app-shadow-sm)",
};

const statCardSx = {
  px: 1.5,
  py: 1.35,
  minHeight: 88,
  bgcolor: "var(--app-color-surface)",
};

const statTitleSx = {
  fontSize: "11px",
  lineHeight: "14px",
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
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const alertSx = {
  mt: 1.5,
  mb: 1,
};

const tableCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14.5px",
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.35,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const searchSx = {
  width: "100%",
  minWidth: 0,
};

const selectSx = {
  width: "100%",
  minWidth: 0,
};

const typeSelectSx = {
  width: "100%",
  minWidth: 0,
};

const filterInputSx = {
  height: 33,
  fontSize: "11.8px",
  fontWeight: 500,
  bgcolor: "var(--app-color-surface-alt)",
};

const clearButtonSx = {
  height: 26,
  fontSize: "11.2px",
  fontWeight: 650,
};

const tableSx = {
  borderRadius: 0,
};

const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
};

const tableCellSx = {
  py: 0.9,
  fontSize: "11.7px",
};

const branchNameSx = {
  m: 0,
  maxWidth: 215,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.2px",
  color: "var(--app-color-text)",
};

const mutedTextSx = {
  fontSize: "10.8px",
  lineHeight: "14px",
  color: "var(--app-color-text-muted)",
};

const tableValueSx = {
  fontSize: "11.2px",
  lineHeight: "15px",
  fontWeight: 550,
  color: "var(--app-color-text)",
};

const keyValueSx = {
  gap: 0.8,
};

const keyLabelSx = {
  minWidth: 62,
  fontSize: "10.7px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const keyValueTextSx = {
  maxWidth: 125,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textAlign: "right",
  fontSize: "10.8px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const stateSx = {
  minHeight: 320,
};

export default BranchesDesktopPage;
