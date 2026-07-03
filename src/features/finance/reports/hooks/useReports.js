import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReport } from "../store/reportsThunk";
import {
  clearReportsError,
  clearReportsMessage,
  clearReportData,
} from "../store/reportsSlice";
import {
  selectReportData,
  selectReportsStatus,
  selectReportsError,
  selectReportsMessage,
} from "../store/reportsSelector";

const useReports = () => {
  const dispatch = useDispatch();

  const reportData = useSelector(selectReportData);
  const status = useSelector(selectReportsStatus);
  const error = useSelector(selectReportsError);
  const message = useSelector(selectReportsMessage);

  const fetchReport = useCallback(
    (reportType, params = {}) => {
      return dispatch(getReport({ reportType, params })).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearReportsError());
  }, [dispatch]);

  const clearMessage = useCallback(() => {
    dispatch(clearReportsMessage());
  }, [dispatch]);

  const clearReport = useCallback(() => {
    dispatch(clearReportData());
  }, [dispatch]);

  return {
    reportData,
    status,
    error,
    message,
    fetchReport,
    clearError,
    clearMessage,
    clearReport,
  };
};

export default useReports;
