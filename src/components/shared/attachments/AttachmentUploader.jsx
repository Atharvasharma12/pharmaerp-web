import React, { useState } from "react";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";

import {
  AppCard,
  AppStack,
  AppBox,
  AppHeading,
  AppText,
  AppCaption,
  AppButton,
  AppBadge,
  FileDropzone,
  AttachmentList,
} from "@/components";

const AttachmentUploader = ({
  title = "Upload Attachments",
  description = "Add files related to this record.",

  files = [],
  value,

  accept,
  multiple = true,
  maxSize,
  maxFiles,

  uploadLabel = "Upload Files",
  browseLabel = "Browse Files",

  loading = false,
  disabled = false,

  autoUpload = false,

  onChange,
  onUpload,
  onReject,
  onPreview,
  onDownload,
  onDelete,

  showList = true,
  listLayout = "list",

  sx = {},
}) => {
  const [localFiles, setLocalFiles] = useState([]);

  const currentFiles = value || files || [];
  const pendingFiles = localFiles;

  const handleFilesChange = (selectedFiles) => {
    const nextFiles = multiple
      ? [...pendingFiles, ...selectedFiles]
      : selectedFiles.slice(0, 1);

    setLocalFiles(nextFiles);
    onChange?.(nextFiles);

    if (autoUpload) {
      onUpload?.(nextFiles);
    }
  };

  const handleUpload = () => {
    onUpload?.(pendingFiles);
  };

  const handleDeletePending = (file) => {
    const nextFiles = pendingFiles.filter((item) => item !== file);
    setLocalFiles(nextFiles);
    onChange?.(nextFiles);
  };

  return (
    <AppCard
      variant="default"
      padding="lg"
      rounded="xl"
      shadow="none"
      bordered
      sx={sx}
    >
      <AppStack spacing={2.5}>
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

          <AppBadge
            label={`${currentFiles.length + pendingFiles.length} file${
              currentFiles.length + pendingFiles.length === 1 ? "" : "s"
            }`}
            size="small"
            variant="soft"
            colorVariant="primary"
          />
        </AppStack>

        <FileDropzone
          accept={accept}
          multiple={multiple}
          maxSize={maxSize}
          maxFiles={maxFiles}
          browseLabel={browseLabel}
          disabled={disabled}
          loading={loading}
          onFilesChange={handleFilesChange}
          onReject={onReject}
        />

        {pendingFiles.length > 0 && (
          <AppStack spacing={1.5}>
            <AppStack
              direction="row"
              align="center"
              justify="space-between"
              spacing={1}
            >
              <AppText weight={800}>Ready to upload</AppText>

              {!autoUpload && (
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  size="small"
                  startIcon={<UploadFileRoundedIcon />}
                  loading={loading}
                  disabled={disabled || pendingFiles.length === 0}
                  onClick={handleUpload}
                >
                  {uploadLabel}
                </AppButton>
              )}
            </AppStack>

            <AttachmentList
              title=""
              files={pendingFiles.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                status: "pending",
                raw: file,
              }))}
              showHeader={false}
              layout={listLayout}
              showPreview={false}
              showDownload={false}
              showDelete
              compact
              onDelete={(item) => handleDeletePending(item.raw)}
              bordered={false}
              surface={false}
            />
          </AppStack>
        )}

        {showList && currentFiles.length > 0 && (
          <AttachmentList
            title="Uploaded Files"
            description="Files already attached to this record."
            files={currentFiles}
            layout={listLayout}
            showPreview
            showDownload
            showDelete
            onPreview={onPreview}
            onDownload={onDownload}
            onDelete={onDelete}
            bordered={false}
            surface={false}
          />
        )}

        <AppCaption>
          Upload validation should also be handled on the server for security.
        </AppCaption>
      </AppStack>
    </AppCard>
  );
};

export default AttachmentUploader;
