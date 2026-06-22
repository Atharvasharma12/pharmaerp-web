import React from "react";
import {
  FiArrowRight,
  FiInfo,
  FiUsers,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  AppButton,
  AppIconButton,
} from "@/components";

const PartiesMobilePage = ({
  partiesData,
  isLoading,
  handleRefresh,
  handleViewCustomers,
  handleViewSuppliers,
}) => {
  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Header Block */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Parties
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                Manage all your customers and suppliers in one place.
              </AppText>
            </AppBox>

            <AppIconButton
              icon={<FiRefreshCw />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleRefresh}
              loading={isLoading}
              disabled={isLoading}
              sx={actionHeaderIconBtnSx}
            />
          </AppStack>
        </AppBox>

        {/* Highlight Cards vertical stack */}
        <AppBox sx={sectionWrapperSx}>
          <AppStack direction="column" gap={1}>
            <AppCard
              key="customers"
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={customerCardSx}
            >
              <div className="relative p-3 overflow-hidden h-full flex flex-col justify-between min-h-[100px]">
                <FiUsers className="absolute -right-3 -bottom-3 text-[75px] text-success/5 pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Left color icon block */}
                    <AppBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        bgcolor: "var(--app-color-success-soft)",
                        color: "var(--app-color-success)",
                        flexShrink: 0,
                      }}
                    >
                      <FiUsers className="text-[15px]" />
                    </AppBox>

                    {/* Center block */}
                    <div className="min-w-0">
                      <AppHeading level={3} weight={700} sx={moduleTitleTextSx}>
                        Customers
                      </AppHeading>
                      <AppText variant="body2" sx={moduleDescTextSx}>
                        View and manage all your customer records.
                      </AppText>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-end justify-between z-10">
                  <div>
                    <span className="block text-[19px] font-bold text-success leading-none">
                      {partiesData.customers.total.toLocaleString()}
                    </span>
                    <span className="mt-1 block text-[10px] font-semibold text-text-muted">
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

            <AppCard
              key="suppliers"
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={supplierCardSx}
            >
              <div className="relative p-3 overflow-hidden h-full flex flex-col justify-between min-h-[100px]">
                <FiTruck className="absolute -right-3 -bottom-3 text-[75px] text-info/5 pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Left color icon block */}
                    <AppBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        bgcolor: "var(--app-color-info-soft)",
                        color: "var(--app-color-info)",
                        flexShrink: 0,
                      }}
                    >
                      <FiTruck className="text-[15px]" />
                    </AppBox>

                    {/* Center block */}
                    <div className="min-w-0">
                      <AppHeading level={3} weight={700} sx={moduleTitleTextSx}>
                        Suppliers
                      </AppHeading>
                      <AppText variant="body2" sx={moduleDescTextSx}>
                        View and manage all your supplier records.
                      </AppText>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-end justify-between z-10">
                  <div>
                    <span className="block text-[19px] font-bold text-info leading-none">
                      {partiesData.suppliers.total.toLocaleString()}
                    </span>
                    <span className="mt-1 block text-[10px] font-semibold text-text-muted">
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
          </AppStack>
        </AppBox>

        {/* Parties Summary Section */}
        <AppBox sx={summaryCardWrapperSx}>
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            padding="none"
            sx={summaryCardSx}
          >
            <div className="px-4 py-3 border-b border-border">
              <AppHeading level={2} weight={700} sx={summaryTitleSx}>
                Parties Summary
              </AppHeading>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[500px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/50 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    <th className="px-4 py-2.5">Party Type</th>
                    <th className="px-4 py-2.5">Total Parties</th>
                    <th className="px-4 py-2.5">Active</th>
                    <th className="px-4 py-2.5">Inactive</th>
                    <th className="px-4 py-2.5">Recent Added</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[11.5px] font-medium text-text">
                  <tr className="hover:bg-surface-hover/30 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success-soft text-success text-[13px]">
                          <FiUsers />
                        </span>
                        <span className="font-bold text-text">Customers</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{partiesData.customers.total.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-success font-bold">{partiesData.customers.active.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-danger font-bold">{partiesData.customers.inactive.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-text-muted">{partiesData.customers.recent}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={handleViewCustomers}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-success/30 bg-success-soft/30 text-success transition hover:bg-success hover:text-white"
                      >
                        <FiArrowRight className="text-[12px]" />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-hover/30 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-info-soft text-info text-[13px]">
                          <FiTruck />
                        </span>
                        <span className="font-bold text-text">Suppliers</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{partiesData.suppliers.total.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-success font-bold">{partiesData.suppliers.active.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-danger font-bold">{partiesData.suppliers.inactive.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-text-muted">{partiesData.suppliers.recent}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={handleViewSuppliers}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-info/30 bg-info-soft/30 text-info transition hover:bg-info hover:text-white"
                      >
                        <FiArrowRight className="text-[12px]" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppCard>
        </AppBox>

        {/* Bottom Alert Banner */}
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-info-soft/30 px-3 py-3 text-[11.5px] text-info leading-relaxed">
          <FiInfo className="text-[15px] shrink-0 text-info mt-0.5" />
          <span className="font-medium">
            You can view party details and manage them from their respective sections.
          </span>
        </div>
      </AppBox>
    </section>
  );
};

// Styles (Zero root container padding)
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 0.5,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const sectionWrapperSx = {
  px: 0.5,
  py: 1,
};

const customerCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
    bgcolor: "var(--app-color-surface-hover)",
  },
};

const supplierCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
    bgcolor: "var(--app-color-surface-hover)",
  },
};

const moduleTitleTextSx = {
  m: 0,
  fontSize: "13.5px",
  color: "var(--app-color-text)",
};

const moduleDescTextSx = {
  mt: 0.4,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const viewBtnSx = {
  height: 28,
  px: 1.2,
  fontSize: "11px",
  fontWeight: 700,
};

const summaryCardWrapperSx = {
  px: 0.5,
  py: 1,
};

const summaryCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const summaryTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

export default PartiesMobilePage;

