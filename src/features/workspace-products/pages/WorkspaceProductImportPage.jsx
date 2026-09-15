import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiTrash2,
  FiLayers,
  FiBox,
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
  AppStatusBadge,
  AppIconButton,
} from "@/components";
import workspaceProductService from "../services/workspaceProductService";

const SAMPLE_CSV_HEADER = "name,productType,pack,mrp,ptr,rateA,batchNo,expiryDate,batchQty,marketer,rack,notes\n";
const SAMPLE_CSV_ROW = 'Paracetamol 500mg,medicine,10x10,35,22.5,24,BATCH001,2028-12-31,100,Cipla,RACK-A1,Opening Stock Import\nAmoxicillin 250mg,medicine,1x10,75,48,50,BATCH002,2027-06-30,50,Sun Pharma,RACK-B2,Bulk Import';

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

const parseCSVText = (text) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  // Parse into 2D matrix
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

  const headerIdx = findBestHeaderRowIndex(matrix);
  const rawHeaders = (matrix[headerIdx] || []).map((h) => String(h || "").trim());
  const normalizedHeaders = rawHeaders.map(normalizeHeaderName);

  const dataRows = [];
  for (let r = headerIdx + 1; r < matrix.length; r++) {
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

    if (getRowVal(rowObj, "name") || getRowVal(rowObj, "batchNo")) {
      dataRows.push(rowObj);
    }
  }
  return dataRows;
};

