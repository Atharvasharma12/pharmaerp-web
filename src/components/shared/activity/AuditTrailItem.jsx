import React from "react";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import {
  AppCard,
  AppStack,
  AppBox,
  AppText,
  AppCaption,
  AppBadge,
  AppAvatar,
  AppTooltip,
} from "@/components";

const actionMap = {
  created: {
    label: "Created",
    colorVariant: "success",
    icon: <AddCircleOutlineRoundedIcon />,
  },
  updated: {
    label: "Updated",
    colorVariant: "info",
    icon: <EditRoundedIcon />,
  },
  deleted: {
    label: "Deleted",
    colorVariant: "error",
    icon: <DeleteOutlineRoundedIcon />,
  },
  approved: {
    label: "Approved",
    colorVariant: "success",
    icon: <CheckCircleOutlineRoundedIcon />,
  },
  rejected: {
    label: "Rejected",
    colorVariant: "error",
    icon: <CancelOutlinedIcon />,
  },
  login: {
    label: "Login",
    colorVariant: "primary",
    icon: <LoginRoundedIcon />,
  },
  attachment: {
    label: "Attachment",
    colorVariant: "warning",
    icon: <AttachFileRoundedIcon />,
  },
  comment: {
    label: "Comment",
    colorVariant: "primary",
    icon: <CommentRoundedIcon />,
  },
  default: {
    label: "Activity",
    colorVariant: "neutral",
    icon: <HistoryRoundedIcon />,
  },
};

const AuditTrailItem = ({
  item,
  action,
  title,
  description,
  user,
  time,
  module,
  metadata,

  variant = "card", // card | inline
  compact = false,
  showAvatar = true,
  showBadge = true,
  showMetadata = true,

  sx = {},
}) => {
  const data = item || {
    action,
    title,
    description,
    user,
    time,
    module,
    metadata,
  };

  const activeAction = actionMap[data.action] || actionMap.default;

  const content = (
    <AppStack direction="row" spacing={1.5} align="flex-start">
      {showAvatar && (
        <AppAvatar
          src={data.user?.avatar}
          name={data.user?.name}
          initials={data.user?.initials}
          size={compact ? "xs" : "small"}
          colorVariant={activeAction.colorVariant}
        />
      )}

      <AppBox sx={{ minWidth: 0, flex: 1 }}>
        <AppStack
          direction="row"
          align="flex-start"
          justify="space-between"
          spacing={1}
        >
          <AppBox sx={{ minWidth: 0 }}>
            <AppText
              weight={800}
              sx={{
                fontSize: compact ? "0.82rem" : "0.9rem",
                lineHeight: 1.35,
              }}
            >
              {data.title || activeAction.label}
            </AppText>

            {data.description && (
              <AppText
                color="var(--color-text-muted)"
                sx={{
                  mt: 0.35,
                  fontSize: compact ? "0.76rem" : "0.84rem",
                  lineHeight: 1.5,
                }}
              >
                {data.description}
              </AppText>
            )}
          </AppBox>

          {showBadge && (
            <AppBadge
              label={activeAction.label}
              size="small"
              variant="soft"
              colorVariant={activeAction.colorVariant}
              startIcon={activeAction.icon}
            />
          )}
        </AppStack>

        <AppStack
          direction="row"
          spacing={1}
          align="center"
          wrap="wrap"
          sx={{ mt: 1 }}
        >
          {data.user?.name && (
            <AppCaption>
              By <strong>{data.user.name}</strong>
            </AppCaption>
          )}

          {data.time && (
            <AppTooltip title={data.time}>
              <AppCaption>{data.time}</AppCaption>
            </AppTooltip>
          )}

          {data.module && (
            <AppBadge
              label={data.module}
              size="small"
              variant="text"
              colorVariant="neutral"
            />
          )}
        </AppStack>

        {showMetadata && data.metadata && (
          <AppBox
            bordered
            rounded
            sx={{
              mt: 1.2,
              p: 1.2,
              backgroundColor: "var(--color-surface-alt)",
            }}
          >
            {typeof data.metadata === "string" ? (
              <AppCaption>{data.metadata}</AppCaption>
            ) : (
              <AppStack spacing={0.5}>
                {Object.entries(data.metadata).map(([key, value]) => (
                  <AppStack
                    key={key}
                    direction="row"
                    spacing={1}
                    justify="space-between"
                  >
                    <AppCaption>{key}</AppCaption>
                    <AppCaption sx={{ color: "var(--color-text)" }}>
                      {String(value)}
                    </AppCaption>
                  </AppStack>
                ))}
              </AppStack>
            )}
          </AppBox>
        )}
      </AppBox>
    </AppStack>
  );

  if (variant === "inline") {
    return (
      <AppBox
        sx={{
          width: "100%",
          ...sx,
        }}
      >
        {content}
      </AppBox>
    );
  }

  return (
    <AppCard
      variant="soft"
      padding={compact ? "sm" : "md"}
      rounded="lg"
      shadow="none"
      bordered
      hoverable
      sx={sx}
    >
      {content}
    </AppCard>
  );
};

export default AuditTrailItem;
