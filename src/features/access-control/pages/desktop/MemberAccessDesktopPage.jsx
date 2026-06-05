import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiEdit3,
  FiGitBranch,
  FiKey,
  FiLock,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiSliders,
  FiUserCheck,
  FiUsers,
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
  total: <FiUsers />,
  companies: <FiBriefcase />,
  branches: <FiGitBranch />,
  restricted: <FiLock />,
};

const MemberAccessDesktopPage = ({
  accessList = [],
  stats = [],

  filters,
  activeFilterChips = [],
  accessOptions = [],

  isLoading,
  hasError,
  error,
  message,

  totalAccessRecords = 0,
  filteredAccessRecordsCount = 0,
  hasAccessRecords,
  hasFilteredAccessRecords,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,

  handleRefresh,
  handleBackToAccessControl,
  handleAssignAccess,
  handleViewMembers,
  handleViewRoles,
  handleEditAccess,

  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasAccessRecords;

  const columns = [
    {
      id: "member",
      key: "displayName",
      label: "Member",
      minWidth: 285,
      render: (_, access) => <MemberCell access={access} />,
    },
    {
      id: "contact",
      key: "displayEmail",
      label: "Contact",
      minWidth: 230,
      render: (_, access) => <ContactCell access={access} />,
    },
    {
      id: "companyAccess",
      key: "accessAllCompanies",
      label: "Company Access",
      minWidth: 245,
      render: (_, access) => <CompanyAccessCell access={access} />,
    },
    {
      id: "branchAccess",
      key: "accessAllBranches",
      label: "Branch Access",
      minWidth: 245,
      render: (_, access) => <BranchAccessCell access={access} />,
    },
    {
      id: "status",
      key: "displayStatus",
      label: "Member Status",
      width: 145,
      render: (_, access) => (
        <AppStatusBadge
          status={access?.displayStatus || "inactive"}
          variant="soft"
          size="small"
          rounded="full"
        />
      ),
    },
    {
      id: "updatedAt",
      key: "updatedAt",
      label: "Updated",
      width: 170,
      render: (_, access) => (
        <AppText variant="body2" sx={tableValueSx}>
          {access?.displayUpdatedAt || "-"}
        </AppText>
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 115,
      render: (_, access) => (
        <AppIconButton
          icon={<FiEdit3 />}
          tooltip={
            access?.isOwner
              ? "Workspace owner already has full access"
              : "Edit access"
          }
          variant="soft"
          colorVariant={access?.isOwner ? "neutral" : "primary"}
          size="small"
          rounded="md"
          disabled={!access?.canEdit}
          onClick={() => handleEditAccess(access)}
        />
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <PageHeader
          isLoading={isLoading}
          onBack={handleBackToAccessControl}
          onRefresh={handleRefresh}
          onAssignAccess={handleAssignAccess}
          onViewMembers={handleViewMembers}
          onViewRoles={handleViewRoles}
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
            accessOptions={accessOptions}
            totalAccessRecords={totalAccessRecords}
            filteredAccessRecordsCount={filteredAccessRecordsCount}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
            handleRemoveFilter={handleRemoveFilter}
            handleClearFilters={handleClearFilters}
          />

          {hasError ? (
            <AppErrorState
              title="Unable to load member access"
              description={error || "Please refresh and try again."}
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          ) : showInitialSkeleton ? (
            <AppTableSkeleton rows={6} columns={7} showHeader={false} />
          ) : !hasAccessRecords ? (
            <AppEmptyState
              title="No member access records yet"
              description="Access records are created for workspace members. Assign access to configure company and branch visibility."
              icon={<FiKey />}
              action={
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  startIcon={<FiSliders />}
                  onClick={handleAssignAccess}
                >
                  Assign Access
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : !hasFilteredAccessRecords ? (
            <AppEmptyState
              title="No access records found"
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
              rows={accessList}
              getRowId={(row) => row._id}
              dense
              bordered={false}
              rounded={false}
              hover
              stickyHeader
              minWidth={1380}
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

const PageHeader = ({
  isLoading,
  onBack,
  onRefresh,
  onAssignAccess,
  onViewMembers,
  onViewRoles,
}) => (
  <AppStack direction="row" align="flex-start" justify="space-between">
    <AppStack direction="row" align="center" gap={1}>
      <IconBox icon={<FiKey />} large />

      <AppBox>
        <AppHeading level={1} weight={650} sx={pageTitleSx}>
          Member Access
        </AppHeading>

        <AppBreadcrumb
          size="small"
          variant="text"
          items={[
            { label: "Access Control", onClick: onBack },
            { label: "Member Access", current: true },
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
        startIcon={<FiArrowLeft />}
        onClick={onBack}
        sx={secondaryButtonSx}
      >
        Access Control
      </AppButton>

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
        variant="outlined"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiShield />}
        onClick={onViewRoles}
        sx={secondaryButtonSx}
      >
        Roles
      </AppButton>

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiUsers />}
        onClick={onViewMembers}
        sx={secondaryButtonSx}
      >
        Members
      </AppButton>

      <AppButton
        type="button"
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        startIcon={<FiSliders />}
        onClick={onAssignAccess}
        sx={primaryButtonSx}
      >
        Assign Access
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
        icon={statIcons[stat.id] || <FiKey />}
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
  accessOptions,
  totalAccessRecords,
  filteredAccessRecordsCount,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3 py-2.5">
    <div className="grid grid-cols-[minmax(240px,1fr)_minmax(490px,auto)] items-center gap-5">
      <AppBox sx={{ minWidth: 0 }}>
        <AppHeading level={2} weight={650} sx={sectionTitleSx}>
          Access Directory
        </AppHeading>

        <AppText variant="body2" sx={sectionSubtitleSx}>
          Showing {filteredAccessRecordsCount} of {totalAccessRecords} access
          records
        </AppText>
      </AppBox>

      <div className="grid min-w-[490px] grid-cols-[minmax(300px,1fr)_170px] items-center gap-3 justify-self-end">
        <AppSearchInput
          name="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search member, email, role, company..."
          clearable
          onClear={() => handleSearchChange("")}
          size="small"
          variant="bordered"
          rounded="md"
          sx={searchSx}
          inputSx={filterInputSx}
        />

        <AppSelect
          name="access"
          value={filters.access}
          onChange={handleFilterChange}
          options={accessOptions}
          size="small"
          variant="bordered"
          rounded="md"
          sx={selectSx}
          inputSx={filterInputSx}
        />
      </div>
    </div>

    {activeFilterChips.length ? (
      <AppStack direction="row" align="center" gap={0.7} sx={chipsRowSx}>
        {activeFilterChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => handleRemoveFilter(chip.key)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-alt px-2 py-1 text-[11px] font-semibold text-text-muted transition hover:bg-surface-hover"
          >
            {chip.label}
            <FiX className="text-[12px]" />
          </button>
        ))}

        <button
          type="button"
          onClick={handleClearFilters}
          className="text-[11px] font-semibold text-primary"
        >
          Clear all
        </button>
      </AppStack>
    ) : null}
  </div>
);

const MemberCell = ({ access }) => (
  <AppStack direction="row" align="center" gap={1.1}>
    <Avatar name={access?.displayName} />

    <AppBox sx={{ minWidth: 0 }}>
      <AppStack direction="row" align="center" gap={0.65}>
        <AppHeading level={3} weight={650} sx={memberNameSx}>
          {access?.displayName || "-"}
        </AppHeading>

        {access?.isOwner ? (
          <AppTag
            label="Owner"
            variant="soft"
            colorVariant="warning"
            size="small"
            rounded="full"
            icon={<FiCheckCircle />}
          />
        ) : null}
      </AppStack>

      <AppText variant="body2" sx={memberMetaSx}>
        {access?.displayRole || "Staff"}
      </AppText>
    </AppBox>
  </AppStack>
);

const ContactCell = ({ access }) => (
  <AppBox sx={{ minWidth: 0 }}>
    <AppKeyValue
      label="Email"
      value={access?.displayEmail || "-"}
      dense
      sx={keyValueSx}
      labelSx={keyLabelSx}
      valueSx={keyTextSx}
    />

    <AppKeyValue
      label="Phone"
      value={access?.displayPhone || "-"}
      dense
      sx={keyValueSx}
      labelSx={keyLabelSx}
      valueSx={keyTextSx}
    />
  </AppBox>
);

const CompanyAccessCell = ({ access }) => (
  <AccessScopeCell
    fullAccess={access?.accessAllCompanies}
    fullLabel="All companies"
    limitedLabel={access?.companyAccessLabel}
    preview={access?.companyPreview}
    count={access?.companyCount}
    icon={<FiBriefcase />}
  />
);

const BranchAccessCell = ({ access }) => (
  <AccessScopeCell
    fullAccess={access?.accessAllBranches}
    fullLabel="All branches"
    limitedLabel={access?.branchAccessLabel}
    preview={access?.branchPreview}
    count={access?.branchCount}
    icon={<FiGitBranch />}
  />
);

const AccessScopeCell = ({
  fullAccess,
  fullLabel,
  limitedLabel,
  preview = [],
  count = 0,
  icon,
}) => (
  <AppBox sx={{ minWidth: 0 }}>
    <AppTag
      label={fullAccess ? fullLabel : limitedLabel}
      variant="soft"
      colorVariant={fullAccess ? "success" : "warning"}
      size="small"
      rounded="full"
      icon={icon}
    />

    {!fullAccess ? (
      <AppText variant="body2" sx={scopePreviewSx}>
        {preview.length ? preview.join(", ") : "No selected records"}
        {count > preview.length ? ` +${count - preview.length} more` : ""}
      </AppText>
    ) : (
      <AppText variant="body2" sx={scopePreviewSx}>
        Full workspace-level access
      </AppText>
    )}
  </AppBox>
);

const Avatar = ({ name }) => {
  const initials = String(name || "M")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-bold text-primary">
      {initials || "M"}
    </span>
  );
};

const IconBox = ({ icon, colorVariant = "primary", large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 42 : 38,
      height: large ? 42 : 38,
      minWidth: large ? 42 : 38,
      borderRadius: "12px",
      bgcolor: `var(--app-color-${colorVariant}-soft)`,
      color: `var(--app-color-${colorVariant})`,
      fontSize: large ? "22px" : "19px",
    }}
  >
    {icon}
  </AppBox>
);

const pageTitleSx = {
  m: 0,
  fontSize: "25px",
  lineHeight: 1.18,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const breadcrumbSx = {
  mt: 0.4,
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

const primaryButtonSx = {
  height: 34,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 700,
};

const secondaryButtonSx = {
  height: 34,
  px: 1.25,
  fontSize: "12px",
  fontWeight: 650,
};

const statCardSx = {
  px: 1.45,
  py: 1.35,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const statTitleSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const statValueSx = {
  mt: 0.25,
  mb: 0,
  fontSize: "25px",
  lineHeight: 1.05,
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const alertSx = {
  mt: 3,
};

const tableCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "16px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.35,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const searchSx = {
  width: "100%",
};

const selectSx = {
  width: "100%",
};

const filterInputSx = {
  height: 35,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const chipsRowSx = {
  mt: 1.2,
  flexWrap: "wrap",
};

const tableSx = {
  "& .MuiTableContainer-root": {
    borderRadius: 0,
  },
};

const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11px",
    fontWeight: 750,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};

const tableCellSx = {
  py: 1,
  fontSize: "12px",
  borderColor: "var(--app-color-border)",
};

const tableValueSx = {
  fontSize: "12px",
  fontWeight: 550,
  color: "var(--app-color-text)",
};

const memberNameSx = {
  m: 0,
  maxWidth: 180,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const memberMetaSx = {
  mt: 0.35,
  maxWidth: 220,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

const keyValueSx = {
  mb: 0.35,
  alignItems: "center",
  gap: 0.7,
};

const keyLabelSx = {
  minWidth: 42,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const keyTextSx = {
  maxWidth: 165,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11.5px",
  fontWeight: 600,
  color: "var(--app-color-text)",
};

const scopePreviewSx = {
  mt: 0.6,
  maxWidth: 210,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const stateSx = {
  minHeight: 330,
};

const toastSx = {
  boxShadow: "var(--app-shadow-lg)",
};

export default MemberAccessDesktopPage;
