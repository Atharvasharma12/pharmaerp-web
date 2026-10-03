import React from "react";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import {
  AppDialog,
  AppStack,
  AppBox,
  AppText,
  AppCaption,
  AppButton,
  AppBadge,
} from "@/components";

const getFileType = (file) => {
  const safeFile = file || {};
  const type = safeFile.type || safeFile.mimeType || "";
  const name = safeFile.name || "";

  if (type.includes("image") || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name)) {
    return "image";
  }

  if (type.includes("pdf") || /\.pdf$/i.test(name)) {
    return "pdf";
  }

  return "file";
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

const FilePreview = ({
  open = false,
  onClose,

  file = null,

  title = "File Preview",
  subtitle,

  showDownload = true,
  showOpenNew = true,

  onDownload,
  onOpenNew,

  maxWidth = "md",

  sx = {},
}) => {
  const safeFile = file || {};
  const fileType = getFileType(safeFile);
  const fileName = safeFile.name || "Untitled file";
  const fileUrl = safeFile.url || safeFile.previewUrl || "";
  const fileSize = formatFileSize(safeFile.size);

  const renderPreview = () => {
    if (!fileUrl) {
      return (
        <EmptyPreview
          icon={<InsertDriveFileRoundedIcon />}
          title="Preview unavailable"
          description="This file does not have a preview URL."
        />
      );
    }

    if (fileType === "image") {
      return (
        <AppBox
          sx={{
            width: "100%",
            minHeight: 420,
            maxHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            backgroundColor: "var(--color-surface-alt)",
            borderRadius: "14px",
            border: "1px solid var(--color-border)",
          }}
        >
          <img
            src={fileUrl}
            alt={fileName}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        </AppBox>
      );
    }

    if (fileType === "pdf") {
      return (
        <AppBox
          sx={{
            width: "100%",
            height: "70vh",
            overflow: "hidden",
            borderRadius: "14px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface-alt)",
          }}
        >
          <iframe
            title={fileName}
            src={fileUrl}
            style={{
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </AppBox>
      );
    }

    return (
      <EmptyPreview
        icon={<InsertDriveFileRoundedIcon />}
        title="No inline preview"
        description="Download or open this file to view its contents."
      />
    );
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle || fileName}
      maxWidth={maxWidth}
      fullWidth
      contentSx={sx}
      actions={
        <AppStack direction="row" spacing={1} justify="flex-end" wrap="wrap">
          {fileSize && (
            <AppBadge
              label={fileSize}
              variant="soft"
              colorVariant="neutral"
              size="small"
            />
          )}

          {showOpenNew && fileUrl && (
            <AppButton
              variant="outlined"
              colorVariant="primary"
              size="small"
              startIcon={<OpenInNewRoundedIcon />}
              onClick={() => onOpenNew?.(safeFile)}
            >
              Open
            </AppButton>
          )}

          {showDownload && (
            <AppButton
              variant="contained"
              colorVariant="primary"
              size="small"
              startIcon={<DownloadRoundedIcon />}
              disabled={!file}
              onClick={() => onDownload?.(safeFile)}
            >
              Download
            </AppButton>
          )}
        </AppStack>
      }
    >
      <AppStack spacing={2}>
        <AppStack direction="row" spacing={1} align="center" wrap="wrap">
          <AppBadge
            label={fileType.toUpperCase()}
            variant="soft"
            colorVariant={
              fileType === "image"
                ? "info"
                : fileType === "pdf"
                  ? "error"
                  : "neutral"
            }
            startIcon={
              fileType === "image" ? (
                <ImageRoundedIcon />
              ) : fileType === "pdf" ? (
                <PictureAsPdfRoundedIcon />
              ) : (
                <InsertDriveFileRoundedIcon />
              )
            }
          />

          <AppCaption>{fileName}</AppCaption>
        </AppStack>

        {renderPreview()}
      </AppStack>
    </AppDialog>
  );
};

const EmptyPreview = ({ icon, title, description }) => {
  return (
    <AppBox
      bordered
      rounded
      sx={{
        minHeight: 360,
        backgroundColor: "var(--color-surface-alt)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <AppStack spacing={1} align="center">
        <AppBox
          sx={{
            width: 64,
            height: 64,
            borderRadius: "18px",
            backgroundColor: "var(--color-primary-soft)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "& svg": {
              fontSize: 34,
            },
          }}
        >
          {icon}
        </AppBox>

        <AppText weight={800}>{title}</AppText>

        <AppText color="var(--color-text-muted)" sx={{ maxWidth: 360 }}>
          {description}
        </AppText>
      </AppStack>
    </AppBox>
  );
};

export default FilePreview;
