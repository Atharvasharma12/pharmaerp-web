import React from "react";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import {
  AppCard,
  AppStack,
  AppBox,
  AppText,
  AppCaption,
  AppBadge,
  AppIconButton,
  AppTooltip,
} from "@/components";

const getFileType = (file = {}) => {
  const type = file.type || file.mimeType || "";
  const name = file.name || "";

  if (type.includes("image") || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name)) {
    return "image";
  }

  if (type.includes("pdf") || /\.pdf$/i.test(name)) {
    return "pdf";
  }

  if (/\.(doc|docx|txt|rtf)$/i.test(name)) {
    return "document";
  }

  return "file";
};

const getFileIcon = (fileType) => {
  const iconMap = {
    image: <ImageRoundedIcon />,
    pdf: <PictureAsPdfRoundedIcon />,
    document: <DescriptionRoundedIcon />,
    file: <InsertDriveFileRoundedIcon />,
  };

  return iconMap[fileType] || iconMap.file;
};

const getFileColor = (fileType) => {
  const colorMap = {
    image: "info",
    pdf: "error",
    document: "primary",
    file: "neutral",
  };

  return colorMap[fileType] || "neutral";
};

const formatFileSize = (size) => {
  if (!size) return "";

  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const FileCard = ({
  file,

  name,
  size,
  type,
  url,
  thumbnail,
  status,

  showPreview = true,
  showDownload = true,
  showDelete = true,
  showType = true,
  showSize = true,

  onPreview,
  onDownload,
  onDelete,

  disabled = false,
  loading = false,

  variant = "default",
  compact = false,

  sx = {},
}) => {
  const resolvedFile = file || {
    name,
    size,
    type,
    url,
    thumbnail,
    status,
  };

  const fileName = resolvedFile.name || "Untitled file";
  const fileType = getFileType(resolvedFile);
  const colorVariant = getFileColor(fileType);
  const fileSize = formatFileSize(resolvedFile.size);
  const previewUrl = resolvedFile.thumbnail || resolvedFile.url;

  return (
    <AppCard
      variant={variant}
      padding={compact ? "sm" : "md"}
      rounded="lg"
      shadow="none"
      bordered
      hoverable
      disabled={disabled}
      sx={sx}
    >
      <AppStack direction="row" spacing={1.5} align="center">
        <AppBox
          sx={{
            width: compact ? 40 : 48,
            height: compact ? 40 : 48,
            minWidth: compact ? 40 : 48,
            borderRadius: "12px",
            backgroundColor: `var(--color-${colorVariant}-soft)`,
            color: `var(--color-${colorVariant})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",

            "& svg": {
              fontSize: compact ? 22 : 26,
            },
          }}
        >
          {fileType === "image" && previewUrl ? (
            <img
              src={previewUrl}
              alt={fileName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            getFileIcon(fileType)
          )}
        </AppBox>

        <AppBox sx={{ minWidth: 0, flex: 1 }}>
          <AppTooltip title={fileName}>
            <AppText
              weight={800}
              sx={{
                fontSize: compact ? "0.82rem" : "0.9rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
            </AppText>
          </AppTooltip>

          <AppStack direction="row" spacing={0.8} align="center" wrap="wrap">
            {showType && (
              <AppBadge
                label={fileType.toUpperCase()}
                size="small"
                variant="soft"
                colorVariant={colorVariant}
              />
            )}

            {showSize && fileSize && <AppCaption>{fileSize}</AppCaption>}

            {resolvedFile.status && (
              <AppBadge
                label={resolvedFile.status}
                size="small"
                variant="soft"
                colorVariant={
                  resolvedFile.status === "uploaded"
                    ? "success"
                    : resolvedFile.status === "failed"
                      ? "error"
                      : "warning"
                }
              />
            )}
          </AppStack>
        </AppBox>

        <AppStack direction="row" spacing={0.5} align="center">
          {showPreview && (
            <AppIconButton
              icon={<VisibilityRoundedIcon />}
              variant="text"
              colorVariant="primary"
              size="small"
              tooltip="Preview"
              disabled={disabled || loading}
              onClick={() => onPreview?.(resolvedFile)}
            />
          )}

          {showDownload && (
            <AppIconButton
              icon={<DownloadRoundedIcon />}
              variant="text"
              colorVariant="primary"
              size="small"
              tooltip="Download"
              disabled={disabled || loading}
              onClick={() => onDownload?.(resolvedFile)}
            />
          )}

          {showDelete && (
            <AppIconButton
              icon={<DeleteOutlineRoundedIcon />}
              variant="text"
              colorVariant="error"
              size="small"
              tooltip="Delete"
              disabled={disabled || loading}
              onClick={() => onDelete?.(resolvedFile)}
            />
          )}
        </AppStack>
      </AppStack>
    </AppCard>
  );
};

export default FileCard;
