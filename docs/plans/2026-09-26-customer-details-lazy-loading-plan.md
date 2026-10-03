# Customer Details Lazy-Loading Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Lazy load the heavy API calls in CustomerDetailsPage so they only fire when their respective tabs are activated.

**Architecture:** Use React `useEffect` hooks coupled with the `currentTab` search param to trigger API calls on demand, while maintaining a single `hasFetchedRef` for the core details.

**Tech Stack:** React, React Router, Redux Thunks

---

### Task 1: Refactor CustomerDetailsPage.jsx

**Files:**
- Modify: `src/features/parties/customers/pages/CustomerDetailsPage.jsx:47-85`
- Modify: `src/features/parties/customers/pages/CustomerDetailsPage.jsx:87-100`

**Step 1: Remove heavy API calls from initial fetchCustomer**

Modify `fetchCustomer` to only fetch core details and outstanding balances.

```javascript
  const fetchCustomer = useCallback(async () => {
    if (!customerId) return;
    try {
      await getCustomerById(customerId);
    } catch (e) {
      console.error("Error fetching core customer details:", e);
    }

    try {
      await getCustomerOutstanding(customerId);
    } catch (e) {
      console.error("Error fetching customer outstanding:", e);
    }
  }, [customerId, getCustomerById, getCustomerOutstanding]);
```

**Step 2: Add lazy-loading useEffects for Transactions and Statement tabs**

Add specific side-effects below the main `useEffect` to watch `currentTab` and conditionally fetch if data is missing.

```javascript
  // Lazy load transactions (Sales and Payments)
  useEffect(() => {
    if (currentTab === "transactions" && customerId && !sales?.totalCount && !payments?.totalCount) {
      getCustomerSales({ customerId, params: { page: 1, limit: 5 } }).catch(e => console.error(e));
      getCustomerPayments(customerId).catch(e => console.error(e));
    }
  }, [currentTab, customerId, getCustomerSales, getCustomerPayments, sales?.totalCount, payments?.totalCount]);

  // Lazy load statement/ledger
  useEffect(() => {
    if (currentTab === "statement" && customerId && !ledger?.entries?.length) {
      getCustomerLedger({ customerId, params: { page: 1, limit: 5 } }).catch(e => console.error(e));
    }
  }, [currentTab, customerId, getCustomerLedger, ledger?.entries?.length]);
```

**Step 3: Check build/lint (Run test to verify it passes)**

Run: `npm run lint` or visually inspect the React component behavior in the browser.
Expected: PASS

**Step 4: Commit**

```bash
git add src/features/parties/customers/pages/CustomerDetailsPage.jsx
git commit -m "perf: lazy load customer transactions and statement data"
```
