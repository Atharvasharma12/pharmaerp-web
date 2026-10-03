import React from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import TableViewRoundedIcon from "@mui/icons-material/TableViewRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";

import { AppDropdown } from "@/components";

const AppExport = ({
  data = [],
  filename = "export",

  onExport,
  onCsvExport,
  onExcelExport,
  onPdfExport,

  label = "Export",

  disabled = false,
  loading = false,
  dense = false,

  formats = ["csv", "excel", "pdf"],

  triggerType = "button",
  variant = "outlined",
  colorVariant = "dark",

  sx = {},
  ...props
}) => {
  const hasData = Array.isArray(data) && data.length > 0;

  const handleExport = (format) => {
    if (disabled || loading) return;

    const payload = {
      format,
      data,
      filename,
    };

    if (format === "csv") {
      onCsvExport?.(payload);
    }

    if (format === "excel") {
      onExcelExport?.(payload);
    }

    if (format === "pdf") {
      onPdfExport?.(payload);
    }

    onExport?.(payload);
  };

  const items = [
    {
      key: "csv",
      label: "Export CSV",
      icon: <DescriptionRoundedIcon />,
      onClick: () => handleExport("csv"),
    },
    {
      key: "excel",
      label: "Export Excel",
      icon: <TableViewRoundedIcon />,
      onClick: () => handleExport("excel"),
    },
    {
      key: "pdf",
      label: "Export PDF",
      icon: <PictureAsPdfRoundedIcon />,
      onClick: () => handleExport("pdf"),
    },
  ].filter((item) => formats.includes(item.key));

  return (
    <AppDropdown
      label={label}
      icon={<DownloadRoundedIcon />}
      items={items}
      triggerType={triggerType}
      variant={variant}
      colorVariant={colorVariant}
      size={dense ? "small" : "medium"}
      disabled={disabled || loading || !hasData}
      loading={loading}
      menuMinWidth={180}
      sx={sx}
      {...props}
    />
  );
};

export default AppExport;
