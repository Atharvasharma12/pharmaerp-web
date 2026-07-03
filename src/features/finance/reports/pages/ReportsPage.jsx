import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks";

import ReportsDesktopPage from "./desktop/ReportsDesktopPage";
import ReportsMobilePage from "./mobile/ReportsMobilePage";

const ReportsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleReportChange = (reportKey) => {
    if (reportKey) {
      navigate(`/finance/reports/${reportKey}`);
    } else {
      navigate(`/finance/reports`);
    }
  };

  const pageProps = {
    handleReportChange,
  };

  return isMobile ? (
    <ReportsMobilePage {...pageProps} />
  ) : (
    <ReportsDesktopPage {...pageProps} />
  );
};

export default ReportsPage;
