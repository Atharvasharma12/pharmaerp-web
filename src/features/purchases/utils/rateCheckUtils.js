const round2 = (value) =>
  Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;

export const calcPTR = (MRP, retailerMarginPercent, gstPercent) => {
  const MRPNum = Number(MRP || 0);
  const retailerMargin = Number(retailerMarginPercent || 0);
  const GST = Number(gstPercent || 0);

  const netAfterRetailMargin = MRPNum - (MRPNum * retailerMargin) / 100;
  const gstFactor = 1 + GST / 100;

  if (gstFactor <= 0) return 0;

  return round2(netAfterRetailMargin / gstFactor);
};

export const calcPTS = (PTR, stockistMarginPercent) => {
  const PTRNum = Number(PTR || 0);
  const stockistMargin = Number(stockistMarginPercent || 0);

  return round2(PTRNum - (PTRNum * stockistMargin) / 100);
};

export const calcRateC = (MRP, retailerMarginPercent) =>
  round2(Number(MRP || 0) * (1 - Number(retailerMarginPercent || 0) / 100));

export const money = (value, withSign = false) => {
  const num = Number(value || 0);
  const sign = withSign && num > 0 ? "+" : num < 0 ? "-" : "";
  return `${sign}₹${Math.abs(num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const pct = (value, withSign = false) => {
  const num = Number(value || 0);
  const sign = withSign && num > 0 ? "+" : num < 0 ? "-" : "";
  return `${sign}${Math.abs(num).toFixed(2)}%`;
};

export const TOLERANCE = {
  okMax: 10,
  warningMax: 25,
};

export const getStatus = (totalDiff) => {
  const abs = Math.abs(Number(totalDiff || 0));
  if (abs <= TOLERANCE.okMax) return "OK";
  if (abs <= TOLERANCE.warningMax) return "WARNING";
  return "HIGH";
};

export const computeRateCheckRow = (item, rateBasis = "PTS") => {
  const mrp = Number(item.MRP || item.mrp || 0);
  
  // In pahuch_2.0 cart, GST is stored directly in `item.gst`. Fallback to legacy fields if missing.
  let gst = Number(item.gst || 0);
  if (!gst) {
    const cgst = Number(item.CGSTRate || item.cgst || 0);
    const sgst = Number(item.SGSTRate || item.sgst || 0);
    const igst = Number(item.IGSTRate || item.igst || 0);
    gst = round2(cgst + sgst + igst);
  }
  
  // If editing, use the edited values from the item object if they exist, fallback to item defaults
  const retail = Number(item.retailerMarginPercent || 0);
  const stock = Number(item.stockistMarginPercent || 0);
  const qty = Number(item.quantity || item.qty || 0);
  const billRate = Number(item.rate || item.purchaseRate || 0);

  const pctSource = item.cRatePct ?? item.rateCPercentage;
  const rateCPct = pctSource !== undefined && pctSource !== null && pctSource !== "" ? Number(pctSource) : retail;
  const rateC = Number(item.rateC || 0) || calcRateC(mrp, rateCPct);
  const ptr = calcPTR(mrp, retail, gst);
  const pts = calcPTS(ptr, stock);

  const expectedPTS = pts;
  const expectedPTR = ptr;
  const expectedRate = rateBasis === "PTR" ? expectedPTR : expectedPTS;

  const billPTR = billRate;
  const billPTS = Number(item.billPts) || Number(item.billPTS) || calcPTS(billPTR, stock);

  const compareTo = rateBasis === "PTR" ? billRate : billPTS;
  const diffPerUnit = round2(expectedRate - compareTo);
  const diffPct = expectedRate ? round2((diffPerUnit / expectedRate) * 100) : 0;
  const totalDiff = round2(diffPerUnit * qty);
  const status = getStatus(totalDiff);

  const defaultRateB = billPTR > ptr ? billPTR : ptr;
  const defaultRateA = billPTS > pts ? billPTS : pts;
  const rateB = item.rateB ?? defaultRateB;
  const rateA = item.rateA ?? defaultRateA;
  
  const extraPct = expectedPTR > 0 && rateB > 0 ? Math.max(0, round2(((rateB - expectedPTR) / expectedPTR) * 100)) : 0;
  const rateAExtraPct = expectedPTS > 0 && rateA > 0 ? Math.max(0, round2(((rateA - expectedPTS) / expectedPTS) * 100)) : 0;

  return {
    ...item,
    mrp,
    gst,
    retail,
    stock,
    qty,
    billRate,
    rateC,
    rateB,
    rateA,
    ptr,
    pts,
    expectedRate,
    billPTR,
    billPTS,
    diffPerUnit,
    diffPct,
    totalDiff,
    status,
    expectedPTS,
    expectedPTR,
    extraPct,
    rateAExtraPct
  };
};

export const computeRateCheckRows = (items = [], rateBasis = "PTS") =>
  items.map((item) => computeRateCheckRow(item, rateBasis));

export const computeSummary = (rows = []) => {
  const items = rows.length;
  const ok = rows.filter((r) => r.status === "OK").length;
  const warning = rows.filter((r) => r.status === "WARNING").length;
  const high = rows.filter((r) => r.status === "HIGH").length;

  const totalDifference = round2(
    rows.reduce((sum, r) => sum + Number(r.totalDiff || 0), 0)
  );

  return { items, ok, warning, high, totalDifference };
};
