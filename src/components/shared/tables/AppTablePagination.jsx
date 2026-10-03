import React, { useMemo } from "react";
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import {
  AppBox,
  AppStack,
  AppText,
  AppSelect,
  AppButton,
  AppIconButton,
  AppPagination,
} from "@/components";

const AppTablePagination = ({
  page = 1,
  pageSize = 10,
  totalItems = 0,

  pageSizeOptions = [10, 25, 50, 100],

  onPageChange,
  onPageSizeChange,

  showPageSize = true,
  showSummary = true,
  showFirstLast = true,
  showCompactControls = false,

  rowsPerPageLabel = "Rows per page",
  ofLabel = "of",
  showingLabel = "Showing",

  size = "medium",
  variant = "outlined",
  rounded = "md",

  align = "space-between",
  compact = false,
  dense = false,
  disabled = false,
  loading = false,

  sx = {},
  summarySx = {},
  pageSizeSx = {},
  paginationSx = {},

  ...props
}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const safeTotal = Math.max(0, Number(totalItems) || 0);

  const totalPages = Math.max(1, Math.ceil(safeTotal / safePageSize));

  const startItem = safeTotal > 0 ? (safePage - 1) * safePageSize + 1 : 0;
  const endItem =
    safeTotal > 0 ? Math.min(safePage * safePageSize, safeTotal) : 0;

  const isFirstPage = safePage <= 1;
  const isLastPage = safePage >= totalPages;

  const selectOptions = useMemo(
    () =>
      pageSizeOptions.map((option) => ({
        label: String(option),
        value: option,
      })),
    [pageSizeOptions],
  );

  const handlePageChange = (nextPage) => {
    if (disabled || loading) return;

    const boundedPage = Math.min(
      Math.max(1, Number(nextPage) || 1),
      totalPages,
    );
    onPageChange?.(boundedPage);
  };

  const handlePageSizeChange = (event) => {
    if (disabled || loading) return;

    const nextSize = Number(event.target.value);
    onPageSizeChange?.(nextSize);
  };

  const controlSize = dense ? "small" : size;

  return (
    <AppBox
      bordered
      rounded
      surface
      sx={{
        width: "100%",
        px: dense ? 1.25 : 2,
        py: dense ? 1 : 1.25,
        opacity: disabled ? 0.72 : 1,
        ...sx,
      }}
      {...props}
    >
      <AppStack
        direction={compact ? "column" : { xs: "column", md: "row" }}
        align={compact ? "stretch" : { xs: "stretch", md: "center" }}
        justify={align}
        spacing={dense ? 1 : 1.5}
        fullWidth
      >
        <AppStack
          direction={{ xs: "column", sm: "row" }}
          align={{ xs: "stretch", sm: "center" }}
          spacing={dense ? 1 : 1.25}
          sx={{
            minWidth: 0,
          }}
        >
          {showSummary ? (
            <AppText
              sx={{
                color: "var(--color-text-muted)",
                fontSize: dense ? "0.76rem" : "0.84rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                ...summarySx,
              }}
            >
              {safeTotal > 0
                ? `${showingLabel} ${startItem}-${endItem} ${ofLabel} ${safeTotal}`
                : `${showingLabel} 0 ${ofLabel} 0`}
            </AppText>
          ) : null}

          {showPageSize ? (
            <AppStack
              direction="row"
              align="center"
              spacing={1}
              sx={pageSizeSx}
            >
              <AppText
                sx={{
                  color: "var(--color-text-muted)",
                  fontSize: dense ? "0.76rem" : "0.82rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {rowsPerPageLabel}
              </AppText>

              <AppSelect
                value={safePageSize}
                options={selectOptions}
                onChange={handlePageSizeChange}
                disabled={disabled || loading}
                size={controlSize}
                variant="soft"
                rounded={rounded}
                fullWidth={false}
                showCheckIcon
                sx={{
                  minWidth: dense ? 76 : 88,
                }}
              />
            </AppStack>
          ) : null}
        </AppStack>

        {showCompactControls ? (
          <AppStack
            direction="row"
            align="center"
            justify={{ xs: "flex-start", md: "flex-end" }}
            spacing={0.75}
            sx={paginationSx}
          >
            {showFirstLast ? (
              <AppIconButton
                icon={<FirstPageRoundedIcon />}
                tooltip="First page"
                variant="soft"
                colorVariant="dark"
                size={controlSize}
                disabled={disabled || loading || isFirstPage}
                onClick={() => handlePageChange(1)}
              />
            ) : null}

            <AppIconButton
              icon={<KeyboardArrowLeftRoundedIcon />}
              tooltip="Previous page"
              variant="soft"
              colorVariant="dark"
              size={controlSize}
              disabled={disabled || loading || isFirstPage}
              onClick={() => handlePageChange(safePage - 1)}
            />

            <AppButton
              variant="soft"
              colorVariant="primary"
              size={controlSize}
              disabled
              sx={{
                minWidth: dense ? 72 : 90,
                cursor: "default",
              }}
            >
              {safePage} / {totalPages}
            </AppButton>

            <AppIconButton
              icon={<KeyboardArrowRightRoundedIcon />}
              tooltip="Next page"
              variant="soft"
              colorVariant="dark"
              size={controlSize}
              disabled={disabled || loading || isLastPage}
              onClick={() => handlePageChange(safePage + 1)}
            />

            {showFirstLast ? (
              <AppIconButton
                icon={<LastPageRoundedIcon />}
                tooltip="Last page"
                variant="soft"
                colorVariant="dark"
                size={controlSize}
                disabled={disabled || loading || isLastPage}
                onClick={() => handlePageChange(totalPages)}
              />
            ) : null}
          </AppStack>
        ) : (
          <AppPagination
            page={safePage}
            count={totalPages}
            totalItems={safeTotal}
            pageSize={safePageSize}
            onChange={handlePageChange}
            showPageSize={false}
            showSummary={false}
            size={controlSize}
            variant={variant}
            rounded={rounded}
            compact={compact}
            disabled={disabled || loading}
            align={align}
            paginationSx={paginationSx}
            sx={{
              width: "auto",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              ...sx,
            }}
          />
        )}
      </AppStack>
    </AppBox>
  );
};

export default AppTablePagination;
