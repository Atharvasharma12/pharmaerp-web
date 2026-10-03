import React from "react";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import {
  AppBox,
  AppStack,
  AppText,
  AppEmptyState,
  AppButton,
} from "@/components";

const AppEmptyTable = ({
  title,
  description,

  variant = "empty", // empty | search | filter | error | permission
  icon,
  action,

  actionLabel,
  onAction,
  actionIcon,

  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionIcon,

  size = "medium", // small | medium | large | page
  align = "center",
  fullHeight = false,

  bordered = true,
  surface = false,
  rounded = true,
  minHeight,

  colSpan,
  asTableRow = false,

  sx = {},
  contentSx = {},
  actionSx = {},

  ...props
}) => {
  const variantMap = {
    empty: {
      title: "No data found",
      description: "There are no records to display yet.",
      icon: <TableRowsRoundedIcon />,
    },
    search: {
      title: "No matching results",
      description: "Try adjusting your search keyword.",
      icon: <SearchOffRoundedIcon />,
    },
    filter: {
      title: "No results match your filters",
      description: "Try changing or clearing your filters.",
      icon: <FilterAltOffRoundedIcon />,
    },
    error: {
      title: "Unable to load data",
      description: "Something went wrong while loading the table data.",
      icon: <ErrorOutlineRoundedIcon />,
    },
    permission: {
      title: "No permission",
      description: "You do not have permission to view this data.",
      icon: <LockOutlinedIcon />,
    },
  };

  const active = variantMap[variant] || variantMap.empty;

  const resolvedTitle = title || active.title;
  const resolvedDescription =
    description !== undefined ? description : active.description;

  const resolvedIcon = icon !== undefined ? icon : active.icon;

  const resolvedAction =
    action ||
    (actionLabel || secondaryActionLabel ? (
      <AppStack
        direction={{ xs: "column", sm: "row" }}
        align="center"
        justify="center"
        spacing={1}
        sx={actionSx}
      >
        {secondaryActionLabel ? (
          <AppButton
            variant="outlined"
            colorVariant="dark"
            size={size === "small" ? "small" : "medium"}
            startIcon={secondaryActionIcon}
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </AppButton>
        ) : null}

        {actionLabel ? (
          <AppButton
            variant="contained"
            colorVariant={variant === "error" ? "error" : "primary"}
            size={size === "small" ? "small" : "medium"}
            startIcon={actionIcon}
            onClick={onAction}
          >
            {actionLabel}
          </AppButton>
        ) : null}
      </AppStack>
    ) : null);

  const content = (
    <AppBox
      surface={surface}
      bordered={bordered}
      rounded={rounded}
      sx={{
        width: "100%",
        minHeight:
          minHeight ||
          (fullHeight
            ? "50vh"
            : size === "small"
              ? 160
              : size === "large"
                ? 280
                : size === "page"
                  ? "55vh"
                  : 220),
        px: size === "small" ? 2 : 3,
        py: size === "small" ? 2.5 : 4,
        display: "flex",
        alignItems: align === "center" ? "center" : "flex-start",
        justifyContent: align === "center" ? "center" : "flex-start",
        ...sx,
      }}
      {...props}
    >
      <AppEmptyState
        title={resolvedTitle}
        description={resolvedDescription}
        icon={resolvedIcon}
        action={resolvedAction}
        size={size}
        align={align}
        fullHeight={false}
        sx={{
          "& svg": {
            fontSize:
              size === "small"
                ? 34
                : size === "large"
                  ? 58
                  : size === "page"
                    ? 68
                    : 46,
          },
          ...contentSx,
        }}
      />
    </AppBox>
  );

  if (asTableRow) {
    return (
      <tr>
        <td colSpan={colSpan || 1000}>{content}</td>
      </tr>
    );
  }

  return content;
};

export default AppEmptyTable;
