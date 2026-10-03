import { createAsyncThunk } from "@reduxjs/toolkit";
import reportsService from "../services/reportsService";
import { getErrorMessage } from "@/utils";

export const getReport = createAsyncThunk(
  "reports/getReport",
  async ({ reportType, params = {} }, { rejectWithValue }) => {
    try {
      let response;
      switch (reportType) {
        case "trial-balance":
          response = await reportsService.getTrialBalance(params);
          break;
        case "general-ledger":
          response = await reportsService.getGeneralLedger(params);
          break;
        case "customer-ledger":
          response = await reportsService.getCustomerLedger(params);
          break;
        case "supplier-ledger":
          response = await reportsService.getSupplierLedger(params);
          break;
        case "cash-book":
          response = await reportsService.getCashBook(params);
          break;
        case "bank-book":
          response = await reportsService.getBankBook(params);
          break;
        case "profit-loss":
          response = await reportsService.getProfitLoss(params);
          break;
        case "balance-sheet":
          response = await reportsService.getBalanceSheet(params);
          break;
        case "gst-report":
          response = await reportsService.getGstReport(params);
          break;
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
