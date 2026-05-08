import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import AppFileUpload from "./AppFileUpload";
import { AppIconButton } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppImageUpload = ({
  value,
  onChange,
  accept = "image/*",
  preview = true,
  previewSize = 96,
  helperText,
  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const imageUrl = useMemo(() => {
    if (!value) return null;

    if (typeof value === "string") return value;

    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return null;
  }, [value]);

  const handleRemove = (event) => {
    event.stopPropagation();
    onChange?.(null);
  };

  return (
    <Box>
      <AppFileUpload
        value={value}
        onChange={onChange}
        accept={accept}
        helperText={helperText}
        buttonText="Choose image"
        dragText="Drag & drop image here"
        browseText="or browse from your device"
        showFileList={!preview}
        {...props}
      />

      {preview && imageUrl ? (
        <Box
          sx={{
            mt: 1.5,
            width: previewSize,
            height: previewSize,
            position: "relative",
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${t.border}`,
            backgroundColor: t.surfaceAlt,
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt="Preview"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          <AppIconButton
            icon={<CloseRoundedIcon />}
            size="small"
            variant="contained"
            colorVariant="error"
            rounded="full"
            tooltip="Remove image"
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 28,
              height: 28,
              minWidth: 28,
            }}
          />
        </Box>
      ) : preview ? (
        <Box
          sx={{
            mt: 1.5,
            width: previewSize,
            height: previewSize,
            borderRadius: "16px",
            border: `1px dashed ${t.borderStrong}`,
            backgroundColor: t.surfaceAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 0.5,
            color: t.textMuted,
          }}
        >
          <ImageRoundedIcon sx={{ fontSize: 28 }} />
          <Typography sx={{ fontSize: "0.74rem", fontWeight: 600 }}>
            No image
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default AppImageUpload;
