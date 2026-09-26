# Customer Details Lazy-Loading Design

## Overview
Optimize the `CustomerDetailsPage` component by lazy-loading heavy API calls. Currently, the component fetches all customer data (Core Details, Outstanding, Sales, Payments, Ledger) on mount, leading to excessive network requests and slower load times.

## Approach
1. **Initial Load (Mount)**: Fetch only the data strictly required for the page shell and overview tab:
   - `getCustomerById` (Core customer details)
   - `getCustomerOutstanding` (Financial balances for the header)

2. **Lazy Load (Tab Switch)**: Fetch tab-specific data only when the user navigates to the respective tab:
   - When `currentTab === "transactions"` -> Fetch `getCustomerSales`
   - When `currentTab === "statement"` -> Fetch `getCustomerLedger`

3. **State Management**:
   - Track fetching status (e.g., using a ref or checking if the data array is empty/null) to ensure API calls are not re-triggered unnecessarily if the user switches back and forth between tabs.
   - Retain the cleanup function to clear all Redux state when the component unmounts.

## Affected Files
- `src/features/parties/customers/pages/CustomerDetailsPage.jsx`: The main container component where the `fetchCustomer` logic resides.
