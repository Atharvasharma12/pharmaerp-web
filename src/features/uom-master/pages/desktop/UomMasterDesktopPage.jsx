import { useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiX,
  FiInfo,
} from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi2";
import { BiCategory } from "react-icons/bi";

import {
  AppAlert,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppHeading,
  AppIconButton,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatCard,
  AppStatusBadge,
  AppTable,
  AppTableSkeleton,
  AppText,
  AppDialog,
  AppTag,
} from "@/components";

const statIcons = {
  total_products: <HiOutlineCube />,
  categories: <BiCategory />,
  manufacturers: <HiOutlineCube />,
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const UomMasterDesktopPage = ({
  products = [],
  dashboardStats = [],
  filters,
  activeFilterChips = [],
  isLoading,
  hasError,
  error,
  message,

  totalProducts = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,

  hasProducts,
  hasFilteredProducts,

  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
  handleRefresh,
  handlePageChange,
  handlePageSizeChange,
  handleExportCatalog,
  clearMessage,
}) => {
  const showInitialSkeleton = isLoading && !hasProducts;

  // Dialog / Modal Local States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUom, setSelectedUom] = useState(null);

  const handleOpenDetails = (u) => {
    setSelectedUom(u);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUom(null);
  };

  const columns = [
    {
      id: "abbreviation",
      key: "displaySku",
      label: "Abbreviation",
      minWidth: 150,
      render: (_, u) => (
        <div className="flex items-center gap-3 min-w-0 h-full">
          <div className="flex items-center justify-center shrink-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt border border-border">
              <HiOutlineCube className="text-[16px] text-text-muted" />
            </span>
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <AppHeading level={3} weight={700} sx={productNameSx}>
              {u?.displaySku || "-"}
            </AppHeading>
          </div>
        </div>
      ),
    },
    {
      id: "name",
      key: "displayName",
      label: "Full Name",
      minWidth: 200,
      render: (_, u) => (
        <AppText variant="body2" sx={{ fontWeight: 650, color: "var(--app-color-text)" }}>
          {u?.displayName || "-"}
        </AppText>
      ),
    },
    {
      id: "description",
      key: "displayManufacturer",
      label: "Description",
      minWidth: 400,
      render: (_, u) => (
        <AppText variant="body2" sx={descriptionSx}>
          {u?.displayManufacturer || "-"}
        </AppText>
      ),
    },
    {
      id: "status",
      key: "displayStatus",
      label: "Status",
      width: 120,
      render: (_, u) => (
        <AppStatusBadge
          status={u?.displayStatus || "inactive"}
          label={u?.displayStatus || "inactive"}
          variant="soft"
          size="small"
          rounded="md"
          colorVariant={statusColorMap[u?.displayStatus] || "neutral"}
          sx={statusBadgeSx}
        />
      ),
    },
    {
      id: "scope",
      key: "displayAvailability",
      label: "Scope",
      width: 120,
      render: (_, u) => (
        <AppText variant="body2" sx={tableValueMutedSx}>
          {u?.displayAvailability || "Global"}
        </AppText>
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 80,
      render: (_, u) => (
        <AppIconButton
          icon={<FiEye />}
          variant="text"
          colorVariant="neutral"
          size="small"
          rounded="md"
          onClick={() => handleOpenDetails(u)}
          sx={actionButtonSx}
        />
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      {message ? <TopToast message={message} onClose={clearMessage} /> : null}

      <div className="mx-auto w-full max-w-[1500px]">
        <AppBox
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={pageHeaderSx}
        >
          <AppBox sx={pageHeaderContentSx}>
            <AppHeading level={1} weight={650}>
              UOM Master Catalog
            </AppHeading>
            <AppText variant="body2" sx={pageHeaderSubtitleSx}>
              Browse and inspect platform Units of Measure (UOM) linked across inventories.
            </AppText>
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Catalog" },
                { label: "UOM Master", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          </AppBox>

          <AppStack
            direction="row"
            align="center"
            justify="flex-end"
            gap={1.1}
            sx={{ flexShrink: 0 }}
          >
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
            <AppButton
              type="button"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              size="small"
              startIcon={<FiDownload />}
              onClick={handleExportCatalog}
              sx={primaryButtonSx}
            >
              Export Sheets
            </AppButton>
          </AppStack>
        </AppBox>

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

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={tableCardSx}
        >
          <TableToolbar
            filters={filters}
            activeFilterChips={activeFilterChips}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
            handleRemoveFilter={handleRemoveFilter}
            handleClearFilters={handleClearFilters}
          />

          {hasError ? (
            <AppErrorState
              title="Unable to load UOMs"
              description={
                error || "Please check network logs and retry data sync."
              }
              actionText="Refresh"
              onRetry={handleRefresh}
              size="page"
              sx={stateSx}
            />
          ) : showInitialSkeleton ? (
            <AppTableSkeleton rows={8} columns={6} showHeader={false} />
          ) : !hasProducts ? (
            <AppEmptyState
              title="No UOM Records Listed"
              description="The centralized UOM registry is currently empty."
              icon={<HiOutlineCube />}
              size="page"
              sx={stateSx}
            />
          ) : !hasFilteredProducts ? (
            <AppEmptyState
              title="No Matching Entries Encountered"
              description="Refine your UOM search terms or status parameters."
              icon={<FiSearch />}
              action={
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  onClick={handleClearFilters}
                >
                  Reset Parameters
                </AppButton>
              }
              size="page"
              sx={stateSx}
            />
          ) : (
            <AppTable
              columns={columns}
              rows={products}
              getRowId={(row) => row._id}
              dense
              bordered={false}
              rounded={false}
              hover
              stickyHeader
              minWidth={1000}
              maxHeight="calc(100vh - 340px)"
              sx={tableSx}
              headSx={tableHeadSx}
              cellSx={tableCellSx}
            />
          )}

          {hasProducts && totalProducts > 10 ? (
            <TableFooter
              totalProducts={totalProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          ) : null}
        </AppCard>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* DETAIL OVERLAY MODAL                                    */}
      {/* ──────────────────────────────────────────────────────── */}
      <AppDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        rounded="lg"
        disableHeader={true}
        DialogProps={{ title: null, header: null }}
      >
        <AppBox sx={dialogContentWrapperSx}>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <AppStack direction="row" align="center" gap={1.2}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiInfo className="text-[18px]" />
              </span>
              <AppBox>
                <AppHeading level={2} weight={750} sx={dialogTitleSx}>
                  UOM Entry Detailed Record
                </AppHeading>
                <AppText
                  variant="body2"
                  sx={{
                    fontSize: "11px",
                    color: "var(--app-color-text-muted)",
                  }}
                >
                  Centralized platform system lookup overview
                </AppText>
              </AppBox>
            </AppStack>
            <AppIconButton
              icon={<FiX />}
              variant="text"
              colorVariant="neutral"
              size="small"
              onClick={handleCloseDialog}
            />
          </div>

          {selectedUom && (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Abbreviation
                  </span>
                  <AppHeading level={3} weight={700} sx={dialogValueCodeSx}>
                    {selectedUom.displaySku}
                  </AppHeading>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Full Name
                  </span>
                  <AppText
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      fontWeight: 700,
                      mt: 0.5,
                      color: "var(--app-color-text)",
                    }}
                  >
                    {selectedUom.displayName}
                  </AppText>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  UOM Description
                </span>
                <AppCard
                  variant="default"
                  rounded="md"
                  bordered
                  padding="md"
                  sx={{
                    mt: 1,
                    bgcolor: "var(--app-color-surface-alt)",
                    borderColor: "var(--app-color-border)",
                  }}
                >
                  <AppText variant="body2" sx={dialogDescTextSx}>
                    {selectedUom.description ||
                      "No specific description provided for this UOM master record."}
                  </AppText>
                </AppCard>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-3 gap-3 bg-surface-alt/20 p-2.5 rounded-lg">
                <div>
                  <span className="text-[10px] font-semibold text-text-muted block">
                    Active Status
                  </span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[12px] font-bold capitalize ${selectedUom.displayStatus === "active" ? "text-success" : "text-text-muted"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${selectedUom.displayStatus === "active" ? "bg-success" : "bg-text-muted"}`}
                      />
                      {selectedUom.displayStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-text-muted block">
                    Scope Isolation
                  </span>
                  <AppText
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      fontWeight: 650,
                      mt: 0.5,
                      color: "var(--app-color-text)",
                    }}
                  >
                    {selectedUom.displayAvailability} System
                  </AppText>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-text-muted block">
                    Db Record ID
                  </span>
                  <AppText
                    variant="body2"
                    sx={{
                      fontSize: "11px",
                      fontFamily: "monospace",
                      mt: 0.5,
                      color: "var(--app-color-text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedUom._id}
                  </AppText>
                </div>
              </div>
            </div>
          )}
        </AppBox>
      </AppDialog>
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
  <div className="mt-4 grid grid-cols-3 gap-3">
    {stats.map((stat) => (
      <AppStatCard
        key={stat.id}
        title={stat.title}
        value={stat.value}
        subtitle={stat.description}
        icon={statIcons[stat.id] || <HiOutlineCube />}
        colorVariant={stat.colorVariant}
        variant="default"
        sx={statCardSx}
        iconSx={statIconSx}
      />
    ))}
  </div>
);

const TableToolbar = ({
  filters,
  activeFilterChips,
  handleFilterChange,
  handleSearchChange,
  handleRemoveFilter,
  handleClearFilters,
}) => (
  <div className="border-b border-border px-3.5 py-3">
    <div className="grid grid-cols-[1fr_180px] items-center gap-3">
      <AppSearchInput
        name="search"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Query UOM catalog by abbreviation, full name, or description seg..."
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
        options={[
          { label: "All Mapped Statuses", value: "all" },
          { label: "Active Classification", value: "true" },
          { label: "Inactive Classification", value: "false" },
        ]}
        size="small"
        variant="bordered"
        rounded="md"
        sx={selectSx}
        inputSx={filterInputSx}
      />
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
          </button>
        ))}

        <button
          type="button"
          onClick={handleClearFilters}
          className="text-[11px] font-semibold text-primary"
        >
          Clear filters
        </button>
      </AppStack>
    ) : null}
  </div>
);

const TableFooter = ({
  totalProducts,
  currentPage,
  totalPages,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalProducts);

  return (
    <div className="flex items-center justify-between border-t border-border px-3.5 py-3">
      <AppText variant="body2" sx={footerTextSx}>
        Showing {startEntry} to {endEntry} of {totalProducts} master entries
      </AppText>

      <AppStack direction="row" align="center" gap={1}>
        <AppSelect
          name="tablePageSize"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          options={[
            { label: "10 items / page", value: 10 },
            { label: "20 items / page", value: 20 },
            { label: "50 items / page", value: 50 },
          ]}
          size="small"
          variant="bordered"
          rounded="md"
          sx={pageSizeSelectSx}
          inputSx={pageSizeInputSx}
        />

        <AppIconButton
          icon={<FiChevronLeft />}
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />

        <span className="flex h-[31px] min-w-[31px] items-center justify-center rounded-md bg-primary px-2 text-[12px] font-bold text-text-inverse">
          {currentPage}
        </span>

        <AppIconButton
          icon={<FiChevronRight />}
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </AppStack>
    </div>
  );
};

// Styles
const pageHeaderSx = { width: "100%" };
const pageHeaderSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
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

const breadcrumbSx = { mt: 1 };
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
  height: 36,
  px: 1.6,
  fontSize: "12px",
  fontWeight: 700,
};
const secondaryButtonSx = {
  height: 36,
  minWidth: 92,
  px: 1.4,
  fontSize: "12px",
  fontWeight: 650,
};

const alertSx = { mt: 3 };
const statCardSx = {
  minHeight: 88,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  p: 1.5,
  "& p:first-of-type": { fontSize: "11px" },
  "& h1, & h2, & h3, & h4": { fontSize: "18px" },
  "& p:last-of-type": { fontSize: "11px" },
};
const statIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "11px",
  "& svg": { fontSize: 19 },
};

const tableCardSx = {
  mt: 3,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  "& > div": { minWidth: 0 },
};

const searchSx = { width: "100%" };
const selectSx = { width: "100%" };
const filterInputSx = {
  height: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const chipsRowSx = { mt: 1.2, flexWrap: "wrap" };

const tableSx = {
  "& .MuiTableContainer-root": {
    borderRadius: 0,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": { display: "none" },
  },
};
const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11.2px",
    fontWeight: 750,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};
const tableCellSx = {
  py: 1.2,
  fontSize: "12px",
  borderColor: "var(--app-color-border)",
};

const tableValueMutedSx = {
  fontSize: "12px",
  fontWeight: 550,
  color: "var(--app-color-text-muted)",
};

const productNameSx = {
  m: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const descriptionSx = {
  maxWidth: 550,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12px",
  lineHeight: "18px",
  color: "var(--app-color-text)",
};
const statusBadgeSx = {
  width: "fit-content",
  height: 22,
  px: 1.5,
  fontSize: "10.5px",
  fontWeight: 700,
  textTransform: "capitalize",
};
const actionButtonSx = { color: "var(--app-color-text-muted)" };

const footerTextSx = { fontSize: "12px", color: "var(--app-color-text-muted)" };
const pageSizeSelectSx = { width: 145 };
const pageSizeInputSx = { height: 32, fontSize: "11.5px", py: 0 };
const stateSx = { minHeight: 430 };
const toastSx = { boxShadow: "var(--app-shadow-lg)" };

const dialogContentWrapperSx = {
  p: 2.5,
  bgcolor: "var(--app-color-surface)",
};
const dialogTitleSx = {
  m: 0,
  fontSize: "15px",
  color: "var(--app-color-text)",
};
const dialogValueCodeSx = {
  m: 0,
  fontSize: "20px",
  color: "var(--app-color-text)",
  letterSpacing: "-0.3px",
  mt: 0.25,
};
const dialogDescTextSx = {
  fontSize: "12.5px",
  lineHeight: "20px",
  color: "var(--app-color-text)",
};

export default UomMasterDesktopPage;
