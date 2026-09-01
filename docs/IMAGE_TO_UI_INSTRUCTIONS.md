# PharmaERP — Image-to-UI Replication Guide & Master Prompt Protocol (v3.0)

> **The Universal Blueprint Translation Protocol for PharmaERP.**  
> Use this document when feeding reference screenshots, UI mockups, sketches, or wireframe images into an AI assistant or chat to generate native, production-grade frontend code.
>
> 📖 **Companion Guides:**
> - [Component Catalog & Props Reference](file:///c:/Users/Intel/Desktop/erp/erp-frontend/docs/COMPONENT_CATALOG.md) — Complete props, types, and imports for all 40+ `UI*` primitives.
> - [Universal Design Standards](file:///c:/Users/Intel/Desktop/erp/erp-frontend/docs/DESIGN_STANDARDS.md) — Color tokens, typography scales, spacing ladder, and responsive matrix.
> - [Reusable Components Architecture](file:///c:/Users/Intel/Desktop/erp/erp-frontend/docs/REUSABLE_COMPONENTS_GUIDE.md) — Motion physics, spring configurations, and barrel exports.

---

## 1. The Core Axiom: Image as Wireframe / Blueprint Only

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE WIREFRAME-ONLY RULE                                   │
├───────────────────────────────────────────────────┬────────────────────────────────────┤
│ 📐 TAKE FROM THE IMAGE (The Blueprint)            │ 🚫 NEVER COPY FROM THE IMAGE       │
├───────────────────────────────────────────────────┼────────────────────────────────────┤
│ • Layout zoning & split-pane hierarchy            │ • Colors, backgrounds & gradients │
│ • Information grouping & card boundaries          │ • Foreign font families & sizes   │
│ • Component positioning ("what goes where")       │ • Non-standard borders & shadows  │
│ • Filter bar, search & action toolbar placement   │ • Generic HTML / raw elements      │
│ • Data table columns, badges & row actions        │ • Third-party UI kit stylings      │
│ • Form field arrangements & column spans          │ • Legacy / obsolete App* components│
│ • Modal, drawer & dialog structural flow          │ • Hardcoded hex codes (#1e293b...) │
└───────────────────────────────────────────────────┴────────────────────────────────────┘
```

### 1.1 The Golden Rule
> **"From the reference image, extract ONLY the structural wireframe and spatial blueprint (what information is displayed and where it is located). NEVER replicate the visual skin, colors, fonts, or ad-hoc styling of the image. Always render the blueprint using PharmaERP's native `UI*` component suite, semantic CSS theme tokens, Geist typography, and Emil Kowalski spring physics."**

---

## 2. Ready-to-Use Master Prompt Template

Copy and paste the block below directly into any AI chat (Antigravity, Claude, ChatGPT, Gemini) whenever you attach an image to replicate UI:

````markdown
You are a senior frontend engineer and design engineer for **PharmaERP**. 
I have attached a reference image/mockup for the **[INSERT PAGE / FEATURE NAME]** feature.

### ⚠️ MANDATORY INSTRUCTIONS: IMAGE IS WIREFRAME-ONLY
1. **Blueprint Only**: Treat the attached image strictly as a structural wireframe and spatial blueprint ("what goes where", layout zones, information hierarchy, data tables, metrics, form arrangements).
2. **Zero Visual Cloning**: Do NOT replicate the image's raw colors, fonts, backgrounds, border radii, or styling.
3. **Use Project Design System**: You MUST use PharmaERP's native `UI*` component primitives (`src/components/ui/`) and semantic CSS theme tokens (`bg-bg`, `bg-surface`, `bg-surface-alt`, `text-text`, `text-text-muted`, `border-border`, `bg-primary`, `text-error`, etc.).
4. **Zero Legacy Components**: NEVER import or use legacy `App*` components (`AppButton`, `AppInput`, `AppCard`, etc.). Use ONLY `UI*` primitives from `src/components/ui/index.js` or `src/components/ui/[Component].jsx`.
5. **Geist Typography & Numbers**: Single `<h1>` per page (28px desktop / 22px mobile). Always add `tabular-nums font-mono` to monetary values (₹), batch numbers, stock quantities, and timestamps.
6. **Multi-Device & Short Screen Handling**: Support mobile (390px), foldable (440px), tablet (768px), and desktop (1024px+). For laptop screens (< 700px height), use `min-h-[100dvh]` with `my-auto` so content centers gracefully and scrolls without clipping action buttons.
7. **Tactile Motion**: Add `whileTap={{ scale: 0.97 }}` on pressables, origin-aware popovers, and smooth spring physics (< 300ms duration).

### Context & Requirements:
- **Feature Name**: [e.g., Medicine Inventory Management / Batch Expiry Audit]
- **Target Route**: [e.g., /inventory/medicines]
- **Specific Business Rules**: [e.g., Batch expiry warnings < 30 days should be highlighted with UIBadge variant="warning"]

Now, analyze the structural blueprint of the image and write the clean, fully-typed React component using our native `UI*` suite.
````

---

## 3. Blueprint-to-Component Translation Matrix

When looking at a section in your reference image, use this exact translation table to pick the corresponding PharmaERP `UI*` primitive:

| Wireframe Element in Image | Native PharmaERP Component | Import Path | Standard Usage Pattern |
|---|---|---|---|
| **Top Page Title & Actions** | `UIPageHeader`, `UIPageTitle`, `UIPageDescription` | `src/components/ui/UIPageHeader` | Single `<h1>`, breadcrumbs slot, back button, CTA buttons |
| **Breadcrumb Navigation** | `UIBreadcrumbs`, `UIBreadcrumbItem` | `src/components/ui/UIBreadcrumb` | Auto-collapse dropdown, customizable separators |
| **Section / Container Header** | `UISectionHeader`, `UISectionTitle`, `UISectionDescription` | `src/components/ui/UISectionHeader` | Status dot indicator, icon badge, section action slot |
| **KPI / Metric Summary Card** | `UIStatCard` | `src/components/ui/UIStatCard` | Metric value, trend percentage (`up`/`down`), mini SVG sparkline |
| **Multi-Metric Strip / Invoice Box** | `UISummaryCard` | `src/components/ui/UISummaryCard` | Horizontal multi-stat strip or vertical calculation breakdown |
| **Key-Value Info Card / Notice** | `UIInfoCard`, `UIDetailRow`, `UIKeyValueList` | `src/components/ui/UIInfoCard`, `UIDetailRow`, `UIKeyValueList` | Structured metadata grid with click-to-copy and accent borders |
| **Search Bar with Hotkey** | `UISearchInput` | `src/components/ui/UISearchInput` | Debounced 300ms, `⌘K` / `/` hotkey badge, instant `Esc` clear |
| **Filter Toolbar & Chips** | `UIFilterBar`, `UIFilterChip` | `src/components/ui/UIFilterBar` | Search input, filter select dropdowns, active filter pills |
| **Action Toolbar & Bulk Selection** | `UIActionBar` | `src/components/ui/UIActionBar` | Grid/Table switcher; auto-switches to bulk action mode on select |
| **Data Table / Grid** | `UITable`, `UITableHeader`, `UITableRow`, `UITableCell` | `src/components/ui/UITable` | Hover highlights, zebra striping, sticky header, select-all |
| **Table Pagination** | `UIPagination` | `src/components/ui/UIPagination` | Page buttons, page size selector, total count counter |
| **Form Container / Fieldset** | `UIFormSection`, `UIFormGrid`, `UIFormField` | `src/components/ui/UIFormSection` | 1-4 column grid, collapsible accordion mode, field labels |
| **Standard Text / Number Input** | `UIInput` | `src/components/ui/UIInput` | Prefix/suffix icons, currency (₹), clear button, zero-jump error |
| **Dropdown / Select Menu** | `UISelect` | `src/components/ui/UISelect` | Searchable popover, 4-way collision auto-flipping, keyboard nav |
| **Date / Date Range Picker** | `UIDatePicker` | `src/components/ui/UIDatePicker` | Calendar popover, presets (*Today*, *+30D Expiry*), collision flip |
| **Checkbox / Selection Box** | `UICheckbox` | `src/components/ui/UICheckbox` | Spring pop checkmark, indeterminate minus, helper text |
| **Toggle Switch** | `UISwitch` | `src/components/ui/UISwitch` | Tactile spring thumb stretch, size ladder (`sm`, `md`, `lg`) |
| **File Upload / Drag & Drop** | `UIFileUpload` | `src/components/ui/UIFileUpload` | Drag-and-drop dropzone, file validation, attachment cards |
| **Form Bottom Action Bar** | `UIFormActions` | `src/components/ui/UIFormActions` | Save, Cancel, Reset buttons, sticky/floating positions |
| **Primary & Secondary Buttons** | `UIButton` | `src/components/ui/UIButton` | Variants (`primary`, `secondary`, `outline`, `destructive`, `ghost`) |
| **Square / Circle Icon Button** | `UIIconButton` | `src/components/ui/UIIconButton` | Tooltip integration, badge counter pill, tactile scale |
| **Status Badge / Chip** | `UIBadge` | `src/components/ui/UIBadge` | Variants (`soft`, `solid`, `outline`, `dot`), pulse indicator |
| **Status State Indicator** | `UIStatusIndicator` | `src/components/ui/UIStatusIndicator` | Glowing pulse dots, status capsules (Active, Expired, Quarantined) |
| **Modal / Dialog Window** | `UIModal`, `UIModalHeader`, `UIModalBody` | `src/components/ui/UIModal` | Spring enter physics, backdrop blur, keyboard `Esc` close |
| **Confirmation / Danger Dialog** | `UIConfirmDialog` | `src/components/ui/UIConfirmDialog` | Target entity highlight box, safety keyword verification |
| **Side Sheet / Slide-over Panel** | `UIDrawer` | `src/components/ui/UIDrawer` | 4 slide positions (right, left, bottom, top), sticky footer |
| **Floating Helper Tooltip** | `UITooltip` | `src/components/ui/UITooltip` | 4-way collision flipping, keyboard shortcut badge |
| **Alert / Warning Banner** | `UIAlert` | `src/components/ui/UIAlert` | Intent variants, dismiss button, collapsible diagnostics slot |
| **Floating Toast Notification** | `UIToast`, `uiToast` | `src/components/ui/UIToast` | Animated progress bar, promise loading states |
| **In-Page Navigation Tabs** | `UITabs` | `src/components/ui/UITabs` | Spring sliding indicator (`pill`, `segmented`, `underline`) |
| **Zero Data Empty State** | `UIEmptyState` | `src/components/ui/UIEmptyState` | Icon illustration badge, title, subtitle, primary & secondary CTA |
| **Loading Skeleton Placeholders** | `UISkeleton`, `UITableSkeleton`, etc. | `src/components/ui/UISkeleton` | 60fps hardware shimmer, zero Cumulative Layout Shift (CLS) |

---

## 4. Semantic Color & Theme Token Rules

Never use hardcoded hex colors (`#0F172A`, `#3B82F6`, `#EF4444`, etc.) or random raw Tailwind palettes (`bg-blue-600`, `text-slate-800`). Map every visual element in the wireframe to our semantic tokens:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              SEMANTIC TOKEN MAPPING                                    │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ Wireframe Visual Intent  │ Tailwind CSS Semantic Class │ CSS Variable Token            │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ Page Background Canvas   │ bg-bg                       │ var(--app-color-bg)           │
│ Card / Panel / Container │ bg-surface                  │ var(--app-color-surface)      │
│ Zebra Striping / Sub-card│ bg-surface-alt              │ var(--app-color-surface-alt)  │
│ Hover Highlight Surface  │ bg-surface-hover            │ var(--app-color-surface-hover)│
│ Primary Headings / Text  │ text-text                   │ var(--app-color-text)         │
│ Subtitles / Hints / Meta │ text-text-muted             │ var(--app-color-text-muted)   │
│ Standard Border / Rule   │ border-border               │ var(--app-color-border)       │
│ Focus / Active Border    │ border-border-strong        │ var(--app-color-border-strong)│
│ Primary Brand Actions    │ bg-primary / text-primary   │ var(--app-color-primary)      │
│ Brand Soft Accent        │ bg-primary-soft             │ var(--app-color-primary-soft) │
│ Success / Active State   │ text-success / bg-success-soft│ var(--app-color-success)    │
│ Warning / Pending State  │ text-warning / bg-warning-soft│ var(--app-color-warning)    │
│ Error / Destructive Action│ text-error / bg-error-soft  │ var(--app-color-error)      │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

### 4.1 Tabular Numerals Rule
Any data column, metric, badge, or table cell displaying numbers, currencies, dates, batch IDs, or phone numbers **MUST** include:
```html
<span className="font-mono tabular-nums font-semibold">₹1,24,500.00</span>
```

---

## 5. Universal Multi-Device & Responsive Rules

When replicating an image layout, ensure it adapts across all 7 device form factors:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               UNIVERSAL DEVICE SELECTION MATRIX                                        │
├──────────────────────┬───────────────────────┬───────────────────────────┬─────────────────────────────┤
│ Category             │ Viewport Width        │ Target Hardware           │ Applied Architecture        │
├──────────────────────┼───────────────────────┼───────────────────────────┼─────────────────────────────┤
│ 1. Compact / Folded  │ 280px – 360px         │ Galaxy Z Fold (Cover), SE │ Fluid Single-Col Mobile     │
│ 2. Standard Mobile   │ 360px – 480px         │ iPhone 15/16, Galaxy S24  │ Centered Mobile Flow (390px)│
│ 3. Unfolded Foldable │ 480px – 767px         │ Galaxy Fold Open, Phablet │ Centered Mobile Card (440px)│
│ 4. Tablet Portrait   │ 768px – 1023px        │ iPad 10.2", iPad Air      │ Single-Col Desktop Card     │
│ 5. Short Laptop / Tab│ 1024px – 1279px       │ 1366x768, iPad Landscape  │ Split Desktop (Scrollable)  │
│ 6. Standard Desktop  │ 1280px – 1536px       │ 1080p Monitors, MacBooks  │ Dual-Rail Split Workspace   │
│ 7. Ultra-wide / 4K   │ > 1536px              │ 1440p, 4K, 21:9 Displays  │ Centered Boundary (max-w-7xl)│
└──────────────────────┴───────────────────────┴───────────────────────────┴─────────────────────────────┘
```

### 5.1 Short Screen Handling (< 700px Viewport Height)
If the image shows a modal or card centered on screen:
1. **Never use fixed heights** (e.g. `h-[600px]`).
2. **Use fluid centering**: `min-h-[100dvh] flex flex-col justify-center py-6 sm:py-8 lg:py-10` with `my-auto` on the inner card container.
3. Ensure natural vertical scrolling so buttons are never clipped on laptops with 768px screens.
4. **Touch Targets**: Minimum `44px × 44px` on all buttons, inputs, links, and checkboxes on mobile viewports.

---

## 6. Motion & Micro-Interaction Standards

Apply Emil Kowalski design engineering principles:
1. **Tactile Press Feedback**: All buttons and clickable cards must include `whileTap={{ scale: 0.97 }}` and `transition-transform duration-150`.
2. **Origin-Aware Popovers**: Dropdowns and popovers must scale from their trigger point (`transform-origin: var(--transform-origin)`).
3. **No Scale Zero**: Animate entries from `scale(0.95)` with opacity `0 -> 1`.
4. **Duration Budget**: All UI animations must stay under **`300ms`** (150ms – 250ms optimal).
5. **Hover Safety**: Gate desktop hover states behind `@media (hover: hover)` or Tailwind `hover:` to avoid sticky hover bugs on touch screens.

---

## 7. Concrete Step-by-Step Walkthrough: Wireframe -> Code

Suppose the user provides a reference image containing:
- A top title bar with an "Export" and "+ Add Medicine" button.
- 4 summary cards showing Total Stock, Low Stock Alert, Expired Batches, and Today's Revenue.
- A search input and filter bar (Category dropdown, Status dropdown).
- A data table of medicines with status badges and action menus.
- A bottom pagination bar.

### Step 1: Deconstruct the Blueprint (Structure Only)
```
[Page Container (max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6)]
  ├── Header Zone: UIPageHeader (Title, Description, Breadcrumbs, Action Buttons)
  ├── KPI Metrics Grid: 4 x UIStatCard (Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4)
  ├── Filter Zone: UIFilterBar + UISearchInput + UISelect filters + Clear button
  ├── Content Zone: UICard containing:
  │     ├── UIActionBar (View switcher + Bulk select actions when items checked)
  │     ├── UITable (Header, Body with Checkbox, Medicine Name, SKU, Batch, Expiry, Price, UIBadge status, UIIconButton menu)
  │     └── UIPagination (Page numbers, page size selector, record count)
```

### Step 2: Write Native PharmaERP Code
```jsx
import React, { useState } from "react";
import { 
  Plus, 
  Download, 
  Pill, 
  AlertTriangle, 
  CalendarX, 
  TrendingUp, 
  MoreVertical, 
  Edit3, 
  Trash2 
} from "lucide-react";
import {
  UIPageHeader,
  UIPageTitle,
  UIPageDescription,
  UIBreadcrumbs,
  UIStatCard,
  UIFilterBar,
  UISearchInput,
  UISelect,
  UIActionBar,
  UICard,
  UITable,
  UITableHeader,
  UITableBody,
  UITableRow,
  UITableHead,
  UITableCell,
  UIBadge,
  UIButton,
  UIIconButton,
  UICheckbox,
  UIPagination,
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem
} from "@/components/ui";

export default function MedicinesInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Native PharmaERP UI implementation...
  return (
    <div className="min-h-screen bg-bg text-text p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <UIPageHeader
        breadcrumbs={
          <UIBreadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Inventory", href: "/inventory" },
              { label: "Medicines", active: true }
            ]}
          />
        }
        title={<UIPageTitle>Medicines Inventory</UIPageTitle>}
        description={
          <UIPageDescription>
            Manage pharmaceutical stock, batch tracking, expiry monitoring, and pricing.
          </UIPageDescription>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <UIButton variant="outline" size="sm" startIcon={<Download className="w-4 h-4" />}>
              Export
            </UIButton>
            <UIButton variant="primary" size="sm" startIcon={<Plus className="w-4 h-4" />}>
              Add Medicine
            </UIButton>
          </div>
        }
      />

      {/* 2. KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UIStatCard
          title="Total SKU Stock"
          value="12,450"
          icon={<Pill className="w-5 h-5 text-primary" />}
          trend={{ direction: "up", value: "+8.4%", label: "vs last month" }}
        />
        <UIStatCard
          title="Low Stock Alert"
          value="18"
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          trend={{ direction: "down", value: "-2 items", label: "requires reorder" }}
        />
        <UIStatCard
          title="Near Expiry (<30D)"
          value="7"
          icon={<CalendarX className="w-5 h-5 text-error" />}
          trend={{ direction: "neutral", value: "Critical", label: "audit needed" }}
        />
        <UIStatCard
          title="Today's Sales Value"
          value="₹1,84,320"
          icon={<TrendingUp className="w-5 h-5 text-success" />}
          trend={{ direction: "up", value: "+14.2%", label: "vs yesterday" }}
        />
      </div>

      {/* 3. Filter Bar */}
      <UIFilterBar
        searchComponent={
          <UISearchInput
            placeholder="Search medicine name, SKU, or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        }
        filters={[
          <UISelect
            key="category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { value: "all", label: "All Categories" },
              { value: "antibiotics", label: "Antibiotics" },
              { value: "analgesics", label: "Analgesics" },
              { value: "cardiac", label: "Cardiovascular" }
            ]}
          />
        ]}
      />

      {/* 4. Table Card */}
      <UICard>
        <UIActionBar
          selectedCount={selectedItems.length}
          onClearSelection={() => setSelectedItems([])}
          bulkActions={[
            { label: "Export Selected", icon: <Download className="w-4 h-4" />, onClick: () => {} },
            { label: "Delete", icon: <Trash2 className="w-4 h-4" />, variant: "destructive", onClick: () => {} }
          ]}
        />
        
        <UITable>
          <UITableHeader>
            <UITableRow>
              <UITableHead className="w-12">
                <UICheckbox />
              </UITableHead>
              <UITableHead>Medicine Name</UITableHead>
              <UITableHead>SKU / Batch</UITableHead>
              <UITableHead>Category</UITableHead>
              <UITableHead className="text-right">Stock</UITableHead>
              <UITableHead className="text-right">Unit Price</UITableHead>
              <UITableHead>Status</UITableHead>
              <UITableHead className="w-16 text-center">Actions</UITableHead>
            </UITableRow>
          </UITableHeader>
          <UITableBody>
            <UITableRow>
              <UITableCell>
                <UICheckbox />
              </UITableCell>
              <UITableCell className="font-semibold text-text">
                Amoxicillin 500mg
              </UITableCell>
              <UITableCell className="font-mono text-xs text-text-muted tabular-nums">
                AMX-500 #B8821
              </UITableCell>
              <UITableCell>Antibiotics</UITableCell>
              <UITableCell className="text-right font-mono tabular-nums">
                450 Strips
              </UITableCell>
              <UITableCell className="text-right font-mono font-medium tabular-nums">
                ₹85.00
              </UITableCell>
              <UITableCell>
                <UIBadge variant="soft" color="success">In Stock</UIBadge>
              </UITableCell>
              <UITableCell className="text-center">
                <UIDropdown>
                  <UIDropdownTrigger asChild>
                    <UIIconButton variant="ghost" size="sm" aria-label="Row actions">
                      <MoreVertical className="w-4 h-4" />
                    </UIIconButton>
                  </UIDropdownTrigger>
                  <UIDropdownMenu align="end">
                    <UIDropdownItem icon={<Edit3 className="w-4 h-4" />}>
                      Edit Details
                    </UIDropdownItem>
                    <UIDropdownItem icon={<Trash2 className="w-4 h-4 text-error" />} destructive>
                      Delete Item
                    </UIDropdownItem>
                  </UIDropdownMenu>
                </UIDropdown>
              </UITableCell>
            </UITableRow>
          </UITableBody>
        </UITable>

        {/* 5. Pagination */}
        <div className="p-4 border-t border-border">
          <UIPagination
            currentPage={currentPage}
            totalPages={12}
            totalRecords={12450}
            pageSize={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </UICard>
    </div>
  );
}
```

---

## 8. Pre-Delivery Verification Checklist

Before accepting or submitting any code generated from an image blueprint:

- [ ] **Wireframe Extraction Only**: Verified that layout, positioning, and data flow were taken from the blueprint, while all foreign colors/fonts/styles were discarded.
- [ ] **Pure `UI*` Components**: Verified that 100% of components are imported from `src/components/ui/` with zero legacy `App*` components.
- [ ] **Zero Hardcoded Colors**: Verified that all styling uses semantic theme classes (`bg-bg`, `bg-surface`, `text-text`, `border-border`, `bg-primary`, etc.).
- [ ] **Geist Typography & Tabular Numbers**: Single `<h1>` per page; all numeric, currency, stock, batch, and date elements use `tabular-nums font-mono`.
- [ ] **Multi-Device Responsive Matrix**: Tested on Foldable (< 360px), Standard Mobile (390px), Tablet (768px), and Ultra-wide desktop (1440p+).
- [ ] **Short Screen Vertical Centering**: Modals and cards use `min-h-[100dvh]` with `my-auto` to scroll smoothly without clipping buttons on laptops (< 700px height).
- [ ] **Touch Targets**: All pressable targets are ≥ 44px × 44px on mobile viewports.
- [ ] **Build Validation**: Verified with `npm run build` with Exit Code 0 and zero compilation errors.

---

*PharmaERP Image-to-UI Replication Guide & Master Prompt Protocol v3.0*
