import React, { useRef, useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  Typography,
  Stack,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { AppButton, AppIconButton, AppLoader } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppFileUpload = ({
  label = "Upload file",
  value,
  onChange,
  name,
  accept,
  multiple = false,
  disabled = false,
  required = false,
  error = false,
  helperText,
  fullWidth = false,
  colorVariant = "primary",
  size = "medium",
  buttonText = "Choose file",
  dragText = "Drag & drop files here",
  browseText = "or browse from your device",
  showFileList = true,
  showProgress = false,
  progress = 0,
  loading = false,
  loadingText = "Uploading...",
  loaderVariant = "spinner",
  maxFiles,
  sx = {},
  uploadBoxSx = {},
  buttonSx = {},
  labelSx = {},
  helperTextSx = {},
  fileListSx = {},
  ...props
}) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = getThemeTokens(theme);

  const colorMap = {
    primary: {
      main: t.primary,
      hover: t.primaryHover,
      soft: t.primarySoft,
    },
    success: {
      main: t.success,
      hover: t.successHover,
      soft: t.successSoft,
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      soft: t.errorSoft,
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      soft: t.warningSoft,
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      soft: t.infoSoft,
    },
    dark: {
      main: isDark ? t.neutral?.[100] : t.neutral?.[900],
      hover: isDark ? t.neutral?.[200] : t.neutral?.[800],
      soft: isDark ? t.surfaceHover : t.neutral?.[100],
    },
    neutral: {
      main: isDark ? t.neutral?.[400] : t.neutral?.[700],
      hover: isDark ? t.neutral?.[300] : t.neutral?.[800],
      soft: isDark ? t.surfaceHover : t.neutral?.[100],
    },
  };

  const active = error
    ? colorMap.error
    : colorMap[colorVariant] || colorMap.primary;

  const safeActive = {
    main: active?.main || t.primary,
    hover: active?.hover || t.primaryHover || t.primary,
    soft: active?.soft || t.primarySoft || t.surfaceHover,
  };

  const sizeMap = {
    small: {
      py: 2,
      px: 1.5,
      iconSize: 28,
      labelFontSize: "0.82rem",
      textFontSize: "0.78rem",
      helperFontSize: "0.74rem",
      buttonSize: "small",
      loaderSize: "small",
    },
    medium: {
      py: 2.75,
      px: 2,
      iconSize: 36,
      labelFontSize: "0.88rem",
      textFontSize: "0.86rem",
      helperFontSize: "0.78rem",
      buttonSize: "medium",
      loaderSize: "medium",
    },
    large: {
      py: 3.5,
      px: 2.5,
      iconSize: 44,
      labelFontSize: "0.95rem",
      textFontSize: "0.94rem",
      helperFontSize: "0.82rem",
      buttonSize: "large",
      loaderSize: "large",
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const files = Array.isArray(value)
    ? value
    : value
      ? Array.from(value instanceof FileList ? value : [value])
      : [];

  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  const emitChange = (selectedFiles) => {
    if (disabled || loading) return;

    let nextFiles = Array.from(selectedFiles || []);

    if (maxFiles) {
      nextFiles = nextFiles.slice(0, maxFiles);
    }

    onChange?.(multiple ? nextFiles : nextFiles[0] || null);
  };

  const handleInputChange = (event) => {
    emitChange(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (!disabled && !loading) {
      emitChange(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled && !loading) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleRemoveFile = (event, index) => {
    event.stopPropagation();

    if (disabled || loading) return;

    if (multiple) {
      onChange?.(files.filter((_, fileIndex) => fileIndex !== index));
    } else {
      onChange?.(null);
    }
  };

  const formatFileSize = (bytes = 0) => {
    if (!bytes) return "0 KB";

    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(
      index === 0 ? 0 : 1,
    )} ${units[index]}`;
  };

  return (
    <FormControl
      error={error}
      disabled={disabled}
      required={required}
      sx={{
        width: fullWidth ? "100%" : 360,
        minWidth: 0,
        ...sx,
      }}
    >
      {label ? (
        <Typography
          sx={{
            mb: 0.75,
            color: disabled ? t.disabledText : error ? t.error : t.text,
            fontSize: activeSize.labelFontSize,
            fontWeight: 600,
            lineHeight: 1.35,
            ...labelSx,
          }}
        >
          {label}
        </Typography>
      ) : null}

      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!disabled && !loading) inputRef.current?.click();
        }}
        sx={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          border: `1.5px dashed ${
            disabled
              ? t.disabledBorder
              : error
                ? t.error
                : dragActive
                  ? safeActive.main
                  : t.borderStrong
          }`,
          backgroundColor: disabled
            ? t.disabledBg
            : dragActive
              ? safeActive.soft
              : t.surface,
          px: activeSize.px,
          py: activeSize.py,
          cursor: disabled || loading ? "not-allowed" : "pointer",
          transition:
            "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
          "&:hover": {
            borderColor:
              disabled || loading ? t.disabledBorder : safeActive.main,
            backgroundColor:
              disabled || loading ? t.disabledBg : safeActive.soft,
          },
          ...uploadBoxSx,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled || loading}
          hidden
          onChange={handleInputChange}
          {...props}
        />

        {loading ? (
          <AppLoader
            size={activeSize.loaderSize}
            variant={loaderVariant}
            colorVariant={colorVariant === "neutral" ? "primary" : colorVariant}
            text={loadingText}
            sx={{
              minHeight: 120,
              width: "100%",
            }}
          />
        ) : (
          <Stack spacing={1.1} alignItems="center" textAlign="center">
            <CloudUploadRoundedIcon
              sx={{
                fontSize: activeSize.iconSize,
                color: disabled ? t.disabledText : safeActive.main,
              }}
            />

            <Typography
              sx={{
                fontSize: activeSize.textFontSize,
                fontWeight: 700,
                color: disabled ? t.disabledText : t.text,
              }}
            >
              {dragText}
            </Typography>

            <Typography
              sx={{
                fontSize: activeSize.helperFontSize,
                color: disabled ? t.disabledText : t.textMuted,
              }}
            >
              {browseText}
            </Typography>

            <AppButton
              variant="contained"
              colorVariant={colorVariant === "neutral" ? "dark" : colorVariant}
              size={activeSize.buttonSize}
              disabled={disabled}
              rounded="lg"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
              sx={{
                mt: 0.5,
                ...buttonSx,
              }}
            >
              {buttonText}
            </AppButton>
          </Stack>
        )}
      </Box>

      {showProgress ? (
        <Box sx={{ mt: 1.25 }}>
          <Box
            sx={{
              width: "100%",
              height: 7,
              borderRadius: 999,
              backgroundColor: safeActive.soft,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${normalizedProgress}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: safeActive.main,
                transition: "width 0.25s ease",
              }}
            />
          </Box>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: activeSize.helperFontSize,
              color: t.textMuted,
              textAlign: "right",
            }}
          >
            {normalizedProgress}%
          </Typography>
        </Box>
      ) : null}

      {showFileList && files.length > 0 ? (
        <Stack
          spacing={0.8}
          sx={{
            mt: 1.25,
            ...fileListSx,
          }}
        >
          {files.map((file, index) => (
            <Box
              key={`${file.name}-${index}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: `1px solid ${t.border}`,
                backgroundColor: t.surfaceAlt,
                borderRadius: "12px",
                px: 1,
                py: 0.8,
              }}
            >
              <InsertDriveFileRoundedIcon
                sx={{
                  fontSize: 20,
                  color: safeActive.main,
                  flexShrink: 0,
                }}
              />

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  noWrap
                  sx={{
                    fontSize: activeSize.textFontSize,
                    fontWeight: 600,
                    color: t.text,
                  }}
                >
                  {file.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: activeSize.helperFontSize,
                    color: t.textMuted,
                  }}
                >
                  {formatFileSize(file.size)}
                </Typography>
              </Box>

              <AppIconButton
                icon={<CloseRoundedIcon />}
                size="small"
                variant="text"
                colorVariant={
                  colorVariant === "neutral" ? "dark" : colorVariant
                }
                disabled={disabled || loading}
                tooltip="Remove file"
                onClick={(event) => handleRemoveFile(event, index)}
                sx={{
                  flexShrink: 0,
                }}
              />
            </Box>
          ))}
        </Stack>
      ) : null}

      {helperText ? (
        <FormHelperText
          sx={{
            mt: 0.75,
            ml: 0.25,
            color: error ? t.error : t.textMuted,
            fontSize: activeSize.helperFontSize,
            lineHeight: 1.45,
            ...helperTextSx,
          }}
        >
          {helperText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default AppFileUpload;
