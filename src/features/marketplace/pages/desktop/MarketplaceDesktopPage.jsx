// src/features/marketplace/pages/desktop/MarketplaceDesktopPage.jsx

import React from "react";
import { FiArrowRight, FiInfo, FiShoppingCart, FiBox } from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppSearchInput,
  AppStack,
  AppText,
  PageHeader,
} from "@/components";

const moduleIcons = {
  stores: <FiShoppingCart className="text-[22px]" />,
  products: <FiBox className="text-[22px]" />,
};

const overviewColors = {
  stores: { bg: "#f0fdf4", text: "#16a34a" },
  products: { bg: "#eff6ff", text: "#2563eb" },
};

const MarketplaceDesktopPage = ({
  modules = [],
  searchQuery = "",
  setSearchQuery,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Marketplace Portal"
          subtitle="Manage your pharmacy's online stores, digital configurations, and online enabled product catalogs."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard", href: "/" },
                { label: "Marketplace", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
        />

        {/* Search Input Bar */}
        <div className="mt-5 max-w-[380px]">
          <AppSearchInput
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules..."
            clearable
            onClear={() => setSearchQuery("")}
            size="small"
            variant="bordered"
            rounded="md"
            sx={searchSx}
            inputSx={searchInputSx}
          />
        </div>

        {/* Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((item) => {
            const colors = overviewColors[item.id] || { bg: "#f8fafc", text: "#64748b" };
            return (
              <AppCard
                key={item.id}
                variant="default"
                rounded="xl"
                bordered
                shadow="sm"
                padding="md"
                sx={catalogCardSx}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-start gap-4">
                    {/* Left Icon box */}
                    <AppBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: colors.bg,
                        color: colors.text,
                        flexShrink: 0,
                      }}
                    >
                      {moduleIcons[item.id] || <FiBox />}
                    </AppBox>

                    {/* Right column with title and description */}
                    <div className="flex flex-col min-w-0">
                      <AppHeading level={3} weight={700} sx={cardTitleSx}>
                        {item.title}
                      </AppHeading>
                      <AppText variant="body2" sx={cardDescSx}>
                        {item.description}
                      </AppText>
                    </div>
                  </div>

                  {/* Navigation button */}
                  <div className="mt-5">
                    <AppButton
                      variant="outlined"
                      colorVariant="neutral"
                      fullWidth
                      onClick={item.onClick}
                      endIcon={<FiArrowRight />}
                      sx={viewCatalogBtnSx}
                    >
                      Open Module
                    </AppButton>
                  </div>
                </div>
              </AppCard>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-8 flex items-center gap-3.5 rounded-lg border border-border bg-info-soft/30 px-4 py-3.5 text-[13px] text-info">
          <FiInfo className="text-[18px] shrink-0 text-info" />
          <span className="font-medium">
            Make sure your store is approved by the platform before enabling products to sell online.
          </span>
        </div>
      </div>
    </section>
  );
};

// Styles matching CatalogDesktopPage
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

const searchSx = { width: "100%" };
const searchInputSx = {
  height: 36,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const catalogCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 0.2s ease",
  p: 2.5,
  minHeight: 160,
  "&:hover": {
    boxShadow: "var(--app-shadow-md)",
    borderColor: "var(--app-color-primary)",
  },
};

const cardTitleSx = {
  m: 0,
  fontSize: "15px",
  color: "var(--app-color-text)",
};

const cardDescSx = {
  mt: 0.5,
  fontSize: "12px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const viewCatalogBtnSx = {
  height: 34,
  fontSize: "12px",
  fontWeight: 700,
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: "var(--app-color-primary)",
    color: "var(--app-color-primary)",
    bgcolor: "var(--app-color-primary-soft)",
  },
};

export default MarketplaceDesktopPage;
