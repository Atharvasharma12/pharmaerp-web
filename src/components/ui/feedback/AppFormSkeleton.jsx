import React from "react";
import { Box } from "@mui/material";
import AppSkeleton from "./AppSkeleton";

const AppFormSkeleton = ({
  fields = 4,
  showHeader = true,
  showActions = true,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        ...sx,
      }}
    >
      {/* Header */}
      {showHeader && (
        <Box>
          <AppSkeleton variant="text" height={20} width="40%" />
          <AppSkeleton variant="text" height={16} width="25%" />
        </Box>
      )}

      {/* Form Fields */}
      <Box display="flex" flexDirection="column" gap={2}>
        {Array.from({ length: fields }).map((_, i) => (
          <Box key={i}>
            {/* Label */}
            <AppSkeleton variant="text" height={14} width="30%" />

            {/* Input */}
            <AppSkeleton variant="rounded" height={40} width="100%" />
          </Box>
        ))}
      </Box>

      {/* Actions */}
      {showActions && (
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <AppSkeleton variant="rounded" height={36} width={90} />
          <AppSkeleton variant="rounded" height={36} width={110} />
        </Box>
      )}
    </Box>
  );
};

export default AppFormSkeleton;
