import React from "react";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
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

const ImagePreview = ({
  open = false,
  onClose,

  image,
  src,
  alt,
  title = "Image Preview",
  subtitle,

  showDownload = true,
  showOpenNew = true,

  onDownload,
  onOpenNew,

  maxWidth = "md",

  sx = {},
}) => {
  const imageSrc = src || image?.url || image?.previewUrl || image?.thumbnail;
  const imageName = alt || image?.name || "Image";

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle || imageName}
      maxWidth={maxWidth}
      fullWidth
      contentSx={sx}
      actions={
        <AppStack direction="row" spacing={1} justify="flex-end" wrap="wrap">
          <AppBadge
            label="IMAGE"
            variant="soft"
            colorVariant="info"
            size="small"
            startIcon={<ImageRoundedIcon />}
          />

          {showOpenNew && imageSrc && (
            <AppButton
              variant="outlined"
              colorVariant="primary"
              size="small"
              startIcon={<OpenInNewRoundedIcon />}
              onClick={() => onOpenNew?.(image)}
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
              onClick={() => onDownload?.(image)}
            >
              Download
            </AppButton>
          )}
        </AppStack>
      }
    >
      {imageSrc ? (
        <AppBox
          sx={{
            width: "100%",
            minHeight: 420,
            maxHeight: "75vh",
            backgroundColor: "var(--color-surface-alt)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <img
            src={imageSrc}
            alt={imageName}
            style={{
              maxWidth: "100%",
              maxHeight: "72vh",
              objectFit: "contain",
              display: "block",
              borderRadius: "12px",
            }}
          />
        </AppBox>
      ) : (
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
                backgroundColor: "var(--color-info-soft)",
                color: "var(--color-info)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                "& svg": {
                  fontSize: 34,
                },
              }}
            >
              <ImageRoundedIcon />
            </AppBox>

            <AppText weight={800}>Image unavailable</AppText>

            <AppText color="var(--color-text-muted)" sx={{ maxWidth: 360 }}>
              This image does not have a valid preview URL.
            </AppText>

            <AppCaption>{imageName}</AppCaption>
          </AppStack>
        </AppBox>
      )}
    </AppDialog>
  );
};

export default ImagePreview;
