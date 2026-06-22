import React, { useMemo } from "react";
import {
  FiArrowRight,
  FiChevronDown,
  FiInfo,
  FiSearch,
  FiSliders,
  FiUsers,
  FiTruck,
} from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppSearchInput,
  AppStack,
  AppText,
} from "@/components";

const PartiesDesktopPage = ({
  searchQuery,
  setSearchQuery,
  partiesData,
  handleViewCustomers,
  handleViewSuppliers,
}) => {
  const filteredTypes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ["customers", "suppliers"];
    
    const matched = [];
    if ("customers".includes(query) || "customer".includes(query)) {
      matched.push("customers");
    }
    if ("suppliers".includes(query) || "supplier".includes(query)) {
      matched.push("suppliers");
    }
    return matched;
  }, [searchQuery]);

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-between">
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard" },
              { label: "Parties", current: true },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* Page Header */}
        <div className="mt-2.5">
          <AppHeading level={1} weight={700} sx={pageTitleSx}>
            Parties
          </AppHeading>
          <AppText variant="body2" sx={pageSubtitleSx}>
            Manage all your customers and suppliers in one place. View party details and navigate to respective sections.
          </AppText>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="w-[380px]">
            <AppSearchInput
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parties..."
              clearable
              onClear={() => setSearchQuery("")}
              size="small"
              variant="bordered"
              rounded="md"
              sx={searchSx}
              inputSx={searchInputSx}
            />
          </div>

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            startIcon={<FiSliders />}
            endIcon={<FiChevronDown />}
            sx={filterButtonSx}
          >
            More Filters
          </AppButton>
        </div>

        {/* Highlight Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTypes.includes("customers") && (
            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="sm"
              padding="none"
              sx={customerCardSx}
            >
              <div className="relative p-5 overflow-hidden h-full flex flex-col justify-between min-h-[175px]">
                {/* Faded background icon */}
                <FiUsers className="absolute -right-4 -bottom-4 text-[130px] text-success/5 pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Left Icon block */}
                    <AppBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "var(--app-color-success-soft)",
                        color: "var(--app-color-success)",
                        flexShrink: 0,
                      }}
                    >
                      <FiUsers className="text-[22px]" />
                    </AppBox>

                    {/* Content */}
                    <div>
                      <AppHeading level={3} weight={700} sx={cardTitleSx}>
                        Customers
                      </AppHeading>
                      <AppText variant="body2" sx={cardDescSx}>
                        View and manage all your customer records.
                      </AppText>
                    </div>
                  </div>

                  {/* Top-right small icon decoration */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-soft/30 text-success text-[15px]">
                    <FiUsers />
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between z-10">
                  <div>
                    <span className="block text-[28px] font-bold text-success leading-none">
                      {partiesData.customers.total.toLocaleString()}
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold text-text-muted">
                      Total Customers
                    </span>
                  </div>

                  <AppButton
                    variant="outlined"
                    colorVariant="success"
                    size="small"
                    onClick={handleViewCustomers}
                    endIcon={<FiArrowRight />}
                    sx={viewBtnSx}
                  >
                    View Customers
                  </AppButton>
                </div>
              </div>
            </AppCard>
          )}

          {filteredTypes.includes("suppliers") && (
            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="sm"
              padding="none"
              sx={supplierCardSx}
            >
              <div className="relative p-5 overflow-hidden h-full flex flex-col justify-between min-h-[175px]">
                {/* Faded background icon */}
                <FiTruck className="absolute -right-4 -bottom-4 text-[130px] text-info/5 pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Left Icon block */}
                    <AppBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "var(--app-color-info-soft)",
                        color: "var(--app-color-info)",
                        flexShrink: 0,
                      }}
                    >
                      <FiTruck className="text-[22px]" />
                    </AppBox>

                    {/* Content */}
                    <div>
                      <AppHeading level={3} weight={700} sx={cardTitleSx}>
                        Suppliers
                      </AppHeading>
                      <AppText variant="body2" sx={cardDescSx}>
                        View and manage all your supplier records.
                      </AppText>
                    </div>
                  </div>

                  {/* Top-right small icon decoration */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info-soft/30 text-info text-[15px]">
                    <FiTruck />
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between z-10">
                  <div>
                    <span className="block text-[28px] font-bold text-info leading-none">
                      {partiesData.suppliers.total.toLocaleString()}
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold text-text-muted">
                      Total Suppliers
                    </span>
                  </div>

                  <AppButton
                    variant="outlined"
                    colorVariant="info"
                    size="small"
                    onClick={handleViewSuppliers}
                    endIcon={<FiArrowRight />}
                    sx={viewBtnSx}
                  >
                    View Suppliers
                  </AppButton>
                </div>
              </div>
            </AppCard>
          )}
        </div>

        {/* Parties Summary Section */}
        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={summaryCardSx}
        >
          <div className="px-5 py-4 border-b border-border">
            <AppHeading level={2} weight={700} sx={summaryTitleSx}>
              Parties Summary
            </AppHeading>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface-alt/50 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="px-5 py-3.5">Party Type</th>
                  <th className="px-5 py-3.5">Total Parties</th>
                  <th className="px-5 py-3.5">Active</th>
                  <th className="px-5 py-3.5">Inactive</th>
                  <th className="px-5 py-3.5">Recent Added</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[12.5px] font-medium text-text">
                {filteredTypes.includes("customers") && (
                  <tr className="hover:bg-surface-hover/30 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-success text-[15px]">
                          <FiUsers />
                        </span>
                        <span className="font-bold text-text">Customers</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">{partiesData.customers.total.toLocaleString()}</td>
                    <td className="px-5 py-4 text-success font-bold">{partiesData.customers.active.toLocaleString()}</td>
                    <td className="px-5 py-4 text-danger font-bold">{partiesData.customers.inactive.toLocaleString()}</td>
                    <td className="px-5 py-4 text-text-muted">{partiesData.customers.recent}</td>
                    <td className="px-5 py-4 text-right">
                      <AppButton
                        variant="outlined"
                        colorVariant="success"
                        size="small"
                        onClick={handleViewCustomers}
                        endIcon={<FiArrowRight />}
                        sx={tableActionBtnSx}
                      >
                        View Customers
                      </AppButton>
                    </td>
                  </tr>
                )}
                {filteredTypes.includes("suppliers") && (
                  <tr className="hover:bg-surface-hover/30 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-info-soft text-info text-[15px]">
                          <FiTruck />
                        </span>
                        <span className="font-bold text-text">Suppliers</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">{partiesData.suppliers.total.toLocaleString()}</td>
                    <td className="px-5 py-4 text-success font-bold">{partiesData.suppliers.active.toLocaleString()}</td>
                    <td className="px-5 py-4 text-danger font-bold">{partiesData.suppliers.inactive.toLocaleString()}</td>
                    <td className="px-5 py-4 text-text-muted">{partiesData.suppliers.recent}</td>
                    <td className="px-5 py-4 text-right">
                      <AppButton
                        variant="outlined"
                        colorVariant="info"
                        size="small"
                        onClick={handleViewSuppliers}
                        endIcon={<FiArrowRight />}
                        sx={tableActionBtnSx}
                      >
                        View Suppliers
                      </AppButton>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </AppCard>

        {/* Bottom Alert banner */}
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-info-soft/30 px-4 py-3.5 text-[13px] text-info">
          <FiInfo className="text-[17px] shrink-0 text-info" />
          <span className="font-medium">
            You can view party details and manage them from their respective sections.
          </span>
        </div>
      </div>
    </section>
  );
};

// Styling tokens
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageTitleSx = {
  m: 0,
  fontSize: "25px",
  lineHeight: 1.15,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.55,
  fontSize: "13px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const searchSx = { width: "100%" };
const searchInputSx = {
  height: 36,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const filterButtonSx = {
  height: 36,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 650,
};

const customerCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "var(--app-shadow-md)",
    borderColor: "var(--app-color-success)",
  },
};

const supplierCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "var(--app-shadow-md)",
    borderColor: "var(--app-color-info)",
  },
};

const cardTitleSx = {
  m: 0,
  fontSize: "16px",
  color: "var(--app-color-text)",
};

const cardDescSx = {
  mt: 0.5,
  fontSize: "12px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const viewBtnSx = {
  height: 32,
  px: 1.5,
  fontSize: "12px",
  fontWeight: 700,
};

const summaryCardSx = {
  mt: 6,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const summaryTitleSx = {
  m: 0,
  fontSize: "16px",
  color: "var(--app-color-text)",
};

const tableActionBtnSx = {
  height: 30,
  fontSize: "11px",
  fontWeight: 700,
};

export default PartiesDesktopPage;
