import React, { useState, useRef } from "react";
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
  Download,
  PhoneCall,
  Copy,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import customerService from "../services/customerService";
import * as XLSX from "xlsx";

const STATUS_BADGES = {
  NEW_CUSTOMER: {
    label: "New Customer",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  EXISTING_CUSTOMER_MATCHED: {
    label: "Existing Matched",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: CheckCircle2,
  },
  SHARED_PHONE_DETECTED: {
    label: "Shared Phone",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: PhoneCall,
  },
  DUPLICATE_ROW_IN_FILE: {
    label: "Duplicate in File",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Copy,
  },
  MISSING_PHONE: {
    label: "Missing Phone (Skip)",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: XCircle,
  },
  INVALID_PHONE: {
    label: "Invalid Phone (Skip)",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: XCircle,
  },
  MISSING_NAME: {
    label: "Missing Name (Skip)",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: XCircle,
  },
  MULTIPLE_MATCHES_REVIEW: {
    label: "Multiple Matches (Review)",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    icon: AlertCircle,
  },
  POSSIBLE_DUPLICATE_REVIEW: {
    label: "Possible Duplicate (Review)",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    icon: AlertCircle,
  },
};

export const B2cCustomerImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("upload"); // 'upload' | 'mapping' | 'preview' | 'result'
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Preview & Mapping data from server
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [headers, setHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({
    nameField: "",
    phoneField: "",
    cityField: "",
    genderField: "",
  });

  const [previewSummary, setPreviewSummary] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [allRowsCount, setAllRowsCount] = useState(0);

  // Client-side batch chunking state
  const [allRawRows, setAllRawRows] = useState([]);
  const [chunkProgress, setChunkProgress] = useState({
    currentChunk: 0,
    totalChunks: 0,
    processedRows: 0,
    totalRows: 0,
    created: 0,
    reused: 0,
    linked: 0,
    skipped: 0,
  });

  // Final Import Result
  const [finalResult, setFinalResult] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      await parseFile(selectedFile);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
      await parseFile(droppedFile);
    }
  };

  const parseFile = async (fileToParse, sheetToUse = null, mappingToUse = null) => {
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", fileToParse);
      if (sheetToUse) formData.append("sheetName", sheetToUse);
      if (mappingToUse) formData.append("columnMapping", JSON.stringify(mappingToUse));

      const res = await customerService.previewB2CImport(formData);
      const data = res.data?.data || {};

      setSheetNames(data.sheetNames || []);
      setSelectedSheet(data.selectedSheet || data.sheetNames?.[0] || "");
      setHeaders(data.headers || []);

      const detected = data.detectedMapping || {};
      setColumnMapping({
        nameField: mappingToUse?.nameField || detected.nameField || "",
        phoneField: mappingToUse?.phoneField || detected.phoneField || "",
        cityField: mappingToUse?.cityField || detected.cityField || "",
        genderField: mappingToUse?.genderField || detected.genderField || "",
      });

      setPreviewSummary(data.summary || null);
      setPreviewRows(data.previewRows || []);
      setAllRowsCount(data.allRowsCount || 0);

      // Extract client-side raw rows for chunking
      try {
        const buffer = await fileToParse.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const targetSheet = sheetToUse || data.selectedSheet || wb.SheetNames[0];
        const ws = wb.Sheets[targetSheet];
        const extracted = ws ? XLSX.utils.sheet_to_json(ws, { defval: "" }) : [];
        setAllRawRows(extracted);
      } catch (clientErr) {
        console.warn("Client-side sheet extraction fallback:", clientErr);
      }

      // Move to mapping if not yet configured, or to preview
      if (step === "upload") {
        setStep("mapping");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to parse Excel file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyMapping = async () => {
    if (!columnMapping.nameField) {
      setError("Please select a column for Customer Name.");
      return;
    }
    if (!columnMapping.phoneField) {
      setError("Please select a column for Phone Number.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await parseFile(file, selectedSheet, columnMapping);
      setStep("preview");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to generate preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsLoading(true);
    setError("");

    const CHUNK_SIZE = 250;
    let rowsToProcess = allRawRows;

    // Fallback if browser hadn't extracted allRawRows
    if (!rowsToProcess || rowsToProcess.length === 0) {
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = selectedSheet || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        rowsToProcess = worksheet ? XLSX.utils.sheet_to_json(worksheet, { defval: "" }) : [];
        setAllRawRows(rowsToProcess);
      } catch {
        rowsToProcess = [];
      }
    }

    if (!rowsToProcess || rowsToProcess.length === 0) {
      // Fallback: send file directly if sheet is empty in client parser
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sheetName", selectedSheet);
        formData.append("columnMapping", JSON.stringify(columnMapping));

        const res = await customerService.confirmB2CImport(formData);
        setFinalResult(res.data?.data || {});
        setStep("result");
        if (onSuccess) onSuccess();
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to complete import");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const totalRows = rowsToProcess.length;
    const numChunks = Math.ceil(totalRows / CHUNK_SIZE);

    setStep("importing");

    const aggregatedSummary = {
      totalRows: 0,
      created: 0,
      reused: 0,
      duplicateRowsIgnored: 0,
      linkedToSharedContactGroups: 0,
      skippedMissingPhone: 0,
      skippedInvalidPhone: 0,
      skippedMissingName: 0,
      reviewRequired: 0,
      failed: 0,
    };
    const aggregatedSkippedRows = [];

    try {
      for (let chunkIdx = 0; chunkIdx < numChunks; chunkIdx++) {
        const startIdx = chunkIdx * CHUNK_SIZE;
        const endIdx = Math.min(startIdx + CHUNK_SIZE, totalRows);
        const chunkRows = rowsToProcess.slice(startIdx, endIdx);
        const startRowNumber = startIdx + 2;

        setChunkProgress({
          currentChunk: chunkIdx + 1,
          totalChunks: numChunks,
          processedRows: endIdx,
          totalRows,
          created: aggregatedSummary.created,
          reused: aggregatedSummary.reused,
          linked: aggregatedSummary.linkedToSharedContactGroups,
          skipped:
            aggregatedSummary.skippedMissingPhone +
            aggregatedSummary.skippedInvalidPhone +
            aggregatedSummary.skippedMissingName +
            aggregatedSummary.reviewRequired,
        });

        const res = await customerService.confirmB2CImport({
          rows: chunkRows,
          columnMapping,
          startRowNumber,
        });

        const data = res.data?.data || {};
        const chunkSummary = data.summary || {};
        const chunkSkipped = data.skippedRows || [];

        aggregatedSummary.totalRows += chunkSummary.totalRows || chunkRows.length;
        aggregatedSummary.created += chunkSummary.created || 0;
        aggregatedSummary.reused += chunkSummary.reused || 0;
        aggregatedSummary.duplicateRowsIgnored += chunkSummary.duplicateRowsIgnored || 0;
        aggregatedSummary.linkedToSharedContactGroups +=
          chunkSummary.linkedToSharedContactGroups || 0;
        aggregatedSummary.skippedMissingPhone += chunkSummary.skippedMissingPhone || 0;
        aggregatedSummary.skippedInvalidPhone += chunkSummary.skippedInvalidPhone || 0;
        aggregatedSummary.skippedMissingName += chunkSummary.skippedMissingName || 0;
        aggregatedSummary.reviewRequired += chunkSummary.reviewRequired || 0;
        aggregatedSummary.failed += chunkSummary.failed || 0;

        aggregatedSkippedRows.push(...chunkSkipped);
      }

      setFinalResult({
        summary: aggregatedSummary,
        skippedRows: aggregatedSkippedRows,
      });
      setStep("result");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed during batch import");
      if (aggregatedSummary.totalRows > 0) {
        setFinalResult({
          summary: aggregatedSummary,
          skippedRows: aggregatedSkippedRows,
        });
        setStep("result");
      } else {
        setStep("preview");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadErrorReport = () => {
    if (!finalResult?.skippedRows || finalResult.skippedRows.length === 0) return;

    const headersLine = [
      "Row Number",
      "Customer Name",
      "Phone Number",
      "Status",
      "Reason",
      "Matching Customer IDs",
    ];
    const csvRows = [headersLine.join(",")];

    for (const row of finalResult.skippedRows) {
      const escaped = [
        row.rowNumber,
        `"${String(row.name || "").replace(/"/g, '""')}"`,
        `"${String(row.phone || "").replace(/"/g, '""')}"`,
        `"${String(row.status || "").replace(/"/g, '""')}"`,
        `"${String(row.reason || "").replace(/"/g, '""')}"`,
        `"${String(row.matchingCustomerIds || "").replace(/"/g, '""')}"`,
      ];
      csvRows.push(escaped.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `b2c_import_skipped_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetAndClose = () => {
    if (isLoading || step === "importing") return;
    setStep("upload");
    setFile(null);
    setError("");
    setPreviewSummary(null);
    setPreviewRows([]);
    setAllRawRows([]);
    setFinalResult(null);
    setChunkProgress({
      currentChunk: 0,
      totalChunks: 0,
      processedRows: 0,
      totalRows: 0,
      created: 0,
      reused: 0,
      linked: 0,
      skipped: 0,
    });
    onClose();
  };

  const headerOptions = [
    { label: "-- None / Leave Unmapped --", value: "" },
    ...headers.map((h) => ({ label: h, value: h })),
  ];

  return (
    <UIModal isOpen={isOpen} onClose={handleResetAndClose} className="max-w-4xl">
      <UIModalHeader>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Users className="size-4" />
          </div>
          <div>
            <UIModalTitle>Import B2C Customers</UIModalTitle>
            <UIModalDescription>
              Smart B2C customer import with phone sharing detection & family grouping
            </UIModalDescription>
          </div>
        </div>
      </UIModalHeader>

      <UIModalBody>
        <div className="space-y-4 py-1">
          {error && <UIAlert intent="danger" title="Import Error" description={error} />}

          {/* Stepper Progress */}
          <div className="flex items-center justify-between px-4 py-2 bg-surface-muted/50 rounded-xl border border-border/60 text-xs font-semibold">
            <span className={step === "upload" ? "text-primary font-bold" : "text-text-muted"}>
              1. Upload File
            </span>
            <ChevronRight className="size-3 text-text-muted" />
            <span className={step === "mapping" ? "text-primary font-bold" : "text-text-muted"}>
              2. Column Mapping
            </span>
            <ChevronRight className="size-3 text-text-muted" />
            <span className={step === "preview" ? "text-primary font-bold" : "text-text-muted"}>
              3. Preview & Validation
            </span>
            <ChevronRight className="size-3 text-text-muted" />
            <span className={step === "result" ? "text-primary font-bold" : "text-text-muted"}>
              4. Complete
            </span>
          </div>

          {/* STEP 1: UPLOAD */}
          {step === "upload" && (
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    {isLoading ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      <Upload className="size-6" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">
                      {file ? file.name : "Click to upload or drag and drop B2C Excel file"}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Supports .xlsx and .xls (up to 25,000 records)
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-surface-muted/30 p-3.5 text-xs text-text-muted space-y-1">
                <p className="font-semibold text-text">Important B2C Rules Applied:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Valid Customer Name and Phone Number are strictly required.</li>
                  <li>Customers sharing a phone number are preserved as separate profiles.</li>
                  <li>Shared contacts are automatically grouped and assigned default family relations.</li>
                  <li>Rows with missing or invalid phones will be skipped and reported.</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: COLUMN MAPPING */}
          {step === "mapping" && (
            <div className="space-y-4">
              {sheetNames.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text">Select Sheet</label>
                  <UISelect
                    value={selectedSheet}
                    onChange={(val) => {
                      setSelectedSheet(val);
                      parseFile(file, val, columnMapping);
                    }}
                    options={sheetNames.map((s) => ({ label: s, value: s }))}
                  />
                </div>
              )}

              <div className="rounded-xl border border-border/80 bg-surface p-4 space-y-3">
                <p className="text-xs font-bold text-text">Verify or Adjust Column Mapping</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text flex items-center gap-1">
                      Customer Name <span className="text-rose-500">*</span>
                    </label>
                    <UISelect
                      value={columnMapping.nameField}
                      onChange={(val) => setColumnMapping((prev) => ({ ...prev, nameField: val }))}
                      options={headerOptions}
                      placeholder="Select Name Column"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text flex items-center gap-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <UISelect
                      value={columnMapping.phoneField}
                      onChange={(val) => setColumnMapping((prev) => ({ ...prev, phoneField: val }))}
                      options={headerOptions}
                      placeholder="Select Mobile Column"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text">City / Locality (Optional)</label>
                    <UISelect
                      value={columnMapping.cityField}
                      onChange={(val) => setColumnMapping((prev) => ({ ...prev, cityField: val }))}
                      options={headerOptions}
                      placeholder="Select City Column"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text">Gender (Optional)</label>
                    <UISelect
                      value={columnMapping.genderField}
                      onChange={(val) => setColumnMapping((prev) => ({ ...prev, genderField: val }))}
                      options={headerOptions}
                      placeholder="Select Gender Column"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & VALIDATION */}
          {step === "preview" && (
            <div className="space-y-4">
              {/* Summary Metrics */}
              {previewSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl border border-border bg-surface text-center">
                    <div className="text-[11px] text-text-muted font-medium">Total Rows</div>
                    <div className="text-lg font-bold font-mono text-text">{previewSummary.totalRows}</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">New Customers</div>
                    <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{previewSummary.newCustomers}</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center">
                    <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Shared Phones</div>
                    <div className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">{previewSummary.sharedPhoneNumbers}</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Will Skip (Invalid)</div>
                    <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                      {previewSummary.skippedMissingPhone + previewSummary.skippedInvalidPhone + previewSummary.skippedMissingName}
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="rounded-xl border border-border bg-surface overflow-hidden">
                <div className="px-3 py-2 bg-surface-muted/40 border-b border-border flex items-center justify-between text-xs font-semibold text-text-muted">
                  <span>Showing first {previewRows.length} of {allRowsCount} rows</span>
                  {allRowsCount > previewRows.length && (
                    <span className="text-[11px] text-text-muted">Remaining {allRowsCount - previewRows.length} rows processed in batch</span>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-border/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-muted/20 sticky top-0 font-semibold text-text">
                      <tr>
                        <th className="p-2 w-14">Row</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Customer Name</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">City</th>
                        <th className="p-2">Note / Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {previewRows.map((r, i) => {
                        const badge = STATUS_BADGES[r.status] || {
                          label: r.status,
                          className: "bg-surface-muted text-text-muted border-border",
                          icon: AlertCircle,
                        };
                        const Icon = badge.icon;
                        return (
                          <tr key={i} className="hover:bg-surface-muted/30">
                            <td className="p-2 font-mono text-text-muted">{r.rowNumber}</td>
                            <td className="p-2">
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[11px] font-medium ${badge.className}`}
                              >
                                <Icon className="size-3" />
                                {badge.label}
                              </span>
                            </td>
                            <td className="p-2 font-semibold text-text">{r.name || "-"}</td>
                            <td className="p-2 font-mono text-text">{r.phone || r.rawPhone || "-"}</td>
                            <td className="p-2 text-text-muted">{r.city || "-"}</td>
                            <td className="p-2 text-text-muted truncate max-w-xs">{r.skipReason || r.reviewReason || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CHUNK BATCH IMPORTING IN PROGRESS */}
          {step === "importing" && (
            <div className="space-y-6 py-6 px-4">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-1">
                  <Loader2 className="size-8 animate-spin" />
                </div>
                <h3 className="text-base font-bold text-text">
                  Importing B2C Customers in Batches...
                </h3>
                <p className="text-xs text-text-muted">
                  Processing batch {chunkProgress.currentChunk} of {chunkProgress.totalChunks} ({chunkProgress.processedRows} of {chunkProgress.totalRows} rows)
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between text-xs font-semibold text-text">
                  <span>Batch Progress</span>
                  <span>
                    {Math.round(
                      (chunkProgress.processedRows / (chunkProgress.totalRows || 1)) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2.5 w-full bg-surface-muted rounded-full overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-linear-to-r from-primary to-emerald-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (chunkProgress.processedRows / (chunkProgress.totalRows || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Live counters grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs max-w-xl mx-auto">
                <div className="p-3 rounded-xl border border-border bg-surface text-center">
                  <span className="text-text-muted block text-[11px]">Created</span>
                  <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {chunkProgress.created}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface text-center">
                  <span className="text-text-muted block text-[11px]">Reused</span>
                  <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                    {chunkProgress.reused}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface text-center">
                  <span className="text-text-muted block text-[11px]">Shared Phone</span>
                  <span className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
                    {chunkProgress.linked}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface text-center">
                  <span className="text-text-muted block text-[11px]">Skipped</span>
                  <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                    {chunkProgress.skipped}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-center text-text-muted">
                Chunks are processed in small batches of 250 rows to prevent connection timeouts.
              </p>
            </div>
          )}

          {/* STEP 5: FINAL RESULTS & DOWNLOAD REPORT */}
          {step === "result" && finalResult && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <CheckCircle2 className="size-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-base font-bold text-text">Import Completed Successfully</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Processed {finalResult.summary?.totalRows || 0} customer records
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl border border-border bg-surface">
                  <span className="text-text-muted">Customers Created</span>
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {finalResult.summary?.created || 0}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface">
                  <span className="text-text-muted">Existing Reused</span>
                  <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                    {finalResult.summary?.reused || 0}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface">
                  <span className="text-text-muted">Shared Contacts Linked</span>
                  <div className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
                    {finalResult.summary?.linkedToSharedContactGroups || 0}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface">
                  <span className="text-text-muted">Skipped / Review Rows</span>
                  <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                    {(finalResult.summary?.skippedMissingPhone || 0) +
                      (finalResult.summary?.skippedInvalidPhone || 0) +
                      (finalResult.summary?.skippedMissingName || 0) +
                      (finalResult.summary?.reviewRequired || 0)}
                  </div>
                </div>
              </div>

              {finalResult.skippedRows && finalResult.skippedRows.length > 0 && (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <div>
                    <p className="text-xs font-bold text-text">
                      {finalResult.skippedRows.length} rows were skipped or need manual review
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Download detailed report with row numbers, raw phones, and reasons
                    </p>
                  </div>
                  <UIButton
                    variant="outline"
                    size="sm"
                    startIcon={<Download className="size-3.5" />}
                    onClick={downloadErrorReport}
                  >
                    Download CSV Report
                  </UIButton>
                </div>
              )}
            </div>
          )}
        </div>
      </UIModalBody>

      <UIModalFooter>
        {step === "upload" && (
          <UIButton variant="ghost" onClick={handleResetAndClose} disabled={isLoading}>
            Cancel
          </UIButton>
        )}

        {step === "mapping" && (
          <>
            <UIButton
              variant="ghost"
              startIcon={<ArrowLeft className="size-3.5" />}
              onClick={() => setStep("upload")}
              disabled={isLoading}
            >
              Back
            </UIButton>
            <UIButton
              variant="primary"
              onClick={handleApplyMapping}
              disabled={isLoading || !columnMapping.nameField || !columnMapping.phoneField}
            >
              {isLoading ? "Analyzing..." : "Review Preview"}
            </UIButton>
          </>
        )}

        {step === "preview" && (
          <>
            <UIButton
              variant="ghost"
              startIcon={<ArrowLeft className="size-3.5" />}
              onClick={() => setStep("mapping")}
              disabled={isLoading}
            >
              Adjust Mapping
            </UIButton>
            <UIButton variant="primary" onClick={handleConfirmImport} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Importing Customers...
                </>
              ) : (
                "Confirm & Start Import"
              )}
            </UIButton>
          </>
        )}

        {step === "importing" && (
          <div className="flex items-center gap-2 text-xs text-text-muted py-1">
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span>Processing batch {chunkProgress.currentChunk} of {chunkProgress.totalChunks}... Please keep this window open.</span>
          </div>
        )}

        {step === "result" && (
          <UIButton variant="primary" onClick={handleResetAndClose}>
            Done
          </UIButton>
        )}
      </UIModalFooter>
    </UIModal>
  );
};

export default B2cCustomerImportModal;
