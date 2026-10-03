import React from "react";
import { Box } from "@mui/material";
import AppSkeleton from "./AppSkeleton";

const AppCardSkeleton = ({
  showAvatar = false,
  showActions = false,
  lines = 3,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 2,
        border: "1px solid var(--app-color-border)",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        ...sx,
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1.5}>
        {showAvatar && (
          <AppSkeleton variant="circular" width={40} height={40} />
        )}

        <Box flex={1}>
          <AppSkeleton variant="text" height={16} width="60%" />
          <AppSkeleton variant="text" height={14} width="40%" />
        </Box>

        {showActions && (
          <AppSkeleton variant="circular" width={28} height={28} />
        )}
      </Box>

      {/* Content */}
      <AppSkeleton variant="text" count={lines} />

      {/* Footer */}
      <Box display="flex" gap={1}>
        <AppSkeleton variant="rounded" height={28} width={80} />
        <AppSkeleton variant="rounded" height={28} width={60} />
      </Box>
    </Box>
  );
};

export default AppCardSkeleton;
