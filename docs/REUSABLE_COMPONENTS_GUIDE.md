# PharmaERP — Reusable UI Components Architecture & Motion Guide (v3.0)

> **Mandatory Blueprint for all current and future UI components across PharmaERP.**
> When starting a new task or chat to build or extend UI primitives, follow this specification strictly to maintain fluid 60fps spring animations, zero layout thrashing, responsive ergonomics, and strict design token consistency.
> 
> 📖 **Looking for full prop tables, types, and copy-paste code examples?** See the [Component Catalog & Props Reference](file:///c:/Users/Intel/Desktop/erp/erp-frontend/docs/COMPONENT_CATALOG.md).

---

## 1. Core Architecture Principles

1. **Dedicated UI Namespace**:
   - All generic reusable components reside directly in `src/components/ui/` with the `UI` prefix:
     ```
     src/components/ui/
     ├── UIButton.jsx
     ├── UIIconButton.jsx
     ├── UIInput.jsx
     ├── UISearchInput.jsx
     ├── UISelect.jsx
     ├── UIDatePicker.jsx
     ├── UICheckbox.jsx
     ├── UISwitch.jsx
     ├── UITabs.jsx
     ├── UICard.jsx
     ├── UITable.jsx       (Upcoming #11)
     ├── UIModal.jsx       (Upcoming #12)
     ├── UIDropdown.jsx    (Upcoming #13)
     ├── UIBadge.jsx       (Upcoming #14)
     └── UIPagination.jsx  (Upcoming #15)
     ```
2. **Zero Legacy `App*` Policy**:
   - Never import from legacy `@/components` or `App*` files (`AppButton`, `AppInput`, `AppCard`, etc.).
   - Only use fresh `UI*` primitives combined with Tailwind v4 theme tokens, Lucide icons, and Framer Motion.
3. **Unified Barrel Export**:
   - Every new component must be exported as both named and default export in `src/components/ui/index.js`:
     ```javascript
     export * from "./UIButton";
     export * from "./UIIconButton";
     ```
4. **Theme & CSS Variables**:
   - Components must consume semantic CSS variables defined in `src/theme/tokens.js` & `index.css`:
     - `--color-primary`, `--color-primary-hover`, `--color-primary-soft`, `--color-primary-contrast`
     - `--color-surface`, `--color-surface-alt`, `--color-surface-hover`, `--color-bg`
     - `--color-border`, `--color-border-strong`, `--color-text`, `--color-text-muted`
     - `--color-success`, `--color-warning`, `--color-error`, `--color-info`

---

## 2. Fluid Animation & Motion Standards

All interactive primitives must feel **instant, physical, and alive** using `framer-motion` spring physics:

### 2.1 Standard Spring Presets

| Motion Role | Spring Config | Use Cases |
|---|---|---|
| **Sliding Active Indicator** | `type: "spring", stiffness: 350, damping: 24, mass: 0.8` | `UITabs` gliding indicator, segmented toggles |
| **Switch Thumb Snap** | `type: "spring", stiffness: 650, damping: 36` | `UISwitch` toggle track & thumb movement |
| **Tactile Tap / Press** | `whileTap={{ scale: 0.96 }}` | `UIButton`, `UIIconButton`, tab buttons, checkboxes |
| **Pop / Scale In** | `type: "spring", stiffness: 600, damping: 30` (`scale: 0.4 -> 1`) | `UICheckbox` checkmark, `UIBadge` indicator dot |
| **Modal / Dialog Enter** | `type: "spring", damping: 28, stiffness: 380` (`scale: 0.95 -> 1`, `opacity: 0 -> 1`) | `UIModal`, `UIDrawer` |
| **Dropdown Popover** | `duration: 0.15, ease: [0.16, 1, 0.3, 1]` (`y: -6 -> 0`, `opacity: 0 -> 1`) | `UISelect`, `UIDatePicker`, `UIDropdown` |

### 2.2 Boundary Containment & Anti-Scrollbar Rule
- **Safe Padding**: When using `layoutId` or spring motion on children (such as `UITabs`), the parent container **must** have `p-1.5`, `rounded-2xl`, and `overflow-hidden` so that spring wobble never spills over the container border or triggers accidental scrollbars.
- **Unique Layout Namespaces**: Components using `layoutId` (e.g. `UITabs`) must generate an isolated instance ID with `useId()` (`tabs-indicator-${useId()}`) so multiple instances on a single page never collide.

---

## 3. Standard Ergonomic Sizing Matrix

Every form control and action primitive must support the standard 5-step size ladder:

| Size Code | Height | Font Size | Touch Target | Primary Use Case |
|---|---|---|---|---|
| `xs` | `28px` (`h-7`) | `11.5px` (`text-[11.5px]`) | Compact | Dense data table row actions, mini badges |
| `sm` | `34px` (`h-8.5`) | `13px` (`text-[13px]`) | Moderate | Filter toolbars, secondary actions |
| `md` | `40px` (`h-10`) | `14px` (`text-sm`) | **Default (44px target)** | Standard forms, primary modals, POS fields |
| `lg` | `46px` (`h-11.5`) | `15px` (`text-[15px]`) | Prominent | Primary page CTAs, prominent forms |
| `xl` | `52px` (`h-13`) | `16px` (`text-base`) | Hero | Landing page buttons, kiosk touchscreens |

---

## 4. Built Primitives Inventory (20 Components)

### 1. `UIButton`
- **Location**: [src/components/ui/UIButton.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIButton.jsx)
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `destructive`, `soft`, `success`, `warning`, `link`.
- **Props**: `variant`, `size`, `isLoading`, `loadingText`, `startIcon`, `endIcon`, `fullWidth`, `disabled`, `rounded`, `type`, `onClick`.
- **Motion**: `whileTap={{ scale: 0.97 }}`, smooth spinner with zero layout jump.

### 2. `UIIconButton`
- **Location**: [src/components/ui/UIIconButton.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIIconButton.jsx)
- **Shapes**: `circle`, `rounded` (`rounded-lg`), `square` (`rounded-md`).
- **Badges**: `badge={true}` (dot) or `badge={7}` / `badge="99+"` (count pill).
- **Motion**: `whileTap={{ scale: 0.92 }}` with accessible tooltips & `aria-label`.

### 3. `UIInput`
- **Location**: [src/components/ui/UIInput.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIInput.jsx)
- **Features**: Prefix/suffix icons/currency (`₹`), auto password show/hide eye toggle, dynamic clear `✕` button, zero-jump error text.

### 4. `UISearchInput`
- **Location**: [src/components/ui/UISearchInput.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UISearchInput.jsx)
- **Features**: Built-in 300ms debouncing, `⌘K` / `/` hotkey badge with window trigger, instant `Esc` clear.

### 5. `UISelect`
- **Location**: [src/components/ui/UISelect.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UISelect.jsx)
- **Features**: Search filter inside popover, animated chevron rotation, 4-way collision flipping, keyboard navigation.

### 6. `UIDatePicker`
- **Location**: [src/components/ui/UIDatePicker.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIDatePicker.jsx)
- **Features**: Month/year calendar stepper, quick presets (*Today*, *Yesterday*, *+30D Expiry*, *+90D*), 4-way collision flipping.

### 7. `UICheckbox`
- **Location**: [src/components/ui/UICheckbox.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UICheckbox.jsx)
- **Features**: Spring pop checkmark, indeterminate minus state (table select-all), semantic colors, multi-line description.

### 8. `UISwitch`
- **Location**: [src/components/ui/UISwitch.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UISwitch.jsx)
- **Features**: Spring thumb toggle, tactile thumb stretch on press, thumb icons, loading state.

### 9. `UITabs`
- **Location**: [src/components/ui/UITabs.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UITabs.jsx)
- **Variants**: `pill`, `segmented`, `underline`.
- **Motion**: `layoutId` spring gliding indicator, safe boundary containment.

### 10. `UICard` Suite
- **Location**: [src/components/ui/UICard.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UICard.jsx)
- **Sub-components**: `UICard`, `UICardHeader`, `UICardTitle`, `UICardDescription`, `UICardContent`, `UICardFooter`.

### 11. `UITable`
- **Location**: [src/components/ui/UITable.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UITable.jsx)
- **Sub-components**: `UITable`, `UITableHeader`, `UITableBody`, `UITableRow`, `UITableHead`, `UITableCell`.

### 12. `UIModal`
- **Location**: [src/components/ui/UIModal.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIModal.jsx)
- **Sub-components**: `UIModal`, `UIModalHeader`, `UIModalTitle`, `UIModalDescription`, `UIModalBody`, `UIModalFooter`.

### 13. `UIDropdown`
- **Location**: [src/components/ui/UIDropdown.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIDropdown.jsx)
- **Sub-components**: `UIDropdown`, `UIDropdownTrigger`, `UIDropdownMenu`, `UIDropdownItem`, `UIDropdownDivider`, `UIDropdownLabel`.

### 14. `UIBadge`
- **Location**: [src/components/ui/UIBadge.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIBadge.jsx)
- **Variants**: `soft`, `solid`, `outline`, `dot` (with animated pulse indicator).

### 15. `UIPagination`
- **Location**: [src/components/ui/UIPagination.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIPagination.jsx)
- **Features**: Page number buttons, page size selector, total record counter.

### 16. `UIPageHeader` / `PageHeader`
- **Location**: [src/components/ui/UIPageHeader.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIPageHeader.jsx)
- **Features**: Page title + description + action buttons + breadcrumbs + back button + sticky/glass mode + bottom tabs slot.

### 17. `UIPageTitle` / `PageTitle`
- **Location**: [src/components/ui/UIPageHeader.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIPageHeader.jsx)
- **Scale**: Desktop `text-[28px] font-extrabold`, Mobile `text-[22px] font-extrabold`. Single `<h1>` per page.

### 18. `UIPageDescription` / `PageDescription`
- **Location**: [src/components/ui/UIPageHeader.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIPageHeader.jsx)
- **Scale**: Desktop `text-[15px]`, Mobile `text-sm`, max-w-3xl for reading comfort.

### 19. `UISectionHeader` / `SectionHeader`
- **Location**: [src/components/ui/UISectionHeader.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UISectionHeader.jsx)
- **Features**: Section/card container headings with colored status indicator dots, icon prefixes, badge counters, action buttons, and divider rule.

### 20. `UISectionTitle` / `SectionTitle`
- **Location**: [src/components/ui/UISectionHeader.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UISectionHeader.jsx)
- **Scale**: Desktop `text-xl font-bold` (20px), Mobile `text-base font-bold` (16px). Semantic `<h2>` / `<h3>`.

### 21. `UISectionDescription` / `SectionDescription`
- **Location**: [src/components/ui/UISectionHeader.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UISectionHeader.jsx)
- **Scale**: Desktop `text-sm text-text-muted leading-relaxed`, Mobile `text-[13px] text-text-muted`.

### 22. `UIFormSection` / `FormSection`
- **Location**: [src/components/ui/UIFormSection.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIFormSection.jsx)
- **Sub-components**: `UIFormSection`, `UIFormGrid`, `UIFormField`.
- **Features**: Collapsible accordion mode, responsive columns (1 to 4), variants (`card`, `flat`, `clean`).

### 23. `UIFormActions` / `FormActions`
- **Location**: [src/components/ui/UIFormActions.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIFormActions.jsx)
- **Features**: Save / Cancel / Delete / Reset actions, positions (`inline`, `sticky`, `floating`), loading states, mobile touch targets ≥ 44px.

### 24. `UIEmptyState` / `EmptyState`
- **Location**: [src/components/ui/UIEmptyState.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIEmptyState.jsx)
- **Features**: Icon badge, title, description, primary CTA, secondary action, variants (`card`, `dashed`, `inline`), sizes (`sm`, `md`, `lg`).

### 25. `UILoadingState` / `LoadingState`
- **Location**: [src/components/ui/UILoadingState.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UILoadingState.jsx)
- **Sub-components**: `UILoadingState`, `UISkeleton`, `UITableSkeleton`, `UICardSkeleton`, `UIFormSkeleton`.
- **Features**: 60fps shimmer effect, pre-built structural skeletons matching real UI to ensure zero layout shift (CLS 0).

### Standalone `UIBreadcrumbs` Suite
- **Location**: [src/components/ui/UIBreadcrumb.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIBreadcrumb.jsx)
- **Sub-components**: `UIBreadcrumbs`, `UIBreadcrumbList`, `UIBreadcrumbItem`, `UIBreadcrumbLink`, `UIBreadcrumbPage`, `UIBreadcrumbSeparator`, `UIBreadcrumbEllipsis`.
- **Features**: Automatic intermediate collapse dropdown (`maxItems`), custom separators (`chevron`, `slash`, `arrow`, `dot`), pills container variant, icon support, clickable routes.

### 26. `UIFilterBar` / `FilterBar`
- **Location**: [src/components/ui/UIFilterBar.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIFilterBar.jsx)
- **Sub-components**: `UIFilterBar`, `UIFilterChip`.
- **Features**: Debounced search, active removable filter chips, quick preset pills, collapsible advanced filters drawer, auto-clear all.

### 27. `UIActionBar` / `ActionBar`
- **Location**: [src/components/ui/UIActionBar.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIActionBar.jsx)
- **Features**: Action toolbar with Table/Grid view switcher; auto-switches to Bulk Selection mode (counter, bulk export, bulk delete, clear selection) when `selectedCount > 0`.

### 28. `UIStatCard` / `StatCard`
- **Location**: [src/components/ui/UIStatCard.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIStatCard.jsx)
- **Features**: KPI metrics (value + prefix/suffix + tabular font), comparative period subtitles, trend percentages (`up`/`down`/`neutral`), mini SVG sparklines, progress bars, loading skeleton mode.

### 29. `UISummaryCard` / `SummaryCard`
- **Location**: [src/components/ui/UISummaryCard.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UISummaryCard.jsx)
- **Features**: Multi-stat horizontal overview strip (`variant="strip"`), vertical invoice billing calculation with deduction lines and highlighted grand total net footer.

### 30. `UIInfoCard` / `InfoCard`
- **Location**: [src/components/ui/UIInfoCard.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIInfoCard.jsx)
- **Features**: Structured key-value details grid, regulatory compliance notices (`variant="accent"`), vendor profiles, dismissible cold-chain alerts, collapsible accordion mode.

### 31. `UIDetailRow` / `DetailRow`
- **Location**: [src/components/ui/UIDetailRow.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIDetailRow.jsx)
- **Features**: Structured `Label → Value` pair with click-to-copy tooltip feedback, badge values, monospace formatting, and border/dashed dividers.

### 32. `UIKeyValueList` / `KeyValueList`
- **Location**: [src/components/ui/UIKeyValueList.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIKeyValueList.jsx)
- **Features**: Multiple label/value pairs container supporting 1-4 column grids, striped zebra rows, card containers, "Copy All", and collapsible accordion headers.

### 33. `UIStatusIndicator` / `StatusIndicator`
- **Location**: [src/components/ui/UIStatusIndicator.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIStatusIndicator.jsx)
- **Features**: Active, pending, expired, quarantined status indicator system with pulsing glowing dots, soft capsule badges, and card border accent bars.

### 34. `UIConfirmDialog` / `ConfirmDialog`
- **Location**: [src/components/ui/UIConfirmDialog.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIConfirmDialog.jsx)
- **Features**: Enterprise confirmation dialog with highlighted target entity boxes, intent themes (`danger`, `warning`, `info`, `success`), and keyword safety verification inputs (e.g. typing "DELETE").

### 35. `UISkeleton` / `Skeleton`
- **Location**: [src/components/ui/UISkeleton.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UISkeleton.jsx)
- **Sub-components**: `UISkeleton`, `UISkeletonText`, `UISkeletonAvatar`, `UISkeletonButton`, `UISkeletonCard`, `UISkeletonTable`, `UISkeletonForm`, `UISkeletonKpi`.
- **Features**: Hardware-accelerated 60fps shimmer physics, zero-CLS layout placeholders matching real ERP screens.

### 36. `UIAlert` / `Alert`
- **Location**: [src/components/ui/UIAlert.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIAlert.jsx)
- **Features**: System message banners (warning, error, info, success, purple, neutral) with collapsible technical diagnostics and CTA action buttons.

### 37. `UIToast` / `Toast`
- **Location**: [src/components/ui/UIToast.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIToast.jsx)
- **Sub-components**: `UIToastContainer`, `uiToast`.
- **Features**: Global ephemeral notification system with animated countdown progress timers, promise loading states, and multi-position viewport containers.

### 38. `UITooltip` / `Tooltip`
- **Location**: [src/components/ui/UITooltip.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UITooltip.jsx)
- **Features**: Lightweight floating helper tooltip with 4-way collision auto-flipping, keyboard shortcut badges, and smooth spring physics.

### 39. `UIDrawer` / `Drawer`
- **Location**: [src/components/ui/UIDrawer.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIDrawer.jsx)
- **Features**: Slide-over side sheet panel for fast forms, detail views, and batch audits with multi-position support (right, left, bottom, top) and sticky action footers.

### 40. `UIFileUpload` / `FileUpload`
- **Location**: [src/components/ui/UIFileUpload.jsx](file:///c:/Users/Intel/Desktop/erp/erp-frontend/src/components/ui/UIFileUpload.jsx)
- **Features**: Drag-and-drop file upload zone and attachment manager with format validation (PDF, JPG, PNG, Excel), size limits, and removable attachment cards.

---

## 5. How to Test & Verify in Showroom

1. Test in the browser at: **`http://localhost:5173/ui-showcase`**
2. Run verification before completing:
   ```bash
   npm run build
   ```
   **Must finish with Exit Code 0 and zero compilation errors.**