const WorkspaceProductImportPage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [parseError, setParseError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // File Drop / Selection handler supporting .xls, .xlsx, .csv, and .json
  const handleFileProcess = useCallback((selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setParseError(null);
    setImportResult(null);
    setSubmitError(null);

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

          const headerIdx = findBestHeaderRowIndex(matrix);
          const rawHeaders = (matrix[headerIdx] || []).map((h) => String(h || "").trim());
          const normalizedHeaders = rawHeaders.map(normalizeHeaderName);

          const normalizedRows = [];
          for (let r = headerIdx + 1; r < matrix.length; r++) {
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

            if (getRowVal(rowObj, "name") || getRowVal(rowObj, "batchNo")) {
              normalizedRows.push(rowObj);
            }
          }

          if (normalizedRows.length === 0) {
            throw new Error("No valid product or stock data rows found in the file");
          }

          setParsedData(normalizedRows);
        } catch (err) {
          setParseError(err.message || "Failed to parse Excel file");
          setParsedData([]);
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

          setParsedData(rows);
        } catch (err) {
          setParseError(err.message || "Failed to parse file");
          setParsedData([]);
        }
      };
      reader.readAsText(selectedFile);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const downloadSampleTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_HEADER + SAMPLE_CSV_ROW], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pahuch_inventory_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearFile = () => {
    setFile(null);
    setParsedData([]);
    setParseError(null);
    setImportResult(null);
    setSubmitError(null);
  };

  const handleSubmitImport = async () => {
    if (!file && parsedData.length === 0) return;

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
        const mappedItems = parsedData.map((row) => ({
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
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || "Failed to submit product import");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppBox className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header Navigation */}
      <AppStack className="flex-row items-center justify-between border-b border-gray-200 pb-4">
        <AppStack className="flex-row items-center gap-3">
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/workspace-products")}
            startIcon={<FiArrowLeft />}
          >
            Back to Products
          </AppButton>
          <div>
            <AppHeading level={3} className="text-xl font-bold text-gray-900">
              Import Existing Inventory
            </AppHeading>
            <AppText className="text-sm text-gray-500">
              Bulk import legacy products, batch details, pricing, and initial stock into Pahuch 2.0
            </AppText>
          </div>
        </AppStack>

        <AppButton
          variant="outline"
          size="sm"
          onClick={downloadSampleTemplate}
          startIcon={<FiDownload />}
          className="text-primary-600 border-primary-200 hover:bg-primary-50"
        >
          Download CSV Template
        </AppButton>
      </AppStack>

      {/* Main Upload & Preview Cards */}
      {!importResult ? (
        <AppStack className="space-y-6">
          {/* File Upload Dropzone Card */}
          <AppCard className="p-6">
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-primary-500 bg-primary-50/50 scale-[0.99]"
                    : "border-gray-300 hover:border-primary-400 bg-gray-50/50"
                }`}
                onClick={() => document.getElementById("inventory-import-file-input").click()}
              >
                <input
                  id="inventory-import-file-input"
                  type="file"
                  accept=".xls,.xlsx,.csv,.json"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl shadow-sm">
                    <FiUploadCloud />
                  </div>
                </div>
                <AppHeading level={4} className="text-base font-semibold text-gray-800">
                  Drag and drop your Excel (.xls, .xlsx) or CSV file here
                </AppHeading>
                <AppText className="text-sm text-gray-500 mt-1">
                  Supports Excel spreadsheets, legacy product exports, and batch lists (.xls, .xlsx, .csv, .json)
                </AppText>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  <FiFileText className="text-gray-400" />
                  Browse File
                </div>
              </div>
            ) : (
              <AppStack className="flex-row items-center justify-between p-4 bg-primary-50/60 border border-primary-200 rounded-xl">
                <AppStack className="flex-row items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xl">
                    <FiFileText />
                  </div>
                  <div>
                    <AppText className="font-semibold text-gray-900">{file.name}</AppText>
                    <AppText className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {parsedData.length} records detected
                    </AppText>
                  </div>
                </AppStack>
                <AppIconButton
                  onClick={handleClearFile}
                  title="Remove file"
                  className="text-gray-400 hover:text-red-600"
                >
                  <FiTrash2 />
                </AppIconButton>
              </AppStack>
            )}

            {parseError && (
              <AppAlert severity="error" className="mt-4" icon={<FiAlertCircle />}>
                {parseError}
              </AppAlert>
            )}
          </AppCard>

          {/* Parsed Data Preview Table */}
          {parsedData.length > 0 && (
            <AppCard className="p-6 space-y-4">
              <AppStack className="flex-row items-center justify-between">
                <div>
                  <AppHeading level={4} className="text-base font-bold text-gray-900">
                    Data Preview & Verification ({parsedData.length} Items)
                  </AppHeading>
                  <AppText className="text-xs text-gray-500">
                    Review row attributes before executing database bulk import
                  </AppText>
                </div>
                <AppButton
                  variant="contained"
                  onClick={handleSubmitImport}
                  loading={isSubmitting}
                  startIcon={<FiCheckCircle />}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6"
                >
                  Import {parsedData.length} Items Now
                </AppButton>
              </AppStack>

              {submitError && (
                <AppAlert severity="error" icon={<FiAlertCircle />}>
                  {submitError}
                </AppAlert>
              )}

              {/* Data Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Pack</th>
                      <th className="p-3">MRP</th>
                      <th className="p-3">PTR</th>
                      <th className="p-3">Rate A</th>
                      <th className="p-3">Batch No</th>
                      <th className="p-3">Expiry</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Rack</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {parsedData.slice(0, 50).map((row, idx) => {
                      const name = getRowVal(row, "name");
                      const productType = getRowVal(row, "productType") || "medicine";
                      const pack = getRowVal(row, "pack");
                      const mrp = getRowVal(row, "mrp");
                      const ptr = getRowVal(row, "ptr");
                      const rateA = getRowVal(row, "rateA");
                      const batchNo = getRowVal(row, "batchNo");
                      const expiryDate = getRowVal(row, "expiryDate");
                      const batchQty = getRowVal(row, "batchQty");
                      const rack = getRowVal(row, "rack");

                      return (
                        <tr key={idx} className="hover:bg-gray-50/80">
                          <td className="p-3 font-mono text-gray-400">{idx + 1}</td>
                          <td className="p-3 font-semibold text-gray-900">{name || "-"}</td>
                          <td className="p-3 capitalize">{productType}</td>
                          <td className="p-3">{pack || "-"}</td>
                          <td className="p-3">{mrp ? `₹${mrp}` : "-"}</td>
                          <td className="p-3">{ptr ? `₹${ptr}` : "-"}</td>
                          <td className="p-3">{rateA ? `₹${rateA}` : "-"}</td>
                          <td className="p-3 font-mono text-xs">{batchNo || "-"}</td>
                          <td className="p-3 text-gray-500">{expiryDate || "-"}</td>
                          <td className="p-3 font-semibold text-primary-700">{batchQty || 0}</td>
                          <td className="p-3 text-gray-500">{rack || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 50 && (
                <AppText className="text-xs text-gray-400 text-center">
                  Showing first 50 rows of {parsedData.length} records. All rows will be imported.
                </AppText>
              )}
            </AppCard>
          )}
        </AppStack>
      ) : (
        /* Import Summary Success View */
        <AppCard className="p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-sm">
            <FiCheckCircle />
          </div>
          <div>
            <AppHeading level={3} className="text-2xl font-bold text-gray-900">
              Inventory Import Completed!
            </AppHeading>
            <AppText className="text-sm text-gray-500 mt-1">
              Your legacy product catalog and stock details have been processed in Pahuch 2.0
            </AppText>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-2xs">
              <AppText className="text-2xl font-extrabold text-emerald-600">
                {importResult.createdCount || 0}
              </AppText>
              <AppText className="text-xs text-gray-500 font-medium">New Products</AppText>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-2xs">
              <AppText className="text-2xl font-extrabold text-blue-600">
                {importResult.updatedCount || 0}
              </AppText>
              <AppText className="text-xs text-gray-500 font-medium">Updated Stock</AppText>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-2xs">
              <AppText className="text-2xl font-extrabold text-amber-600">
                {importResult.skippedCount || 0}
              </AppText>
              <AppText className="text-xs text-gray-500 font-medium">Skipped / Failed</AppText>
            </div>
          </div>

          {importResult.failedRows && importResult.failedRows.length > 0 && (
            <div className="text-left bg-red-50 p-4 rounded-lg border border-red-200 space-y-2">
              <AppText className="font-semibold text-xs text-red-800 uppercase tracking-wide">
                Row Failures ({importResult.failedRows.length})
              </AppText>
              <ul className="text-xs text-red-700 space-y-1 max-h-32 overflow-y-auto">
                {importResult.failedRows.map((f, i) => (
                  <li key={i}>
                    Row {f.row}: {f.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AppStack className="flex-row items-center justify-center gap-4 pt-2">
            <AppButton
              variant="outline"
              onClick={handleClearFile}
              startIcon={<FiRefreshCw />}
            >
              Import Another File
            </AppButton>
            <AppButton
              variant="contained"
              onClick={() => navigate("/workspace-products")}
              startIcon={<FiBox />}
              className="bg-primary-600 text-white"
            >
              View Products List
            </AppButton>
          </AppStack>
        </AppCard>
      )}
    </AppBox>
  );
};

export default WorkspaceProductImportPage;
