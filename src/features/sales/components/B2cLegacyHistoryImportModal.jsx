import React, { useState, useEffect, useRef } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UISelect,
  UIAlert,
} from "@/components/ui";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Users,
  Package,
  FileText,
  Pause,
  Play,
  RotateCcw,
  Download,
  Loader2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import b2cLegacyImportService from "../services/b2cLegacyImportService";

export const B2cLegacyHistoryImportModal = ({ isOpen, onClose, onSuccess }) => {
  // Steps: 'upload' | 'mapping' | 'progress' | 'summary'
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Upload response info
  const [migrationId, setMigrationId] = useState("");
  const [fileFormat, setFileFormat] = useState("FLAT_TABULAR");
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [headers, setHeaders] = useState([]);
  const [chunkSize, setChunkSize] = useState(1000);
  const [columnMapping, setColumnMapping] = useState({
    customerNameField: "",
    mobileNumberField: "",
    medicineField: "",
  });

  // Progress & polling
  const [progressData, setProgressData] = useState(null);
  const pollIntervalRef = useRef(null);

  // Completion report
  const [reportData, setReportData] = useState(null);
  const [activeReportTab, setActiveReportTab] = useState("overview"); // 'overview' | 'skipped' | 'unmatched'

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const resetState = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setStep("upload");
    setFile(null);
    setIsLoading(false);
    setError("");
    setMigrationId("");
    setSheetNames([]);
    setSelectedSheet("");
    setHeaders([]);
    setChunkSize(1000);
    setColumnMapping({
      customerNameField: "",
      mobileNumberField: "",
      medicineField: "",
    });
    setProgressData(null);
    setReportData(null);
    setActiveReportTab("overview");
  };

  const handleClose = () => {
    if (step === "progress" && progressData?.status === "processing") {
      const confirmClose = window.confirm(
        "Import is currently running in the background. Are you sure you want to close this view? The import will continue running."
      );
      if (!confirmClose) return;
    }
    resetState();
    onClose();
  };

  // STEP 1: Handle File Selection & Upload
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError("");
    }
  };

  const handleUploadFile = async () => {
    if (!file) {
      setError("Please select an Excel or CSV file to upload");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await b2cLegacyImportService.uploadFile(file, {
        sheetName: selectedSheet,
        chunkSize,
      });

      const data = res.data?.data || res.data;
      setMigrationId(data.migrationId);
      setFileFormat(data.fileFormat || "FLAT_TABULAR");
      setSheetNames(data.sheetNames || []);
      setSelectedSheet(data.selectedSheet || data.sheetNames?.[0] || "");
      setHeaders(data.headers || []);

      if (data.detectedMapping) {
        setColumnMapping({
          customerNameField: data.detectedMapping.customerNameField || "",
          mobileNumberField: data.detectedMapping.mobileNumberField || "",
          medicineField: data.detectedMapping.medicineField || "",
        });
      }

      setStep("mapping");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to upload and analyze file"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Start Import & Begin Polling
  const startPolling = (migId) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await b2cLegacyImportService.getStatus(migId);
        const status = res.data?.data || res.data;
        setProgressData(status);

        if (status.status === "completed") {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          loadFinalReport(migId);
          if (onSuccess) onSuccess();
        } else if (status.status === "failed") {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setError(status.errorMessage || "Import job failed");
        }
      } catch (pollErr) {
        console.error("Polling error:", pollErr);
      }
    }, 1500);
  };

  const loadFinalReport = async (migId) => {
    try {
      const res = await b2cLegacyImportService.getReport(migId);
      setReportData(res.data?.data || res.data);
      setStep("summary");
    } catch (reportErr) {
      console.error("Failed to load report:", reportErr);
      setStep("summary");
    }
  };

  const handleStartImport = async () => {
    if (fileFormat !== "MARG_ERP_STATEMENT") {
      if (!columnMapping.mobileNumberField) {
        setError("Mobile Number column mapping is strictly required");
        return;
      }
      if (!columnMapping.medicineField) {
        setError("Medicine / Product column mapping is strictly required");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      await b2cLegacyImportService.startImport(migrationId, columnMapping);
      setStep("progress");
      startPolling(migrationId);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to start import");
    } finally {
      setIsLoading(false);
    }
  };

  // Pause / Resume Handlers
  const handlePause = async () => {
    try {
      await b2cLegacyImportService.pauseImport(migrationId);
      setProgressData((prev) => (prev ? { ...prev, status: "paused" } : prev));
    } catch (err) {
      setError("Failed to pause import: " + (err.response?.data?.message || err.message));
    }
  };

  const handleResume = async () => {
    try {
      await b2cLegacyImportService.resumeImport(migrationId);
      setProgressData((prev) => (prev ? { ...prev, status: "processing" } : prev));
      startPolling(migrationId);
    } catch (err) {
      setError("Failed to resume import: " + (err.response?.data?.message || err.message));
    }
  };

  // Download CSV Helpers
  const downloadCsv = (filename, csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSkipped = () => {
    const records = reportData?.skippedRecords || [];
    if (records.length === 0) return;

    let csv = "Row Number,Reason,Value\n";
    records.forEach((r) => {
      csv += `${r.rowNumber},"${r.reason}","${String(r.value || "").replace(/"/g, '""')}"\n`;
    });
    downloadCsv(`legacy-import-skipped-rows-${migrationId}.csv`, csv);
  };

  const handleExportUnmatched = () => {
    const records = reportData?.unmatchedMedicines || [];
    if (records.length === 0) return;

    let csv = "Row Number,Medicine Name\n";
    records.forEach((r) => {
      csv += `${r.rowNumber},"${String(r.medicineName || "").replace(/"/g, '""')}"\n`;
    });
    downloadCsv(`legacy-import-unmatched-medicines-${migrationId}.csv`, csv);
  };

  const headerOptions = [
    { label: "-- Auto Detect / None --", value: "" },
    ...headers.map((h) => ({ label: h, value: h })),
  ];

  return (
    <UIModal isOpen={isOpen} onClose={handleClose} size="lg" className="max-w-3xl">
      <UIModalHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <UIModalTitle>B2C Legacy Purchase History Import</UIModalTitle>
            <UIModalDescription>
              Stream & preserve customer-to-medicine purchase history without financial side effects
            </UIModalDescription>
          </div>
        </div>
      </UIModalHeader>

      <UIModalBody className="space-y-4">
        {error && (
          <UIAlert variant="danger" dismissible onDismiss={() => setError("")}>
            {error}
          </UIAlert>
        )}

        {/* STEP 1: UPLOAD */}
        {step === "upload" && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-2xl p-8 text-center cursor-pointer bg-surface/50 space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">
                  {file ? file.name : "Click to select or drag and drop Excel/CSV file"}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Supports large files (100k+ rows). Columns will be extracted and streamed in chunks.
                </p>
              </div>
              {file && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {(file.size / (1024 * 1024)).toFixed(2)} MB ready
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-border/60 bg-surface/30">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text">Chunk Size (Rows / Batch)</label>
                <UISelect
                  value={chunkSize}
                  onChange={(val) => setChunkSize(Number(val))}
                  options={[
                    { label: "500 rows per batch", value: 500 },
                    { label: "1,000 rows per batch (Default)", value: 1000 },
                    { label: "2,000 rows per batch", value: 2000 },
                  ]}
                />
              </div>
              <div className="text-[11px] text-text-muted flex items-center pt-5">
                Chunked streaming avoids out-of-memory errors and allows resuming if paused.
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: COLUMN MAPPING */}
        {step === "mapping" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/80 bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-text">
                  {fileFormat === "MARG_ERP_STATEMENT"
                    ? "Marg ERP Statement Layout"
                    : "Confirm Column Mappings"}
                </p>
                <span className="text-[11px] text-text-muted font-mono">{file?.name}</span>
              </div>

              {sheetNames.length > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text">Select Worksheet</label>
                  <UISelect
                    value={selectedSheet}
                    onChange={(val) => setSelectedSheet(val)}
                    options={sheetNames.map((s) => ({ label: s, value: s }))}
                  />
                </div>
              )}

              {fileFormat === "MARG_ERP_STATEMENT" ? (
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Marg ERP Statement Layout Auto-Detected</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    This file is structured in Marg ERP's hierarchical format (bill header followed by indented medicine rows). Customer names, 10-digit mobile numbers, and medicines will be automatically parsed from the statement hierarchy.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-surface border border-border">
                      <span className="text-text-muted text-[10px] block uppercase font-medium">Customer Mobile</span>
                      <span className="text-text font-semibold">Column 2 (10-Digit Mobile)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-border">
                      <span className="text-text-muted text-[10px] block uppercase font-medium">Customer Name</span>
                      <span className="text-text font-semibold">Column 2 (Patient / Buyer)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-border">
                      <span className="text-text-muted text-[10px] block uppercase font-medium">Medicine Name</span>
                      <span className="text-text font-semibold">Column 2 (Indented Items)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text flex items-center gap-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <UISelect
                      value={columnMapping.mobileNumberField}
                      onChange={(val) =>
                        setColumnMapping((prev) => ({ ...prev, mobileNumberField: val }))
                      }
                      options={headerOptions}
                      placeholder="Select Mobile Column"
                    />
                    <p className="text-[10px] text-text-muted">Must be valid 10-digit Indian mobile</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text flex items-center gap-1">
                      Medicine / Item <span className="text-rose-500">*</span>
                    </label>
                    <UISelect
                      value={columnMapping.medicineField}
                      onChange={(val) =>
                        setColumnMapping((prev) => ({ ...prev, medicineField: val }))
                      }
                      options={headerOptions}
                      placeholder="Select Medicine Column"
                    />
                    <p className="text-[10px] text-text-muted">Product / Drug / Item Name</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text">Customer Name (Optional)</label>
                    <UISelect
                      value={columnMapping.customerNameField}
                      onChange={(val) =>
                        setColumnMapping((prev) => ({ ...prev, customerNameField: val }))
                      }
                      options={headerOptions}
                      placeholder="Select Name Column"
                    />
                    <p className="text-[10px] text-text-muted">Fallback: Customer Name</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs text-text space-y-1">
              <p className="font-semibold text-primary">Idempotent Staging & Zero Financial Side-Effects</p>
              <p className="text-text-muted text-[11px]">
                Records are staged and deduplicated per customer across all chunks. Unmatched medicines are skipped without interrupting the migration. Historical bills do not reduce inventory or generate ledger accounting entries.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: LIVE PROGRESS */}
        {step === "progress" && progressData && (
          <div className="space-y-4">
            {/* Header Status & Controls */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface">
              <div className="flex items-center gap-2">
                {progressData.status === "processing" && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                )}
                {progressData.status === "paused" && (
                  <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                )}
                {progressData.status === "completed" && (
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                )}
                <span className="text-xs font-bold text-text uppercase tracking-wider">
                  Status: {progressData.status}
                </span>
                <span className="text-xs text-text-muted">
                  (Chunk {progressData.currentChunk} of {progressData.totalChunks || 1})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {progressData.status === "processing" ? (
                  <UIButton size="sm" variant="outline" onClick={handlePause} className="gap-1.5">
                    <Pause className="h-3.5 w-3.5" /> Pause
                  </UIButton>
                ) : progressData.status === "paused" ? (
                  <UIButton size="sm" variant="default" onClick={handleResume} className="gap-1.5">
                    <Play className="h-3.5 w-3.5" /> Resume
                  </UIButton>
                ) : null}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-text-muted">
                <span>Overall Progress</span>
                <span className="font-bold font-mono text-text">
                  {progressData.progressPercent}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressData.progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border border-border bg-surface text-center">
                <div className="text-[11px] text-text-muted font-medium">Total Rows</div>
                <div className="text-lg font-bold font-mono text-text">
                  {progressData.totalRows?.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface text-center">
                <div className="text-[11px] text-text-muted font-medium">Processed Rows</div>
                <div className="text-lg font-bold font-mono text-text">
                  {progressData.processedRows?.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Valid Records
                </div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {progressData.validRows?.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  Skipped Rows
                </div>
                <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                  {progressData.skippedRows?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl border border-border bg-surface">
                <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium mb-1">
                  <Users className="h-3.5 w-3.5" /> Unique Customers
                </div>
                <div className="text-base font-bold font-mono text-text">
                  {progressData.uniqueCustomersCount?.toLocaleString()}
                </div>
                <div className="text-[10px] text-text-muted mt-1">
                  {progressData.customersCreated?.toLocaleString()} created ·{" "}
                  {progressData.customersExisting?.toLocaleString()} matched
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-surface">
                <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium mb-1">
                  <Package className="h-3.5 w-3.5" /> Products Matched
                </div>
                <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {progressData.matchedProducts?.toLocaleString()}
                </div>
                <div className="text-[10px] text-rose-500 mt-1">
                  {progressData.unmatchedProducts?.toLocaleString()} unmatched
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-surface sm:col-span-1 col-span-2">
                <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium mb-1">
                  <FileText className="h-3.5 w-3.5" /> Historical Bills
                </div>
                <div className="text-base font-bold font-mono text-primary">
                  {progressData.invoicesCreated?.toLocaleString()}
                </div>
                <div className="text-[10px] text-text-muted mt-1">1 bill per customer</div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: FINAL SUMMARY & REPORT */}
        {step === "summary" && reportData && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  B2C Legacy Import Completed Successfully
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Customer purchase histories have been securely preserved in historical bills.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-border text-xs font-semibold gap-4">
              <button
                onClick={() => setActiveReportTab("overview")}
                className={`pb-2 border-b-2 transition-colors ${
                  activeReportTab === "overview"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                Overview Summary
              </button>
              <button
                onClick={() => setActiveReportTab("skipped")}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeReportTab === "skipped"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                Skipped Rows ({reportData.skippedRecords?.length || 0})
              </button>
              <button
                onClick={() => setActiveReportTab("unmatched")}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeReportTab === "unmatched"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                Unmatched Medicines ({reportData.unmatchedMedicines?.length || 0})
              </button>
            </div>

            {/* TAB: OVERVIEW */}
            {activeReportTab === "overview" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-border bg-surface text-center">
                  <div className="text-[11px] text-text-muted font-medium">Total Rows Processed</div>
                  <div className="text-lg font-bold font-mono text-text">
                    {reportData.summary?.processedRows?.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Valid Records
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {reportData.summary?.validRows?.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    Skipped Records
                  </div>
                  <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                    {reportData.summary?.skippedRows?.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-surface text-center">
                  <div className="text-[11px] text-text-muted font-medium">Unique Customers</div>
                  <div className="text-lg font-bold font-mono text-text">
                    {reportData.summary?.uniqueCustomersCount?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">
                    {reportData.summary?.customersCreated?.toLocaleString()} created ·{" "}
                    {reportData.summary?.customersExisting?.toLocaleString()} matched
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-surface text-center">
                  <div className="text-[11px] text-text-muted font-medium">Medicines Matched</div>
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {reportData.summary?.matchedProducts?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-rose-500 mt-0.5">
                    {reportData.summary?.unmatchedProducts?.toLocaleString()} unmatched
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 text-center">
                  <div className="text-[11px] text-primary font-medium">Historical Bills Created</div>
                  <div className="text-lg font-bold font-mono text-primary">
                    {reportData.summary?.invoicesCreated?.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SKIPPED ROWS */}
            {activeReportTab === "skipped" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">
                    Showing up to {reportData.skippedRecords?.length} skipped records (invalid mobile, missing data).
                  </p>
                  {reportData.skippedRecords?.length > 0 && (
                    <UIButton size="xs" variant="outline" onClick={handleExportSkipped} className="gap-1">
                      <Download className="h-3 w-3" /> Download CSV
                    </UIButton>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto border border-border rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border sticky top-0">
                      <tr>
                        <th className="p-2 font-semibold">Row</th>
                        <th className="p-2 font-semibold">Reason</th>
                        <th className="p-2 font-semibold">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {reportData.skippedRecords?.length > 0 ? (
                        reportData.skippedRecords.map((r, i) => (
                          <tr key={i} className="hover:bg-muted/30">
                            <td className="p-2 font-mono text-text-muted">{r.rowNumber}</td>
                            <td className="p-2 text-rose-500 font-medium">{r.reason}</td>
                            <td className="p-2 font-mono">{r.value || "—"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-text-muted">
                            No skipped records
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: UNMATCHED MEDICINES */}
            {activeReportTab === "unmatched" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">
                    Showing {reportData.unmatchedMedicines?.length} medicines that did not match existing inventory products.
                  </p>
                  {reportData.unmatchedMedicines?.length > 0 && (
                    <UIButton size="xs" variant="outline" onClick={handleExportUnmatched} className="gap-1">
                      <Download className="h-3 w-3" /> Download CSV
                    </UIButton>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto border border-border rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border sticky top-0">
                      <tr>
                        <th className="p-2 font-semibold">Row</th>
                        <th className="p-2 font-semibold">Medicine Name In Excel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {reportData.unmatchedMedicines?.length > 0 ? (
                        reportData.unmatchedMedicines.map((m, i) => (
                          <tr key={i} className="hover:bg-muted/30">
                            <td className="p-2 font-mono text-text-muted">{m.rowNumber}</td>
                            <td className="p-2 font-medium">{m.medicineName}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="p-4 text-center text-text-muted">
                            All medicines matched existing products!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </UIModalBody>

      <UIModalFooter className="flex items-center justify-between">
        {step === "upload" && (
          <>
            <UIButton variant="ghost" onClick={handleClose}>
              Cancel
            </UIButton>
            <UIButton
              variant="default"
              disabled={!file || isLoading}
              onClick={handleUploadFile}
              className="gap-1.5"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Continue to Column Mapping <ChevronRight className="h-4 w-4" />
            </UIButton>
          </>
        )}

        {step === "mapping" && (
          <>
            <UIButton variant="outline" onClick={() => setStep("upload")} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </UIButton>
            <UIButton
              variant="default"
              disabled={
                isLoading ||
                (fileFormat !== "MARG_ERP_STATEMENT" &&
                  (!columnMapping.mobileNumberField || !columnMapping.medicineField))
              }
              onClick={handleStartImport}
              className="gap-1.5"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {fileFormat === "MARG_ERP_STATEMENT" ? "Start Marg ERP Import" : "Start Import"}{" "}
              <ChevronRight className="h-4 w-4" />
            </UIButton>
          </>
        )}

        {step === "progress" && (
          <div className="w-full flex justify-end">
            <UIButton variant="outline" onClick={handleClose}>
              Close & Run in Background
            </UIButton>
          </div>
        )}

        {step === "summary" && (
          <div className="w-full flex justify-end">
            <UIButton variant="default" onClick={handleClose}>
              Done
            </UIButton>
          </div>
        )}
      </UIModalFooter>
    </UIModal>
  );
};

export default B2cLegacyHistoryImportModal;
