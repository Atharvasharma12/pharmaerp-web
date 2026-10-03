import React, { useState, useCallback, useMemo } from "react";
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiRefreshCw,
  FiBox,
  FiTag,
  FiCheck,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  AppAlert,
  AppIconButton,
} from "./ui";
import { UIModal, UIModalHeader, UIModalTitle, UIModalDescription, UIModalBody, UIModalFooter } from "./ui/UIModal";
import workspaceProductService from "../features/workspace-products/services/workspaceProductService";

const HEADER_ALIASES = {
  name: ["name", "productname", "product", "itemname", "item", "title", "particulars", "description", "medicinename", "brandname"],
  productType: ["producttype", "type", "classification", "categorytype"],
  pack: ["pack", "package", "packaging", "packagingdetail", "packing", "unit"],
  mrp: ["mrp", "maximumretailprice"],
  ptr: ["ptr", "costprice", "purcprice", "purchaseprice", "cost"],
  rateA: ["ratea", "rate", "sellingprice", "price", "rate1", "salerate"],
  rateB: ["rateb"],
  rateC: ["ratec"],
  batchNo: ["batchno", "batch", "batchnumber", "lotno", "lotnumber", "lot"],
  expiryDate: ["expiry", "expirydate", "expdate", "exp"],
  batchQty: ["qty", "quantity", "batchqty", "stock", "stockqty", "balance", "currentstock", "openingstock"],
  rack: ["rack", "rackno", "location", "shelf", "bin"],
  marketer: ["marketer", "brand", "company", "manufacturer", "mfg"],
  itemCode: ["itemcode", "code"],
  batchScheme: ["batchscheme", "deal"],
  freeFromPurchase: ["freefrompurchase", "free"],
  notes: ["notes", "remark", "remarks", "invno"],
};

const cleanHeaderKey = (h) => String(h || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const normalizeHeaderName = (header) => {
  const clean = cleanHeaderKey(header);
  for (const [canonicalKey, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(clean)) {
      return canonicalKey;
    }
  }
  return String(header || "").trim();
};

const getRowVal = (row, canonicalField) => {
  if (!row) return "";

  // Prioritize explicit exact key match or Company / Manufacturer for marketer
  if (canonicalField === "marketer") {
    for (const key of Object.keys(row)) {
      const cleanKey = cleanHeaderKey(key);
      if (["company", "manufacturer", "marketer", "brand", "mfg"].includes(cleanKey)) {
        const val = row[key];
        if (val !== undefined && val !== null && String(val).trim() !== "") {
          return String(val).trim();
        }
      }
    }
  }

  if (row[canonicalField] !== undefined && String(row[canonicalField]).trim() !== "") {
    return String(row[canonicalField]).trim();
  }

  const aliases = HEADER_ALIASES[canonicalField] || [canonicalField];
  for (const key of Object.keys(row)) {
    const cleanKey = cleanHeaderKey(key);
    if (aliases.some((alias) => cleanKey === alias || cleanKey.includes(alias))) {
      const val = row[key];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        return String(val).trim();
      }
    }
  }
  return "";
};

const detectDelimiter = (firstLine) => {
  if (firstLine.includes("\t")) return "\t";
  if (firstLine.includes(";")) return ";";
  return ",";
};

const ALL_HEADER_ALIASES_FLAT = Object.values(HEADER_ALIASES).flat();

const findBestHeaderRowIndex = (rowsMatrix) => {
  let bestIdx = 0;
  let maxMatches = 0;

  for (let r = 0; r < Math.min(rowsMatrix.length, 25); r++) {
    const rowCells = rowsMatrix[r];
    if (!Array.isArray(rowCells)) continue;

    let matchCount = 0;
    rowCells.forEach((cell) => {
      const clean = cleanHeaderKey(cell);
      if (clean && ALL_HEADER_ALIASES_FLAT.some((alias) => clean === alias || clean.includes(alias))) {
        matchCount++;
      }
    });

    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestIdx = r;
    }
  }

  return bestIdx;
};

