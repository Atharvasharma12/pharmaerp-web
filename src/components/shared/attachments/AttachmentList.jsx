import React from "react";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";

import {
  AppCard,
  AppStack,
  AppGrid,
  AppBox,
  AppText,
  AppHeading,
  AppCaption,
  AppBadge,
  AppEmptyState,
  AppInlineLoader,
  FileCard,
} from "@/components";

const AttachmentList = ({
  title = "Attachments",
  description,

  files = [],

  layout = "list", // list | grid
  columns = {
    xs: 1,
    sm: 2,
    lg: 3,
  },

  loading = false,
  loadingText = "Loading attachments...",

  emptyTitle = "No attachments",
  emptyDescription = "Uploaded files will appear here.",

  showHeader = true,
  showCount = true,

  showPreview = true,
  showDownload = true,
  showDelete = true,

  onPreview,
  onDownload,
  onDelete,

  compact = false,
  bordered = true,
  surface = true,

  sx = {},
}) => {
  const hasFiles = files.length > 0;

  return (
    <AppCard
      variant={surface ? "default" : "ghost"}
      padding="lg"
      rounded="xl"
      shadow="none"
      bordered={bordered}
      sx={sx}
    >
      <AppStack spacing={2}>
        {showHeader && (
          <AppStack
            direction="row"
            align="flex-start"
            justify="space-between"
            spacing={2}
          >
            <AppBox sx={{ minWidth: 0 }}>
              <AppHeading level={6}>{title}</AppHeading>

              {description && (
                <AppText color="var(--color-text-muted)" sx={{ mt: 0.4 }}>
                  {description}
                </AppText>
              )}
            </AppBox>

            {showCount && (
              <AppBadge
                label={`${files.length} file${files.length === 1 ? "" : "s"}`}
                size="small"
                variant="soft"
                colorVariant="primary"
              />
            )}
          </AppStack>
        )}

        {loading ? (
          <AppBox
            bordered
            rounded
            sx={{
              py: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color-surface-alt)",
            }}
          >
            <AppInlineLoader text={loadingText} />
          </AppBox>
        ) : null}

        {!loading && !hasFiles ? (
          <AppEmptyState
            title={emptyTitle}
            description={emptyDescription}
            icon={<AttachFileRoundedIcon />}
            size="medium"
            fullHeight={false}
            sx={{
              minHeight: 220,
              border: "1px dashed var(--color-border)",
              borderRadius: "16px",
              backgroundColor: "var(--color-surface-alt)",
            }}
          />
        ) : null}

        {!loading && hasFiles && layout === "grid" ? (
          <AppGrid
            xs={columns.xs || 1}
            sm={columns.sm || columns.xs || 2}
            md={columns.md || columns.sm || 2}
            lg={columns.lg || columns.md || 3}
            xl={columns.xl || columns.lg || 3}
            gap={1.5}
          >
            {files.map((file, index) => (
              <FileCard
                key={file.id || file.name || index}
                file={file}
                compact={compact}
                showPreview={showPreview}
                showDownload={showDownload}
                showDelete={showDelete}
                onPreview={onPreview}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </AppGrid>
        ) : null}

        {!loading && hasFiles && layout === "list" ? (
          <AppStack spacing={1.2}>
            {files.map((file, index) => (
              <FileCard
                key={file.id || file.name || index}
                file={file}
                compact={compact}
                showPreview={showPreview}
                showDownload={showDownload}
                showDelete={showDelete}
                onPreview={onPreview}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </AppStack>
        ) : null}

        {!loading && hasFiles && (
          <AppCaption>
            Supported preview depends on file type and available file URL.
          </AppCaption>
        )}
      </AppStack>
    </AppCard>
  );
};

export default AttachmentList;
