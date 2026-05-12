import React from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import TableViewRoundedIcon from "@mui/icons-material/TableViewRounded";

import {
  AppButton,
  AppCard,
  AppStack,
  AppHeading,
  AppText,
  AppAlert,
} from "@/components";

const CsvTemplateDownload = ({
  title = "Download Import Template",
  description = "Use the provided CSV template to ensure your data matches the required import format.",

  fileName = "template.csv",
  templateUrl,

  columns = [],

  buttonText = "Download Template",

  variant = "soft",
  colorVariant = "primary",

  showColumns = true,
  disabled = false,

  onDownload,

  sx = {},
}) => {
  const handleDownload = () => {
    if (disabled) return;

    if (onDownload) {
      onDownload();
      return;
    }

    if (templateUrl) {
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AppCard variant={variant} bordered rounded="lg" padding="lg" sx={sx}>
      <AppStack spacing={2}>
        <AppStack direction="row" spacing={1.25} align="flex-start">
          <TableViewRoundedIcon
            sx={{
              color: "var(--color-primary)",
              mt: "2px",
            }}
          />

          <AppStack spacing={0.5}>
            <AppHeading level={6}>{title}</AppHeading>

            <AppText
              sx={{
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
              }}
            >
              {description}
            </AppText>
          </AppStack>
        </AppStack>

        {showColumns && columns.length > 0 ? (
          <AppAlert severity="info" variant="soft" title="Required Columns">
            {columns.join(", ")}
          </AppAlert>
        ) : null}

        <AppButton
          variant="contained"
          colorVariant={colorVariant}
          startIcon={<DownloadRoundedIcon />}
          onClick={handleDownload}
          disabled={disabled}
          sx={{
            width: "fit-content",
          }}
        >
          {buttonText}
        </AppButton>
      </AppStack>
    </AppCard>
  );
};

export default CsvTemplateDownload;
