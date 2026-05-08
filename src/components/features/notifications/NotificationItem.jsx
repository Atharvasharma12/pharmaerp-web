import React from "react";
import { Box, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const NotificationItem = ({ notification, onClick }) => {
  const {
    title = "Notification",
    message = "",
    time = "",
    isRead = false,
    icon,
  } = notification || {};

  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        gap: 1.5,
        cursor: onClick ? "pointer" : "default",
        bgcolor: isRead ? "transparent" : "action.hover",
        transition: "background-color 0.18s ease",
        "&:hover": {
          bgcolor: "action.selected",
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: 0.2,
        }}
      >
        {icon || <CircleIcon sx={{ fontSize: 10 }} />}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            fontWeight={isRead ? 500 : 700}
            sx={{
              color: "text.primary",
              lineHeight: 1.35,
            }}
          >
            {title}
          </Typography>

          {!isRead && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
                flexShrink: 0,
                mt: 0.6,
              }}
            />
          )}
        </Box>

        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.4,
              lineHeight: 1.45,
            }}
          >
            {message}
          </Typography>
        )}

        {time && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.7,
            }}
          >
            {time}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default NotificationItem;
