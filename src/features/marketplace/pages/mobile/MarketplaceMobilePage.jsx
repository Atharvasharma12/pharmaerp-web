// src/features/marketplace/pages/mobile/MarketplaceMobilePage.jsx

import React from "react";
import { FiArrowRight, FiInfo, FiShoppingCart, FiBox } from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppSearchInput,
  AppStack,
  AppText,
} from "@/components";

const moduleIcons = {
  stores: <FiShoppingCart className="text-[20px]" />,
  products: <FiBox className="text-[20px]" />,
};

const overviewColors = {
  stores: { bg: "#f0fdf4", text: "#16a34a" },
  products: { bg: "#eff6ff", text: "#2563eb" },
};

const MarketplaceMobilePage = ({
  modules = [],
  searchQuery = "",
  setSearchQuery,
}) => {
  return (
    <section className="w-full bg-bg px-4 py-3">
      <AppBox sx={containerSx}>
        {/* Header Block */}
        <AppBox sx={headerWrapperSx}>
          <AppHeading level={1} weight={800} sx={pageTitleSx}>
            Marketplace Portal
          </AppHeading>
          <AppText variant="body2" sx={pageSubtitleSx}>
            Configure stores and enable product catalogs to sell online.
          </AppText>
        </AppBox>

        {/* Search Input */}
        <AppBox sx={searchWrapperSx}>
          <AppSearchInput
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules..."
            clearable
            onClear={() => setSearchQuery("")}
            size="large"
            variant="bordered"
            rounded="md"
            sx={searchBarSx}
            inputSx={searchInputSx}
          />
        </AppBox>

        {/* Modules List Stream */}
        <AppBox sx={listingListWrapperSx}>
          <AppStack direction="column" gap={1.2}>
            {modules.map((item) => {
              const colors = overviewColors[item.id] || { bg: "#f8fafc", text: "#64748b" };
              return (
                <AppCard
                  key={item.id}
                  variant="default"
                  rounded="lg"
                  bordered={false}
                  shadow="sm"
                  padding="none"
                  onClick={item.onClick}
                  sx={productCardSx}
                >
                  <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%" }}>
                    <AppStack direction="row" align="center" gap={1.5} sx={{ minWidth: 0, flex: 1 }}>
                      {/* Left Icon box */}
                      <AppBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 44,
                          height: 44,
                          borderRadius: "10px",
                          bgcolor: colors.bg,
                          color: colors.text,
                          flexShrink: 0,
                        }}
                      >
                        {moduleIcons[item.id] || <FiBox />}
                      </AppBox>

                      {/* Right column with title and description */}
                      <AppBox sx={{ minWidth: 0, flex: 1 }}>
                        <AppHeading level={3} weight={700} sx={cardTitleSx}>
                          {item.title}
                        </AppHeading>
                        <AppText variant="body2" sx={cardDescSx}>
                          {item.description}
                        </AppText>
                      </AppBox>
                    </AppStack>

                    <FiArrowRight className="text-text-muted shrink-0 text-lg mr-1" />
                  </AppStack>
                </AppCard>
              );
            })}
          </AppStack>
        </AppBox>
      </AppBox>
    </section>
  );
};

/* Tokenized Design System Dictionaries */
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
  pt: 1,
  pb: 1.5,
  px: 0,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  fontWeight: 800,
  color: "var(--app-color-text)",
  letterSpacing: "-0.5px",
};

const pageSubtitleSx = {
  mt: 0.4,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const searchWrapperSx = {
  px: 0,
  py: 0.5,
};

const searchBarSx = {
  width: "100%",
  boxShadow: "none",
};

const searchInputSx = {
  height: 42,
  fontSize: "13px",
  bgcolor: "var(--app-color-surface)",
};

const listingListWrapperSx = {
  px: 0,
  py: 1,
};

const productCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  boxShadow: "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
  },
};

const cardTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const cardDescSx = {
  mt: 0.25,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.3,
};

export default MarketplaceMobilePage;
