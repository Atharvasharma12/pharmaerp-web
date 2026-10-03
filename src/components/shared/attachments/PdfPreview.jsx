import React from "react";
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

const PdfPreview = ({
  open = false,
  onClose,

  file,
  src,

  title = "PDF Preview",
  subtitle,

  showDownload = true,
  showOpenNew = true,

  onDownload,
  onOpenNew,

  maxWidth = "lg",

  sx = {},
}) => {
  const pdfSrc = src || file?.url || file?.previewUrl;
  const fileName = file?.name || "PDF file";

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
          <AppBadge
            label="PDF"
            variant="soft"
            colorVariant="error"
            size="small"
            startIcon={<PictureAsPdfRoundedIcon />}
          />

          {showOpenNew && pdfSrc && (
            <AppButton
              variant="outlined"
              colorVariant="primary"
              size="small"
              startIcon={<OpenInNewRoundedIcon />}
              onClick={() => onOpenNew?.(file)}
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
              onClick={() => onDownload?.(file)}
            >
              Download
            </AppButton>
          )}
        </AppStack>
      }
    >
      {pdfSrc ? (
        <AppBox
          sx={{
            width: "100%",
            height: "75vh",
            overflow: "hidden",
            borderRadius: "16px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface-alt)",
          }}
        >
          <iframe
            title={fileName}
            src={pdfSrc}
            style={{
              width: "100%",
              height: "100%",
              border: 0,
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
                backgroundColor: "var(--color-error-soft)",
                color: "var(--color-error)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                "& svg": {
                  fontSize: 34,
                },
              }}
            >
              <PictureAsPdfRoundedIcon />
            </AppBox>

            <AppText weight={800}>PDF unavailable</AppText>

            <AppText color="var(--color-text-muted)" sx={{ maxWidth: 360 }}>
              This PDF does not have a valid preview URL.
            </AppText>

            <AppCaption>{fileName}</AppCaption>
          </AppStack>
        </AppBox>
      )}
    </AppDialog>
  );
};

export default PdfPreview;
