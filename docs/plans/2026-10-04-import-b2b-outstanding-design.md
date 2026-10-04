# Import B2B Outstanding Design

## Overview
This feature introduces a new import capability for "B2B Outstanding" invoices from MARG ERP Excel files. It replaces the separate import buttons with a unified import UI, parses the unique structure of the MARG ERP debtor report, and securely imports historical credit sale bills while preserving their original dates and outstanding amounts.

## Frontend UI
- **Import Button**: The existing "Import B2B" button in the `CustomersDesktopPage` will be replaced with an "Import" button.
- **ImportConfigModal**: A new small modal will open, containing:
  - Import Type Dropdown (`Import B2B`, `Import B2C`, `Import B2B Outstanding`).
  - File Selector.
  - Submit Button.
- **Preview Flow**:
  - Uploading the file calls the `/preview` backend endpoint with the file and `importType`.
  - For `b2b-outstanding`, a new `OutstandingImportPreviewModal` displays the parsed invoices, indicating valid/invalid rows and duplicates.
  - The user confirms, triggering the `/confirm` endpoint with the valid rows.

## Backend Architecture
### Routing & Controller
The `customer.controller.js` will route requests based on `importType` via a switch statement:
```javascript
switch (importType) {
  case "b2b": return importB2B(...);
  case "b2c": return importB2C(...);
  case "b2b-outstanding": return importB2BOutstanding(...);
}
```

### Outstanding Excel Parser (`parseB2BOutstandingExcel`)
- **Report Date**: Extracted from the header "DEBTORS OUTSTANDING AS ON [DATE]".
- **Customer Detection**: Reads row by row. Detects header row (`INVOICE`, `DATE`, `BILL AMT.`, etc.). The following non-empty row is treated as the customer name, combining split cells into a single string.
- **Invoice Extraction**: Extracts invoice rows until "TOTAL :" or the next customer header is encountered.
- **Normalization**: 
  - Dates (`25-08-26`) are converted to absolute dates based on the report date year (`2026-08-25`).
  - Invoice numbers are stripped of leading `*`.
  - Customer names are lowercased and stripped of extra spaces for accurate deduplication.
- **Validation**: Ensures all required fields (`invoiceNumber`, `invoiceDate`, `billAmount`, `balance`) exist. 
- **Duplicate Check**: Validates `organizationId + customerName + invoiceNumber` uniqueness against existing DB records.

### Database Insertion (Confirm Import)
- **Customer Management**: Finds an existing B2B customer using the normalized name or creates a new one.
- **Sale Bill Creation**:
  - Creates a new `SaleBill` marked as a credit sale (`paymentType = "credit"`).
  - Bill Amount = Original `billAmount`.
  - Outstanding = `BALANCE` column from the Excel sheet.
  - Ensures partial payments are accurately represented without altering the original bill total.

## Error Handling & Summary
- Invalid rows are flagged during the preview phase and excluded from the final insertion.
- Skipped rows and failed insertions will be part of the final summary alert.