const parseMatrixWithMergedHeaders = (matrix) => {
  const headerIdx = findBestHeaderRowIndex(matrix);
  const header1 = matrix[headerIdx] || [];
  const header2 = matrix[headerIdx + 1] || [];

  let lastMainHeader = "";
  const maxCols = Math.max(header1.length, header2.length);
  const rawHeaders = [];

  for (let i = 0; i < maxCols; i++) {
    if (header1[i] && String(header1[i]).trim()) {
      lastMainHeader = String(header1[i]).trim();
    }
    const h1 = lastMainHeader;
    const h2 = String(header2[i] || "").trim();
    rawHeaders[i] = h2 ? `${h1} ${h2}` : h1;
  }

  const normalizedHeaders = rawHeaders.map(normalizeHeaderName);
  const isSecondRowSubHeader = header2.some((cell) => {
    const clean = cleanHeaderKey(cell);
    return clean === "deal" || clean === "free";
  });

  const startRow = isSecondRowSubHeader ? headerIdx + 2 : headerIdx + 1;
  const dataRows = [];

  for (let r = startRow; r < matrix.length; r++) {
    const rowCells = matrix[r];
    if (!Array.isArray(rowCells) || rowCells.every((c) => String(c || "").trim() === "")) {
      continue;
    }

    const rowObj = {};
    normalizedHeaders.forEach((canonicalKey, cIdx) => {
      const val = rowCells[cIdx] !== undefined ? String(rowCells[cIdx]).trim() : "";
      if (canonicalKey) {
        rowObj[canonicalKey] = val;
      }
      if (rawHeaders[cIdx]) {
        rowObj[rawHeaders[cIdx]] = val;
      }
    });

    // Auto-calculate fallback Rate A / B / C if missing (matching legacy rules)
    const mrp = Number(getRowVal(rowObj, "mrp")) || 0;
    const ptr = Number(getRowVal(rowObj, "ptr")) || 0;

    let rateB = Number(getRowVal(rowObj, "rateB")) || 0;
    if (rateB <= 0) {
      if (mrp > 0) {
        rateB = Number(((mrp / 1.05) * 0.80).toFixed(2));
      } else {
        rateB = ptr;
      }
      rowObj.rateB = rateB;
    }

    let rateA = Number(getRowVal(rowObj, "rateA")) || 0;
    if (rateA <= 0) {
      if (rateB > 0) {
        rateA = Number((rateB * 0.90).toFixed(2));
      } else {
        rateA = ptr;
      }
      rowObj.rateA = rateA;
    }

    let rateC = Number(getRowVal(rowObj, "rateC")) || 0;
    if (rateC <= 0 && mrp > 0) {
      rateC = Number((mrp * 0.84).toFixed(2));
      rowObj.rateC = rateC;
    }

    if (getRowVal(rowObj, "name") || getRowVal(rowObj, "batchNo")) {
      dataRows.push(rowObj);
    }
  }
  return dataRows;
};

