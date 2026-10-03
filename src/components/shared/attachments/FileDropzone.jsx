import React, { useRef, useState } from "react";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

import {
  AppBox,
  AppStack,
  AppText,
  AppHeading,
  AppCaption,
  AppButton,
  AppBadge,
} from "@/components";

const FileDropzone = ({
  title = "Upload files",
  description = "Drag and drop files here, or browse from your device.",

  accept,
  multiple = true,
  disabled = false,
  loading = false,

  maxSize,
  maxFiles,

  browseLabel = "Browse Files",

  onFilesChange,
  onDrop,
  onReject,

  showAcceptedTypes = true,
  showLimits = true,

  sx = {},
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatSize = (size) => {
    if (!size) return "";
    const mb = size / 1024 / 1024;
    return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
  };

  const validateFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const errors = [];

    if (maxFiles && files.length > maxFiles) {
      errors.push(
        `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed.`,
      );
    }

    if (maxSize) {
      files.forEach((file) => {
        if (file.size > maxSize) {
          errors.push(`${file.name} exceeds ${formatSize(maxSize)}.`);
        }
      });
    }

    if (errors.length > 0) {
      onReject?.(errors, files);
      return;
    }

    onFilesChange?.(files);
    onDrop?.(files);
  };

  const handleBrowse = () => {
    if (disabled || loading) return;
    inputRef.current?.click();
  };

  const handleInputChange = (event) => {
    validateFiles(event.target.files);
    event.target.value = "";
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled && !loading) setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled || loading) return;
    validateFiles(event.dataTransfer.files);
  };

  return (
    <AppBox
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleBrowse}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      bordered
      rounded
      sx={{
        position: "relative",
        width: "100%",
        minHeight: 260,
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        backgroundColor: isDragging
          ? "var(--color-primary-soft)"
          : "var(--color-surface-alt)",
        borderStyle: "dashed",
        borderColor: isDragging
          ? "var(--color-primary)"
          : "var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "all 0.2s ease",

        "&:hover": {
          borderColor: disabled
            ? "var(--color-border)"
            : "var(--color-primary)",
          backgroundColor: disabled
            ? "var(--color-surface-alt)"
            : "var(--color-primary-soft)",
        },

        ...sx,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled || loading}
        onChange={handleInputChange}
        style={{ display: "none" }}
      />

      <AppStack align="center" spacing={1.5}>
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
          {isDragging ? (
            <InsertDriveFileRoundedIcon />
          ) : (
            <CloudUploadRoundedIcon />
          )}
        </AppBox>

        <AppStack spacing={0.5} align="center">
          <AppHeading level={6}>
            {isDragging ? "Drop files here" : title}
          </AppHeading>

          {description && (
            <AppText
              color="var(--color-text-muted)"
              sx={{
                maxWidth: 460,
              }}
            >
              {description}
            </AppText>
          )}
        </AppStack>

        <AppButton
          variant="contained"
          colorVariant="primary"
          loading={loading}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            handleBrowse();
          }}
        >
          {browseLabel}
        </AppButton>

        {(showAcceptedTypes || showLimits) && (
          <AppStack
            direction="row"
            spacing={1}
            align="center"
            justify="center"
            wrap="wrap"
          >
            {showAcceptedTypes && accept && (
              <AppBadge
                label={accept}
                size="small"
                variant="soft"
                colorVariant="info"
              />
            )}

            {showLimits && maxSize && (
              <AppCaption>Max size: {formatSize(maxSize)}</AppCaption>
            )}

            {showLimits && maxFiles && (
              <AppCaption>Max files: {maxFiles}</AppCaption>
            )}
          </AppStack>
        )}
      </AppStack>
    </AppBox>
  );
};

export default FileDropzone;