const parseCSVText = (text) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const matrix = lines.map((line) => {
    const delimiter = detectDelimiter(lines[0]);
    if (delimiter === "\t") {
      return line.split("\t").map((v) => v.trim().replace(/^["']|["']$/g, ""));
    }
    const values = [];
    let insideQuote = false;
    let currentValue = "";
    for (let char of line) {
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === delimiter && !insideQuote) {
        values.push(currentValue.trim().replace(/^["']|["']$/g, ""));
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^["']|["']$/g, ""));
    return values;
  });

  return parseMatrixWithMergedHeaders(matrix);
};

const STEPS = ["Upload File", "Match Brands", "Process Products", "Finish"];

const UploadExistingInventoryBtn = ({
  variant = "outlined",
  colorVariant = "neutral",
  size = "small",
  children = "Upload Existing Inventory",
  className = "",
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [importResult, setImportResult] = useState(null);

  // Pagination for Step 2 & Step 3
  const [brandPage, setBrandPage] = useState(0);
  const [brandRowsPerPage, setBrandRowsPerPage] = useState(15);

  const [previewPage, setPreviewPage] = useState(0);
  const [previewRowsPerPage, setPreviewRowsPerPage] = useState(25);

  const handleOpen = () => {
    setIsOpen(true);
    setActiveStep(0);
    setFile(null);
    setParsedRows([]);
    setParseError(null);
    setSubmitError(null);
    setImportResult(null);
    setBrandPage(0);
    setPreviewPage(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Process File
  const handleFileProcess = useCallback((selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setParseError(null);

    const fileNameLower = selectedFile.name.toLowerCase();
    const isExcel = fileNameLower.endsWith(".xls") || fileNameLower.endsWith(".xlsx");

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const matrix = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
          if (!matrix || matrix.length === 0) {
            throw new Error("No data rows found in the selected Excel sheet");
          }

          const normalizedRows = parseMatrixWithMergedHeaders(matrix);

          if (normalizedRows.length === 0) {
            throw new Error("No valid product or stock data rows found in the file");
          }

          setParsedRows(normalizedRows);
        } catch (err) {
          setParseError(err.message || "Failed to parse Excel file");
          setParsedRows([]);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let rows = [];

          if (fileNameLower.endsWith(".json")) {
            const parsed = JSON.parse(content);
            if (!Array.isArray(parsed)) {
              throw new Error("JSON import must be an array of product objects");
            }
            rows = parsed.map((row) => {
              const newObj = {};
              Object.keys(row).forEach((key) => {
                const canonicalKey = normalizeHeaderName(key);
                const val = row[key] !== undefined ? String(row[key]).trim() : "";
                newObj[canonicalKey] = val;
                newObj[key] = val;
              });
              return newObj;
            });
          } else {
            rows = parseCSVText(content);
          }

          if (rows.length === 0) {
            throw new Error("No data rows found in the selected file");
          }

          setParsedRows(rows);
        } catch (err) {
          setParseError(err.message || "Failed to parse file");
          setParsedRows([]);
        }
      };
      reader.readAsText(selectedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Step 2: Unique Brand Mappings
  const brandMappings = useMemo(() => {
    const brandMap = new Map();
    parsedRows.forEach((row) => {
      const originalBrand = getRowVal(row, "marketer");
      if (originalBrand && !brandMap.has(originalBrand)) {
        brandMap.set(originalBrand, originalBrand); // matched default
      }
    });
    return Array.from(brandMap.entries()).map(([original, matched]) => ({
      original,
      matched,
    }));
  }, [parsedRows]);

  const [tempImportId, setTempImportId] = useState(null);
  const [serverBrandMappings, setServerBrandMappings] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleUploadAndDetect = async () => {
    if (!file) {
      setParseError("Please select an XLSX or CSV file to detect");
      return;
    }

    setIsDetecting(true);
    setParseError(null);

    try {
      const response = await workspaceProductService.detectInventoryProducts(file);
      const data = response?.data?.data || response?.data || response;

      if (data?.tempImportId) {
        setTempImportId(data.tempImportId);
      }
      if (data?.brandMappings) {
        setServerBrandMappings(data.brandMappings);
      }
      if (data?.productPreview && data.productPreview.length > 0) {
        setParsedRows(data.productPreview);
      }

      setBrandPage(0);
      setPreviewPage(0);
      setActiveStep(1);
    } catch (err) {
      setParseError(err?.response?.data?.message || err?.message || "Failed to detect file on backend");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      handleUploadAndDetect();
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBackStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  // Step 3 -> Execute Bulk Import
  const handleStartImport = async () => {
    if (!file && parsedRows.length === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let response;
      if (file) {
        // Send file directly to backend for parsing & database processing
        const formData = new FormData();
        formData.append("file", file);
        response = await workspaceProductService.importWorkspaceProducts(formData);
      } else {
        const mappedItems = parsedRows.map((row) => ({
          name: getRowVal(row, "name"),
          productType: getRowVal(row, "productType") || "medicine",
          pack: getRowVal(row, "pack"),
          mrp: getRowVal(row, "mrp"),
          ptr: getRowVal(row, "ptr"),
          rateA: getRowVal(row, "rateA"),
          rateB: getRowVal(row, "rateB"),
          rateC: getRowVal(row, "rateC"),
          batchNo: getRowVal(row, "batchNo"),
          expiryDate: getRowVal(row, "expiryDate"),
          batchQty: getRowVal(row, "batchQty"),
          rack: getRowVal(row, "rack"),
          marketer: getRowVal(row, "marketer"),
          itemCode: getRowVal(row, "itemCode"),
          batchScheme: getRowVal(row, "batchScheme"),
          freeFromPurchase: getRowVal(row, "freeFromPurchase"),
          notes: getRowVal(row, "notes"),
        }));

        response = await workspaceProductService.importWorkspaceProducts({
          items: mappedItems,
        });
      }

      const resultData = response?.data?.data || response?.data || response;
      setImportResult(resultData);
      setActiveStep(3);
      if (onSuccess) onSuccess(resultData);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || "Failed to submit product import");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 & 3 Pagination Calculations
  const paginatedBrandMappings = useMemo(() => {
    const start = brandPage * brandRowsPerPage;
    return brandMappings.slice(start, start + brandRowsPerPage);
  }, [brandMappings, brandPage, brandRowsPerPage]);

  const paginatedPreviewRows = useMemo(() => {
    const start = previewPage * previewRowsPerPage;
    return parsedRows.slice(start, start + previewRowsPerPage);
  }, [parsedRows, previewPage, previewRowsPerPage]);

  return (
    <>
      <AppButton
        type="button"
        variant={variant}
        colorVariant={colorVariant}
        size={size}
        startIcon={<FiUploadCloud />}
        onClick={handleOpen}
        className={className}
      >
        {children}
      </AppButton>

      {/* Modal Dialog */}
      <UIModal isOpen={isOpen} onClose={handleClose} size="3xl" closeOnBackdrop={false}>
          <div className="w-full flex flex-col h-full max-h-[85vh]">
            <UIModalHeader className="pb-4">
              <UIModalTitle>Upload Existing Inventory</UIModalTitle>
              <UIModalDescription>
                Bulk import legacy product catalog, batch stock, and pricing into Pahuch 2.0
              </UIModalDescription>
            </UIModalHeader>

            {/* Stepper Bar */}
            <div className="px-6 py-3 bg-surface border-b border-border/50 flex items-center justify-between">
              {STEPS.map((label, idx) => {
                const isActive = activeStep === idx;
                const isCompleted = activeStep > idx;

                return (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isActive
                            ? "bg-primary-600 text-white shadow-sm"
                            : "bg-surface-alt text-text-muted"
                        }`}
                      >
                        {isCompleted ? <FiCheck /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isActive ? "text-text font-semibold" : "text-text-muted"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="flex-1 mx-3 h-0.5 bg-surface-hover" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* STEP 0: Upload File */}
              {activeStep === 0 && (
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-border hover:border-primary-500 rounded-xl p-8 text-center bg-surface-alt/50 transition-all cursor-pointer"
                    onClick={() => document.getElementById("legacy-btn-file-input").click()}
                  >
                    <input
                      id="legacy-btn-file-input"
                      type="file"
                      accept=".xls,.xlsx,.csv,.json"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl mx-auto mb-3">
                      <FiUploadCloud />
                    </div>
                    <AppHeading level={4} className="text-base font-semibold text-text">
                      Upload XLSX or CSV File
                    </AppHeading>
                    <AppText className="text-xs text-text-muted mt-1">
                      Contains Name, Brand, Qty, MRP, PTR, Rate A, Batch No & Expiry Date
                    </AppText>
                  </div>

                  {file && (
                    <AppStack className="flex-row items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <AppStack className="flex-row items-center gap-3">
                        <FiFileText className="text-primary-600 text-xl" />
                        <div>
                          <AppText className="font-semibold text-xs text-text">{file.name}</AppText>
                          <AppText className="text-xs text-text-muted">
                            {(file.size / 1024).toFixed(1)} KB • {parsedRows.length} rows detected
                          </AppText>
                        </div>
                      </AppStack>
                      <AppIconButton
                        onClick={() => {
                          setFile(null);
                          setParsedRows([]);
                        }}
                      >
                        <FiX className="text-text-muted hover:text-red-600" />
                      </AppIconButton>
                    </AppStack>
                  )}

                  {parseError && (
                    <AppAlert severity="error" icon={<FiAlertCircle />}>
                      {parseError}
                    </AppAlert>
                  )}
                </div>
              )}

              {/* STEP 1: Match Brands */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <AppHeading level={4} className="text-sm font-bold text-text">
                        Review Brand & Manufacturer Mapping
                      </AppHeading>
                      <AppText className="text-xs text-text-muted">
                        Total {brandMappings.length} unique marketers detected from file
                      </AppText>
                    </div>
                  </div>

                  <div className="border border-border rounded-xl overflow-hidden bg-surface">
                    <div className="bg-surface-alt px-4 py-2 flex text-xs font-semibold text-text uppercase border-b border-border">
                      <span className="w-1/2">Original File Brand</span>
                      <span className="w-1/2">Matched System Brand</span>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                      {paginatedBrandMappings.length === 0 ? (
                        <div className="p-4 text-center text-xs text-text-muted">
                          No brand mappings found.
                        </div>
                      ) : (
                        paginatedBrandMappings.map((row, idx) => (
                          <div key={idx} className="px-4 py-2.5 flex items-center text-xs hover:bg-surface-alt">
                            <span className="w-1/2 font-medium text-text">{row.original || "-"}</span>
                            <span className="w-1/2 text-text-muted font-mono bg-surface-alt px-2 py-1 rounded border border-border">
                              {row.matched || "-"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    {/* Pagination Footer */}
                    <div className="bg-surface-alt px-4 py-2 flex items-center justify-between border-t border-border text-xs text-text-muted">
                      <span>
                        Showing {brandPage * brandRowsPerPage + 1} -{" "}
                        {Math.min((brandPage + 1) * brandRowsPerPage, brandMappings.length)} of{" "}
                        {brandMappings.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <AppButton
                          size="xs"
                          variant="outline"
                          disabled={brandPage === 0}
                          onClick={() => setBrandPage((p) => p - 1)}
                        >
                          Prev
                        </AppButton>
                        <AppButton
                          size="xs"
                          variant="outline"
                          disabled={(brandPage + 1) * brandRowsPerPage >= brandMappings.length}
                          onClick={() => setBrandPage((p) => p + 1)}
                        >
                          Next
                        </AppButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Process Products / Preview */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <AppHeading level={4} className="text-sm font-bold text-text">
                        Preview Inventory Rows ({parsedRows.length} Items)
                      </AppHeading>
                      <AppText className="text-xs text-text-muted">
                        Review products, batches, stock & rates before import
                      </AppText>
                    </div>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                      ⚡ Paginated Preview Enabled
                    </span>
                  </div>

                  {submitError && (
                    <AppAlert severity="error" icon={<FiAlertCircle />}>
                      {submitError}
                    </AppAlert>
                  )}

                  <div className="border border-border rounded-xl overflow-hidden bg-surface">
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto p-3 space-y-2">
                      {paginatedPreviewRows.map((p, idx) => {
                        const name = p?.name || getRowVal(p, "name") || "-";
                        const marketer = p?.marketer || getRowVal(p, "marketer") || "-";
                        const pack = p?.pack || getRowVal(p, "pack") || "";
                        const qty = p?.qty ?? p?.batchQty ?? getRowVal(p, "batchQty") ?? 0;
                        const mrp = p?.mrp ?? getRowVal(p, "mrp") ?? 0;
                        const batchNo = p?.batchNo || getRowVal(p, "batchNo") || "-";
                        const expiryDate = p?.expiryDate || getRowVal(p, "expiryDate") || "-";

                        const rateB = p?.rateB ?? getRowVal(p, "rateB") ?? 0;
                        const rateA = p?.rateA && Number(p?.rateA) !== Number(p?.ptr) ? p.rateA : Number((rateB * 0.90).toFixed(2));
                        const rateC = p?.rateC ?? getRowVal(p, "rateC") ?? 0;

                        const batchScheme = Number(p?.batchScheme || getRowVal(p, "batchScheme")) || 0;
                        const freeFromPurchase = Number(p?.freeFromPurchase || getRowVal(p, "freeFromPurchase")) || 0;
                        const totalScheme = batchScheme + freeFromPurchase;
                        const schemePercent = totalScheme > 0 ? ((freeFromPurchase / totalScheme) * 100).toFixed(2) : "0.00";

                        return (
                          <div key={idx} className="p-3 bg-surface-alt/50 hover:bg-surface-alt/60 rounded-lg border border-border/50 space-y-1 transition-all">
                            <div className="font-bold text-text text-xs">
                              {name} {pack ? `| ${pack}` : ""} <span className="font-semibold text-text-muted">| {marketer}</span>
                            </div>
                            <div className="text-xs text-text-muted flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5">
                              <span><strong>Qty:</strong> {qty}</span>
                              <span>|</span>
                              <span><strong>MRP:</strong> ₹{mrp}</span>
                              <span>|</span>
                              <span><strong>Batch:</strong> {batchNo}</span>
                              <span>|</span>
                              <span><strong>Exp:</strong> {expiryDate}</span>
                              <span>|</span>
                              <span><strong>Rate A :</strong> {rateA}</span>
                              <span>|</span>
                              <span><strong>Rate B :</strong> {rateB}</span>
                              <span>|</span>
                              <span><strong>Rate C :</strong> {rateC}</span>
                              <span>|</span>
                              <span><strong>Scheme:</strong> {schemePercent}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination Footer */}
                    <div className="bg-surface-alt px-4 py-2 flex items-center justify-between border-t border-border text-xs text-text-muted">
                      <span>
                        Showing {previewPage * previewRowsPerPage + 1} -{" "}
                        {Math.min((previewPage + 1) * previewRowsPerPage, parsedRows.length)} of{" "}
                        {parsedRows.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <AppButton
                          size="xs"
                          variant="outline"
                          disabled={previewPage === 0}
                          onClick={() => setPreviewPage((p) => p - 1)}
                        >
                          Prev
                        </AppButton>
                        <AppButton
                          size="xs"
                          variant="outline"
                          disabled={(previewPage + 1) * previewRowsPerPage >= parsedRows.length}
                          onClick={() => setPreviewPage((p) => p + 1)}
                        >
                          Next
                        </AppButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Finish */}
              {activeStep === 3 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <AppHeading level={3} className="text-xl font-bold text-text">
                      Import Completed 🎉
                    </AppHeading>
                    <AppText className="text-xs text-text-muted mt-1">
                      Inventory products and stock batches have been updated in database
                    </AppText>
                  </div>

                  {importResult && (
                    <div className="grid grid-cols-3 gap-3 bg-surface-alt p-4 rounded-xl border border-border max-w-lg mx-auto text-left">
                      <div className="bg-surface p-3 rounded-lg border border-border/50 shadow-2xs">
                        <AppText className="text-xl font-bold text-emerald-600">
                          {importResult.createdCount || 0}
                        </AppText>
                        <AppText className="text-[11px] text-text-muted">New Products</AppText>
                      </div>
                      <div className="bg-surface p-3 rounded-lg border border-border/50 shadow-2xs">
                        <AppText className="text-xl font-bold text-blue-600">
                          {importResult.updatedCount || 0}
                        </AppText>
                        <AppText className="text-[11px] text-text-muted">Updated Stock</AppText>
                      </div>
                      <div className="bg-surface p-3 rounded-lg border border-border/50 shadow-2xs">
                        <AppText className="text-xl font-bold text-amber-600">
                          {importResult.skippedCount || 0}
                        </AppText>
                        <AppText className="text-[11px] text-text-muted">Skipped</AppText>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <UIModalFooter className="flex items-center justify-between w-full">
              <AppButton variant="outline" size="sm" onClick={handleClose}>
                {activeStep === 3 ? "Close" : "Cancel"}
              </AppButton>

              <AppStack className="flex-row items-center gap-2">
                {activeStep > 0 && activeStep < 3 && (
                  <AppButton variant="outline" size="sm" onClick={handleBackStep}>
                    Back
                  </AppButton>
                )}

                {activeStep < 2 && (
                  <AppButton
                    variant="contained"
                    size="sm"
                    onClick={handleNextStep}
                    loading={isDetecting}
                    disabled={activeStep === 0 && (!file || isDetecting)}
                    className="bg-primary-600 text-white"
                  >
                    {isDetecting ? "Detecting..." : "Next"}
                  </AppButton>
                )}

                {activeStep === 2 && (
                  <AppButton
                    variant="contained"
                    size="sm"
                    onClick={handleStartImport}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <FiRefreshCw className="animate-spin" /> Importing...
                      </span>
                    ) : (
                      "Start Ultra Import"
                    )}
                  </AppButton>
                )}

                {activeStep === 3 && (
                  <AppButton
                    variant="contained"
                    size="sm"
                    onClick={handleClose}
                    className="bg-emerald-600 text-white px-6"
                  >
                    Done
                  </AppButton>
                )}
              </AppStack>
            </UIModalFooter>
          </div>
      </UIModal>
    </>
  );
};

export default UploadExistingInventoryBtn;
