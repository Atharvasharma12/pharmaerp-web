# PharmaERP — Reusable Component Catalog & Props Reference

> **Comprehensive Developer Reference for PharmaERP UI & Shared Components**  
> *Use this catalog whenever building new pages, dialogs, forms, or data views.*  
> All primary UI primitives are exported from `@/components/ui`.

---

## 📑 Table of Contents

1. [Quick Component Lookup Table](#1-quick-component-lookup-table)
2. [Layout & Page Shell Components](#2-layout--page-shell-components)
   - [UIPageHeader](#uipageheader)
   - [UISectionHeader](#uisectionheader)
   - [UIBreadcrumbs](#uibreadcrumbs)
   - [UICard & Suite](#uicard--suite)
3. [Filter, Action & Control Bars (New)](#3-filter-action--control-bars)
   - [UIFilterBar & UIFilterChip (#26)](#uifilterbar--uifilterchip)
   - [UIActionBar (#27)](#uiactionbar)
4. [Form & Data Input Components](#4-form--data-input-components)
   - [UIInput](#uiinput)
   - [UISearchInput](#uisearchinput)
   - [UISelect](#uiselect)
   - [UIDatePicker](#uidatepicker)
   - [UICheckbox](#uicheckbox)
   - [UISwitch](#uiswitch)
   - [UIFormField & UIFormGrid](#uiformfield--uiformgrid)
   - [UIFormSection](#uiformsection)
   - [UIFormActions](#uiformactions)
5. [Buttons & Interactive Triggers](#5-buttons--interactive-triggers)
   - [UIButton](#uibutton)
   - [UIIconButton](#uiiconbutton)
6. [Navigation & Selection](#6-navigation--selection)
   - [UITabs](#uitabs)
   - [UIDropdown & Suite](#uidropdown--suite)
   - [UIPagination](#uipagination)
7. [KPI Metrics, Summaries & Structured Cards (New)](#7-kpi-metrics-summaries--structured-cards)
   - [UIStatCard (#28)](#uistatcard)
   - [UISummaryCard (#29)](#uisummarycard)
   - [UIInfoCard (#30)](#uiinfocard)
8. [Data Display & Badges](#8-data-display--badges)
   - [UIBadge](#uibadge)
   - [UITable & Suite](#uitable--suite)
9. [Feedback & Overlays](#9-feedback--overlays)
   - [UIModal & Suite](#uimodal--suite)
   - [UIEmptyState](#uiemptystate)
   - [UILoadingState & Skeletons](#uiloadingstate--skeletons)
10. [Charts & KPI Metrics](#10-charts--kpi-metrics)
   - [AppKpiCard](#appkpicard)
   - [Standard Chart Suite](#standard-chart-suite)
11. [Pre-built Confirmation Dialogs](#11-pre-built-confirmation-dialogs)
   - [ConfirmDialog & DeleteConfirmDialog](#confirmdialog--deleteconfirmdialog)
12. [Standard Page Assembly Recipe](#12-standard-page-assembly-recipe)

---

## 1. Quick Component Lookup Table

| Component | Export Path | Category | Primary Use Case |
|---|---|---|---|
| [`UIPageHeader`](#uipageheader) | `@/components/ui` | Layout | Page title, breadcrumbs, back button, actions |
| [`UISectionHeader`](#uisectionheader) | `@/components/ui` | Layout | Card / Section title with status dot & actions |
| [`UIBreadcrumbs`](#uibreadcrumbs) | `@/components/ui` | Layout | Navigation trail with auto-collapsing dropdown |
| [`UICard`](#uicard--suite) | `@/components/ui` | Layout | Card container (`default`, `elevated`, `interactive`) |
| [`UIFilterBar`](#uifilterbar--uifilterchip) | `@/components/ui` | Controls | **#26** Search + filter dropdowns + active chips + clear-all + drawer |
| [`UIActionBar`](#uiactionbar) | `@/components/ui` | Controls | **#27** Page/table action toolbar & floating bulk selection mode |
| [`UIStatCard`](#uistatcard) | `@/components/ui` | Display | **#28** Sales, purchases, stock, customer KPI cards with trends & sparkline |
| [`UISummaryCard`](#uisummarycard) | `@/components/ui` | Display | **#29** Compact financial totals, invoice calculations & horizontal strip |
| [`UIInfoCard`](#uiinfocard) | `@/components/ui` | Display | **#30** Structured key-value details, vendor profiles & compliance notices |
| [`UIDetailRow`](#uidetailrow) | `@/components/ui` | Display | **#31** `Label → Value` pair with copy, badge, formatters, and divider |
| [`UIKeyValueList`](#uikeyvaluelist) | `@/components/ui` | Display | **#32** Multi-column grid, striped, or card container with copy-all |
| [`UIStatusIndicator`](#uistatusindicator) | `@/components/ui` | Display | **#33** Active, pending, expired, quarantined status dots & badges |
| [`UIConfirmDialog`](#uiconfirmdialog) | `@/components/ui` | Overlay | **#34** Destructive/delete/warning modal confirmation with verify input |
| [`UISkeleton`](#uiskeleton--suite) | `@/components/ui` | Feedback | **#35** Zero-CLS skeleton loader suite (atomic text/avatar + table/card/form) |
| [`UIAlert`](#uialert) | `@/components/ui` | Feedback | **#36** System message banner (warning, error, info, success, details) |
| [`UIToast`](#uitoast--uitoastcontainer) | `@/components/ui` | Feedback | **#37** Global ephemeral toast notifications with countdown & promise |
| [`UITooltip`](#uitooltip) | `@/components/ui` | Feedback | **#38** Floating helper tooltip with collision flipping & hotkey badges |
| [`UIDrawer`](#uidrawer) | `@/components/ui` | Overlay | **#39** Slide-over side sheet panel for forms, audits, and details |
| [`UIFileUpload`](#uifileupload) | `@/components/ui` | Input | **#40** Drag-and-drop file upload zone with format validation & previews |
| [`UIButton`](#uibutton) | `@/components/ui` | Button | 9 variants, tactile tap motion, built-in loading spinner |
| [`UIIconButton`](#uiiconbutton) | `@/components/ui` | Button | Compact icon action with badge and tooltip support |
| [`UIInput`](#uiinput) | `@/components/ui` | Input | Form input with prefix/suffix, clear button, password eye |
| [`UISearchInput`](#uisearchinput) | `@/components/ui` | Input | Debounced search with `⌘K` hotkey & Esc clear |
| [`UISelect`](#uiselect) | `@/components/ui` | Input | Dropdown select with search & auto collision flipping |
| [`UIDatePicker`](#uidatepicker) | `@/components/ui` | Input | Calendar date picker with presets & collision detection |
| [`UICheckbox`](#uicheckbox) | `@/components/ui` | Input | Spring checkmark, minus indeterminate state, descriptions |
| [`UISwitch`](#uiswitch) | `@/components/ui` | Input | Toggle switch with spring thumb physics & loading state |
| [`UIFormSection`](#uiformsection) | `@/components/ui` | Form | Grouped form section with collapsible drawer & grid |
| [`UIFormField`](#uiformfield--uiformgrid) | `@/components/ui` | Form | Field wrapper with label, error text, helper text, info tooltip |
| [`UIFormGrid`](#uiformfield--uiformgrid) | `@/components/ui` | Form | Responsive grid (1, 2, 3, 4 columns) for inputs |
| [`UIFormActions`](#uiformactions) | `@/components/ui` | Form | Save / Cancel / Delete bar (`inline`, `sticky`, `floating`) |
| [`UITabs`](#uitabs) | `@/components/ui` | Navigation | Pill, Segmented, Underline tabs with sliding active indicator |
| [`UIDropdown`](#uidropdown--suite) | `@/components/ui` | Navigation | Action menu with 4-way collision auto-flipping |
| [`UIPagination`](#uipagination) | `@/components/ui` | Navigation | Page navigation with page size dropdown & record summary |
| [`UIBadge`](#uibadge) | `@/components/ui` | Display | Status pill/dot (`soft`, `solid`, `outline`, `dot` with pulse) |
| [`UITable`](#uitable--suite) | `@/components/ui` | Display | Data grid with sortable heads, empty state, and loading row |
| [`UIModal`](#uimodal--suite) | `@/components/ui` | Overlay | Dialog modal with backdrop blur & spring scale physics |
| [`UIEmptyState`](#uiemptystate) | `@/components/ui` | Feedback | Empty view with icon badge, title, desc, and action buttons |
| [`UILoadingState`](#uiloadingstate--skeletons) | `@/components/ui` | Feedback | Spinner, or pre-built Skeletons (`table`, `card`, `form`) |
| [`AppKpiCard`](#appkpicard) | `@/components/charts` | Metrics | Analytics KPI card with trend indicator and sparklines |
| [`ConfirmDialog`](#confirmdialog--deleteconfirmdialog) | `@/components/shared` | Dialogs | Confirmation & delete confirmation modal |

---

## 2. Layout & Page Shell Components

### `UIPageHeader`
Primary top banner for every page in the application.

```jsx
import { UIPageHeader, UIButton, UIBadge } from "@/components/ui";
import { Plus, Download } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` \| `ReactNode` | — | Main page title (renders as single semantic `<h1>`) |
| `description` | `string` \| `ReactNode` | — | Supporting text explaining the page purpose |
| `badge` | `ReactNode` | — | Optional badge placed next to the title (e.g. `<UIBadge label="Active" />`) |
| `breadcrumbs` | `Array<{ label, href?, onClick?, icon? }>` \| `ReactNode` | — | Navigation breadcrumbs trail |
| `backButton` | `boolean` \| `{ href?, label?, tooltip?, onClick? }` | `false` | When enabled, renders a back arrow button |
| `actions` | `ReactNode` | — | Top-right action buttons (e.g. Add, Export, Filters) |
| `sticky` | `boolean` | `false` | Makes header stick to the top with backdrop blur |
| `bordered` | `boolean` | `true` | Renders a subtle bottom border line |
| `compact` | `boolean` | `false` | Reduces vertical padding for dense views |
| `className` | `string` | — | Additional CSS class for outer container |
| `children` | `ReactNode` | — | Bottom slot (useful for tabs or horizontal filter bar) |

#### Example

```jsx
<UIPageHeader
  title="Inventory Management"
  description="Monitor pharmaceutical stock levels, batches, and reorder thresholds."
  badge={<UIBadge label="1,420 SKUs" color="primary" variant="soft" />}
  breadcrumbs={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inventory", href: "/inventory" },
    { label: "Batches" }
  ]}
  backButton
  actions={
    <>
      <UIButton variant="outline" size="sm" startIcon={<Download className="size-4" />}>
        Export CSV
      </UIButton>
      <UIButton variant="primary" size="sm" startIcon={<Plus className="size-4" />}>
        Add Batch
      </UIButton>
    </>
  }
/>
```

---

### `UISectionHeader`
Sub-header for cards, multi-step sections, or inner content blocks.

```jsx
import { UISectionHeader, UIButton, UIBadge } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` \| `ReactNode` | — | Section title (renders as `<h2>` / `<h3>`) |
| `description` | `string` \| `ReactNode` | — | Subtitle or helper description |
| `icon` | `ReactNode` | — | Leading icon next to the title |
| `indicatorColor` | `"primary"` \| `"success"` \| `"warning"` \| `"error"` \| `"info"` \| `"purple"` \| `"neutral"` | — | Colored status dot (shown if no `icon` provided) |
| `badge` | `ReactNode` | — | Status badge next to title |
| `actions` | `ReactNode` | — | Right-aligned section actions / buttons |
| `divider` | `boolean` | `false` | Adds bottom border divider and spacing |
| `className` | `string` | — | Additional classes |
| `children` | `ReactNode` | — | Custom extension content slot below header |

#### Example

```jsx
<UISectionHeader
  title="Active Purchase Orders"
  description="POs awaiting vendor confirmation and shipment."
  indicatorColor="warning"
  badge={<UIBadge label="12 Pending" color="warning" size="xs" />}
  actions={
    <UIButton variant="ghost" size="xs">
      View All
    </UIButton>
  }
  divider
/>
```

---

### `UIBreadcrumbs`
Standalone breadcrumb trail navigation with automatic overflow collapse.

```jsx
import { UIBreadcrumbs } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Array<{ label: string, href?: string, onClick?: function, icon?: ReactNode, active?: boolean }>` | `[]` | Array of breadcrumb objects |
| `separator` | `"chevron"` \| `"slash"` \| `"arrow"` \| `"dot"` | `"chevron"` | Separator icon style |
| `customSeparator` | `ReactNode` | — | Custom separator element |
| `maxItems` | `number` | `0` | Max items before middle items collapse into a `...` dropdown menu (0 = no collapse) |
| `itemsBeforeCollapse` | `number` | `1` | Number of items shown before the `...` menu |
| `itemsAfterCollapse` | `number` | `1` | Number of items shown after the `...` menu |
| `variant` | `"default"` \| `"pills"` | `"default"` | `"pills"` wraps breadcrumbs in a sleek capsule panel |
| `className` | `string` | — | Custom classes |
| `children` | `ReactNode` | — | Composable mode (using `UIBreadcrumbItem`, `UIBreadcrumbLink`, etc.) |

#### Example

```jsx
<UIBreadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Suppliers", href: "/suppliers" },
    { label: "Apex Pharma Ltd", href: "/suppliers/apex" },
    { label: "Invoices", href: "/suppliers/apex/invoices" },
    { label: "INV-2026-089" }
  ]}
  maxItems={3}
  separator="slash"
/>
```

---

### `UICard` & Suite
Standard elevated container system.

```jsx
import {
  UICard,
  UICardHeader,
  UICardTitle,
  UICardDescription,
  UICardContent,
  UICardFooter
} from "@/components/ui";
```

#### `UICard` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default"` \| `"elevated"` \| `"flat"` \| `"interactive"` | `"default"` | Visual elevation style (`interactive` has hover translate & scale) |
| `padding` | `"none"` \| `"sm"` \| `"md"` \| `"lg"` | `"md"` | Internal padding (`sm`: 12-16px, `md`: 20-24px, `lg`: 24-32px) |
| `hoverable` | `boolean` | `false` | Shortcut for `variant="interactive"` |
| `onClick` | `function` | — | Card click handler |
| `className` | `string` | — | Container class |
| `children` | `ReactNode` | — | Card body |

#### Example

```jsx
<UICard variant="default">
  <UICardHeader action={<UIButton variant="ghost" size="xs">Edit</UIButton>}>
    <UICardTitle>Customer Profile</UICardTitle>
    <UICardDescription>Pharmacy retail partner details</UICardDescription>
  </UICardHeader>
  <UICardContent>
    <p className="text-sm text-text">Content goes here...</p>
  </UICardContent>
  <UICardFooter>
    <span>Last updated 2 hours ago</span>
  </UICardFooter>
</UICard>
```

---

## 3. Filter, Action & Control Bars

### `UIFilterBar` & `UIFilterChip` (#26)
Unified search, filter toolbar, active filter chips with auto-clear, and collapsible drawer.

```jsx
import { UIFilterBar, UIFilterChip, UISelect, UIButton } from "@/components/ui";
```

#### `UIFilterBar` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `searchQuery` | `string` | — | Controlled search query value |
| `onSearchChange` | `function(e)` | — | Immediate search change handler |
| `onSearch` | `function(query)` | — | Debounced search trigger (300ms) |
| `searchPlaceholder` | `string` | `"Search records..."` | Search placeholder |
| `enableSearch` | `boolean` | `true` | Enables/disables search input |
| `activeFilters` | `Array<{ key: string, label: string, value: string, onRemove?: () => void }>` | `[]` | List of active filter chip objects |
| `onClearAll` | `function` | — | Handler for "Clear all" button (shown when filters exist) |
| `quickFilters` | `Array<{ id: string, label: string, count?: number, active?: boolean, onClick?: () => void }>` | — | Quick preset pill filter buttons |
| `totalResults` | `number` | — | Total count of matching records badge |
| `isLoading` | `boolean` | `false` | Shows spinner in search box |
| `isAdvancedOpen` | `boolean` | — | Controlled advanced filter accordion state |
| `onToggleAdvanced` | `function(isOpen)` | — | Toggle handler for advanced filters drawer |
| `renderAdvancedFilters` | `ReactNode` \| `() => ReactNode` | — | Content rendered inside expandable drawer |
| `variant` | `"card"` \| `"flat"` \| `"clean"` | `"card"` | Container visual styling |
| `actions` | `ReactNode` | — | Custom right-aligned buttons |
| `children` | `ReactNode` | — | Inline filter dropdowns slot |

#### Example

```jsx
<UIFilterBar
  searchQuery={search}
  onSearchChange={(e) => setSearch(e.target.value)}
  onClearAll={handleClearFilters}
  totalResults={184}
  activeFilters={[
    { key: "cat", label: "Category", value: "Antibiotics", onRemove: () => setCategory("all") }
  ]}
  quickFilters={[
    { id: "all", label: "All Items", count: 184, active: tab === "all", onClick: () => setTab("all") },
    { id: "low", label: "Low Stock", count: 8, active: tab === "low", onClick: () => setTab("low") },
  ]}
  renderAdvancedFilters={
    <div className="grid grid-cols-3 gap-3">
      <UISelect label="Warehouse Hub" options={hubOptions} />
      <UIDatePicker label="Expiry Before" />
      <UIInput label="Max Price (₹)" type="number" />
    </div>
  }
>
  <UISelect options={categoryOptions} value={category} onChange={setCategory} className="w-40" />
</UIFilterBar>
```

---

### `UIActionBar` (#27)
Toolbar for table and page actions that smoothly transitions into a Bulk Selection Mode when items are checked.

```jsx
import { UIActionBar, UIButton, UIIconButton } from "@/components/ui";
import { Download, Plus, Trash2 } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Optional left toolbar title |
| `subtitle` | `string` | — | Subtitle beneath title |
| `leftActions` | `ReactNode` | — | Custom left action buttons / elements |
| `rightActions` | `ReactNode` | — | Custom right action buttons (Export, Add, etc.) |
| `showViewSwitcher` | `boolean` | `false` | Enables Table / Grid view switcher |
| `viewMode` | `"table"` \| `"grid"` \| `"cards"` | `"table"` | Active view mode |
| `onViewModeChange` | `function(mode)` | — | View change callback |
| `selectedCount` | `number` | `0` | **When > 0, switches to Bulk Selection Mode** |
| `totalCount` | `number` | — | Total count for "Select all (X)" trigger |
| `onSelectAll` | `function` | — | Select all callback |
| `onDeselectAll` | `function` | — | Clear selection `✕` callback |
| `bulkActions` | `ReactNode` | — | Custom bulk action buttons |
| `onBulkDelete` | `function` | — | Bulk delete button callback |
| `onBulkExport` | `function` | — | Bulk export button callback |
| `variant` | `"card"` \| `"floating"` \| `"sticky"` \| `"inline"` | `"card"` | Container placement mode |

#### Example

```jsx
<UIActionBar
  title="Batch Inventory Directory"
  subtitle="184 items found"
  selectedCount={selectedRowIds.length}
  totalCount={184}
  onDeselectAll={() => setSelectedRowIds([])}
  onBulkDelete={handleDeleteSelected}
  onBulkExport={handleExportSelected}
  rightActions={
    <>
      <UIButton variant="outline" size="sm" startIcon={<Download className="size-4" />}>
        Export CSV
      </UIButton>
      <UIButton variant="primary" size="sm" startIcon={<Plus className="size-4" />}>
        Add SKU
      </UIButton>
    </>
  }
/>
```

---

## 4. Form & Data Input Components

### `UIInput`
Form input control with prefix/suffix, password visibility toggle, clear button, and error state.

```jsx
import { UIInput } from "@/components/ui";
import { Mail, IndianRupee } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Top field label |
| `required` | `boolean` | `false` | Shows red `*` next to label |
| `type` | `string` | `"text"` | Input type (`text`, `password`, `email`, `number`, etc.) |
| `value` | `string` \| `number` | — | Controlled value |
| `defaultValue` | `string` \| `number` | — | Uncontrolled default value |
| `onChange` | `function(e)` | — | Change handler |
| `placeholder` | `string` | — | Placeholder text |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Input height (`sm`: 34px, `md`: 40px, `lg`: 46px) |
| `variant` | `"outline"` \| `"filled"` \| `"flushed"` | `"outline"` | Input container style |
| `startIcon` | `ReactNode` | — | Icon rendered inside the left edge |
| `prefix` | `string` | — | Text prefix (e.g. `₹` or `+91`) |
| `endIcon` | `ReactNode` | — | Icon rendered inside the right edge |
| `suffix` | `string` | — | Text suffix (e.g. `kg`, `units`, `mg`) |
| `isClearable` | `boolean` | `false` | Renders `✕` button when value is non-empty |
| `onClear` | `function` | — | Custom clear event callback |
| `showPasswordToggle` | `boolean` | `true` | Automatically shows eye peek icon when `type="password"` |
| `error` | `string` \| `boolean` | — | Error text shown beneath input (red highlight) |
| `helperText` | `string` | — | Informational text shown beneath input |
| `disabled` | `boolean` | `false` | Disables input |
| `readOnly` | `boolean` | `false` | Makes input read-only |
| `className` | `string` | — | Outer wrapper class |
| `containerClassName` | `string` | — | Input box container class |
| `inputClassName` | `string` | — | Native `<input>` class |

#### Example

```jsx
<UIInput
  label="Unit Price"
  required
  prefix="₹"
  suffix="/ strip"
  placeholder="0.00"
  type="number"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  helperText="Inclusive of 18% GST"
/>
```

---

### `UISearchInput`
Debounced search field with keyboard shortcut and instant clear.

```jsx
import { UISearchInput } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | `""` | Uncontrolled value |
| `onChange` | `function(e)` | — | Immediate change handler |
| `onSearch` | `function(query)` | — | **Debounced search trigger** (fires after `debounceMs`) |
| `debounceMs` | `number` | `300` | Milliseconds to wait before calling `onSearch` |
| `placeholder` | `string` | `"Search..."` | Placeholder text |
| `shortcut` | `string` | `"⌘K"` | Keyboard shortcut badge displayed on right |
| `enableShortcutListener` | `boolean` | `true` | Focuses search automatically when user presses `⌘K` or `/` |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Sizing matrix |
| `isLoading` | `boolean` | `false` | Replaces search icon with animated spinner |
| `isClearable` | `boolean` | `true` | Shows `✕` button when query exists |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | — | Wrapper class |

#### Example

```jsx
<UISearchInput
  placeholder="Search medicines, batch numbers, or compositions..."
  onSearch={(query) => fetchFilteredMedicines(query)}
  isLoading={isSearching}
  className="max-w-md"
/>
```

---

### `UISelect`
Accessible select dropdown with search filtering and 4-way collision flipping.

```jsx
import { UISelect } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Top label |
| `required` | `boolean` | `false` | Required asterisk |
| `options` | `Array<string \| { label: string, value: any, disabled?: boolean, icon?: ReactNode, description?: string }>` | `[]` | List of options |
| `value` | `any` | — | Controlled selected value |
| `defaultValue` | `any` | — | Uncontrolled default value |
| `onChange` | `function(value, optionObject)` | — | Selection callback |
| `placeholder` | `string` | `"Select an option"` | Trigger placeholder |
| `isSearchable` | `boolean` | `false` | Shows search filter bar inside popover |
| `isClearable` | `boolean` | `false` | Shows clear `✕` button |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Size scale |
| `placement` | `"auto"` \| `"bottom"` \| `"top"` | `"auto"` | Vertical placement (auto-flips on screen boundary) |
| `align` | `"auto"` \| `"left"` \| `"right"` | `"auto"` | Horizontal alignment |
| `error` | `string` \| `boolean` | — | Error message |
| `helperText` | `string` | — | Helper text |
| `renderOption` | `function(option, isSelected)` | — | Custom option renderer |
| `disabled` | `boolean` | `false` | Disables trigger |
| `className` | `string` | — | Outer wrapper class |

#### Example

```jsx
<UISelect
  label="Drug Schedule"
  required
  isSearchable
  options={[
    { label: "Schedule H (Prescription only)", value: "SCH_H" },
    { label: "Schedule H1 (Habit forming)", value: "SCH_H1" },
    { label: "Schedule X (Narcotics)", value: "SCH_X" },
    { label: "OTC (Over The Counter)", value: "OTC" }
  ]}
  value={schedule}
  onChange={(val) => setSchedule(val)}
/>
```

---

### `UIDatePicker`
Calendar date picker with quick presets (+30D Expiry, Today) and collision detection.

```jsx
import { UIDatePicker } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Top label |
| `required` | `boolean` | `false` | Required asterisk |
| `value` | `string` | — | Controlled date string (ISO / `YYYY-MM-DD`) |
| `defaultValue` | `string` | — | Default date value |
| `onChange` | `function(dateString)` | — | Date selection callback (`YYYY-MM-DD`) |
| `placeholder` | `string` | `"Select date..."` | Trigger placeholder |
| `format` | `string` | `"YYYY-MM-DD"` | Internal value format |
| `displayFormat` | `string` | `"DD MMM YYYY"` | Displayed text format (e.g. `24 Aug 2026`) |
| `presets` | `boolean` | `true` | Shows quick preset buttons (*Today, Yesterday, +30D, +90D, +1 Year*) |
| `customPresets` | `Array<{ label: string, getValue: () => string }>` | — | Custom preset definitions |
| `minDate` | `string` | — | Minimum selectable date (`YYYY-MM-DD`) |
| `maxDate` | `string` | — | Maximum selectable date (`YYYY-MM-DD`) |
| `isClearable` | `boolean` | `true` | Shows clear `✕` button |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Size scale |
| `placement` | `"auto"` \| `"bottom"` \| `"top"` | `"auto"` | 4-way collision flipping |
| `error` | `string` | — | Error text |
| `disabled` | `boolean` | `false` | Disables date picker |

#### Example

```jsx
<UIDatePicker
  label="Batch Expiry Date"
  required
  value={expiryDate}
  onChange={(date) => setExpiryDate(date)}
  minDate="2026-01-01"
  helperText="Must have at least 6 months shelf life"
/>
```

---

### `UICheckbox`
Spring pop checkmark with indeterminate state for select-all tables.

```jsx
import { UICheckbox } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` \| `ReactNode` | — | Checkbox label |
| `description` | `string` \| `ReactNode` | — | Sub-description under label |
| `checked` | `boolean` | — | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state |
| `indeterminate` | `boolean` | `false` | Displays minus (`-`) icon (for table "select all") |
| `onChange` | `function(checked, event)` | — | Toggle handler |
| `color` | `"primary"` \| `"success"` \| `"error"` \| `"warning"` | `"primary"` | Checked box theme |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Box size (`sm`: 16px, `md`: 18px, `lg`: 22px) |
| `error` | `string` \| `boolean` | — | Error message |
| `disabled` | `boolean` | `false` | Disables checkbox |
| `className` | `string` | — | Outer label wrapper class |

#### Example

```jsx
<UICheckbox
  label="Prescription Verification Required"
  description="Pharmacist must upload scanned Rx before dispensing this order."
  checked={requiresRx}
  onChange={(checked) => setRequiresRx(checked)}
/>
```

---

### `UISwitch`
Toggle switch with spring thumb stretch motion.

```jsx
import { UISwitch } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` \| `ReactNode` | — | Switch label |
| `description` | `string` \| `ReactNode` | — | Sub-description |
| `checked` | `boolean` | — | Controlled state |
| `defaultChecked` | `boolean` | `false` | Default state |
| `onChange` | `function(checked, event)` | — | Toggle handler |
| `color` | `"primary"` \| `"success"` \| `"warning"` \| `"error"` | `"primary"` | Active track color |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Switch size scale |
| `isLoading` | `boolean` | `false` | Shows spinner inside thumb |
| `checkedIcon` | `ReactNode` | — | Icon rendered inside thumb when ON |
| `uncheckedIcon` | `ReactNode` | — | Icon rendered inside thumb when OFF |
| `disabled` | `boolean` | `false` | Disables switch |

#### Example

```jsx
<UISwitch
  label="Auto-Reorder"
  description="Generate PO when stock drops below safety threshold."
  color="success"
  checked={autoReorder}
  onChange={(checked) => setAutoReorder(checked)}
/>
```

---

### `UIFormField` & `UIFormGrid`
Structured layout primitives for form inputs.

```jsx
import { UIFormField, UIFormGrid, UIInput, UISelect } from "@/components/ui";
```

#### `UIFormField` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Top field label |
| `required` | `boolean` | `false` | Required red `*` |
| `helperText` | `string` | — | Helper text beneath input |
| `error` | `string` | — | Error text beneath input |
| `info` | `string` \| `ReactNode` | — | Info tooltip icon next to label |
| `colSpan` | `1` \| `2` \| `3` \| `4` \| `"full"` | `1` | Grid column span |
| `children` | `ReactNode` | — | Input control |

#### `UIFormGrid` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `1` \| `2` \| `3` \| `4` | `2` | Number of responsive columns |
| `gap` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Grid gap (`sm`: 12-14px, `md`: 16-20px, `lg`: 20-24px) |
| `children` | `ReactNode` | — | `UIFormField` items |

#### Example

```jsx
<UIFormGrid columns={3} gap="md">
  <UIFormField label="Batch Number" required info="Printed on packaging">
    <UIInput placeholder="e.g. BTC-9921" />
  </UIFormField>
  <UIFormField label="Manufacture Date" required>
    <UIDatePicker />
  </UIFormField>
  <UIFormField label="Expiry Date" required>
    <UIDatePicker />
  </UIFormField>
</UIFormGrid>
```

---

### `UIFormSection`
Grouped card section for forms with optional collapsible drawer.

```jsx
import { UIFormSection, UIFormField, UIInput } from "@/components/ui";
import { Pill } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Section title |
| `description` | `string` | — | Supporting description |
| `icon` | `ReactNode` | — | Leading icon |
| `badge` | `ReactNode` | — | Status badge |
| `actions` | `ReactNode` | — | Top-right section actions |
| `columns` | `1` \| `2` \| `3` \| `4` | `2` | Form columns |
| `gap` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Form grid spacing |
| `variant` | `"card"` \| `"flat"` \| `"clean"` | `"card"` | Container frame style |
| `collapsible` | `boolean` | `false` | Enables collapse/expand accordion mode |
| `defaultExpanded` | `boolean` | `true` | Initial accordion state |
| `isExpanded` | `boolean` | — | Controlled accordion state |
| `onToggle` | `function(isExpanded)` | — | Toggle callback |
| `children` | `ReactNode` | — | `UIFormField` elements |

#### Example

```jsx
<UIFormSection
  title="Dosage & Packaging"
  description="Specify strength, pack size, and storage conditions."
  icon={<Pill className="size-4" />}
  columns={2}
  collapsible
>
  <UIFormField label="Strength (mg)">
    <UIInput placeholder="500" />
  </UIFormField>
  <UIFormField label="Pack Size">
    <UIInput placeholder="10 x 10 Tablets" />
  </UIFormField>
</UIFormSection>
```

---

### `UIFormActions`
Save / Cancel / Delete bar for forms and drawers.

```jsx
import { UIFormActions } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSave` | `function` | — | Save click handler (submits form) |
| `onCancel` | `function` | — | Cancel click handler |
| `onDelete` | `function` | — | If provided, renders Destructive Delete button on left |
| `onReset` | `function` | — | If provided, renders Reset button on left |
| `saveText` | `string` | `"Save Changes"` | Save button label |
| `cancelText` | `string` | `"Cancel"` | Cancel button label |
| `deleteText` | `string` | `"Delete"` | Delete button label |
| `saveVariant` | `"primary"` \| `"success"` | `"primary"` | Save button variant |
| `isLoading` | `boolean` | `false` | Shows spinner on Save button |
| `loadingText` | `string` | `"Saving..."` | Loading button text |
| `disabled` | `boolean` | `false` | Disables buttons |
| `position` | `"inline"` \| `"sticky"` \| `"floating"` | `"inline"` | Layout position (`sticky`: bottom sheet, `floating`: floating island) |
| `align` | `"right"` \| `"left"` \| `"center"` \| `"between"` | `"right"` | Content alignment |
| `statusMessage` | `string` | — | Status text displayed on the bottom bar |
| `statusType` | `"info"` \| `"success"` \| `"warning"` \| `"error"` | `"info"` | Status text color |
| `extraActions` | `ReactNode` | — | Extra buttons placed on the left side |

#### Example

```jsx
<UIFormActions
  position="sticky"
  onSave={handleSave}
  onCancel={handleCancel}
  onDelete={isEditMode ? handleDelete : undefined}
  isLoading={isSaving}
/>
```

---

### `UIFileUpload` (#40)
Drag-and-drop file upload zone and attachment manager for invoices, COA certificates, and prescription scans.

```jsx
import { UIFileUpload } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Array<File \| { id, name, size, type, url? }>` | `[]` | Controlled array of uploaded files |
| `onChange` | `function(files)` | — | File list update callback |
| `onUpload` | `function(addedFiles)` | — | Triggered when new files are dropped/selected |
| `accept` | `string` | `".pdf,.png,.jpg,.jpeg,.csv,.xlsx"` | Accepted file extension string |
| `maxSize` | `number` | `10` | Maximum file size in MB |
| `maxFiles` | `number` | `5` | Maximum number of files permitted |
| `multiple` | `boolean` | `true` | Allows multi-file selection |
| `disabled` | `boolean` | `false` | Disables upload zone |
| `title` | `string` | `"Upload Document or Invoice"` | Main dropzone title |
| `description` | `string` | — | Dropzone description |

#### Example

```jsx
<UIFileUpload
  value={invoices}
  onChange={setInvoices}
  accept=".pdf,.png,.jpg"
  maxSize={10}
  maxFiles={3}
  title="Upload Supplier Purchase Invoices"
  description="Drag & drop scanned PDF invoices or click to browse"
/>
```

---

## 5. Buttons & Interactive Triggers

### `UIButton`
Primary interactive action button with spring tap physics, 9 variants, and loading spinner.

```jsx
import { UIButton } from "@/components/ui";
import { Plus, Download } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary"` \| `"secondary"` \| `"outline"` \| `"ghost"` \| `"destructive"` \| `"soft"` \| `"success"` \| `"warning"` \| `"link"` | `"primary"` | Button styling |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | `"md"` | Standard 5-step ergonomic sizing |
| `rounded` | `"none"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"full"` | — | Border radius override |
| `isLoading` | `boolean` | `false` | Replaces icon with spinner, disables button |
| `loadingText` | `string` | — | Text to show during loading state |
| `startIcon` | `ReactNode` | — | Icon before text |
| `endIcon` | `ReactNode` | — | Icon after text |
| `fullWidth` | `boolean` | `false` | Stretches button to 100% container width |
| `disabled` | `boolean` | `false` | Disabled state |
| `type` | `"button"` \| `"submit"` \| `"reset"` | `"button"` | HTML button type |
| `onClick` | `function(e)` | — | Click handler |
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | Button label |

#### Example

```jsx
<UIButton
  variant="primary"
  size="md"
  startIcon={<Plus className="size-4" />}
  isLoading={isSubmitting}
  loadingText="Creating PO..."
  onClick={handleCreatePO}
>
  Create Purchase Order
</UIButton>
```

---

### `UIIconButton`
Compact icon-only button with shape presets, count badge pill, and tooltips.

```jsx
import { UIIconButton } from "@/components/ui";
import { Bell, MoreVertical, Trash2 } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | — | Icon component |
| `variant` | `"ghost"` \| `"soft"` \| `"outline"` \| `"primary"` \| `"secondary"` \| `"destructive"` \| `"success"` \| `"warning"` | `"ghost"` | Visual variant |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | `"md"` | Dimensions (`xs`: 28px, `sm`: 34px, `md`: 40px, `lg`: 46px, `xl`: 52px) |
| `shape` | `"rounded"` \| `"circle"` \| `"square"` | `"rounded"` | Shape format |
| `badge` | `boolean` \| `number` \| `string` | — | Badge indicator (`true`: dot, `5`: count pill) |
| `badgeColor` | `"error"` \| `"primary"` \| `"warning"` \| `"success"` | `"error"` | Badge pill color |
| `tooltip` | `string` | — | Accessible hover tooltip & title |
| `aria-label` | `string` | — | Screen reader label |
| `isLoading` | `boolean` | `false` | Replaces icon with spinner |
| `disabled` | `boolean` | `false` | Disables button |
| `onClick` | `function(e)` | — | Click handler |

#### Example

```jsx
<UIIconButton
  icon={<Bell className="size-4" />}
  variant="soft"
  badge={3}
  badgeColor="error"
  tooltip="3 Expiring Batches"
  onClick={() => openNotifications()}
/>
```

---

## 5. Navigation & Selection

### `UITabs`
Smooth tab switcher with Framer Motion spring sliding active indicator.

```jsx
import { UITabs } from "@/components/ui";
import { Package, ShieldAlert, History } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `Array<{ id: string \| number, label: string, icon?: ReactNode, badge?: string \| number, disabled?: boolean }>` | `[]` | Tab items list |
| `activeTab` | `string` \| `number` | — | Controlled active tab ID |
| `defaultTab` | `string` \| `number` | — | Default active tab ID |
| `onChange` | `function(tabId, tabObject)` | — | Tab switch handler |
| `variant` | `"pill"` \| `"segmented"` \| `"underline"` | `"pill"` | Visual indicator variant |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Tab height & typography scale |
| `fullWidth` | `boolean` | `false` | Equal width distribution across container |
| `layoutId` | `string` | — | Custom Framer Motion layoutId (defaults to unique auto ID) |
| `className` | `string` | — | Container class |

#### Example

```jsx
<UITabs
  variant="pill"
  tabs={[
    { id: "all", label: "All Items", badge: 142 },
    { id: "low_stock", label: "Low Stock", badge: 8, icon: <ShieldAlert className="size-4 text-warning" /> },
    { id: "history", label: "Audit Logs", icon: <History className="size-4" /> }
  ]}
  activeTab={activeTab}
  onChange={(id) => setActiveTab(id)}
/>
```

---

### `UIDropdown` & Suite
Context menu & action dropdown with 4-way collision flipping.

```jsx
import {
  UIDropdown,
  UIDropdownTrigger,
  UIDropdownMenu,
  UIDropdownItem,
  UIDropdownDivider,
  UIDropdownLabel,
  UIIconButton
} from "@/components/ui";
import { MoreVertical, Edit3, Copy, Trash2 } from "lucide-react";
```

#### Props

| Component | Prop | Type | Default | Description |
|---|---|---|---|---|
| `UIDropdown` | `placement` | `"auto"` \| `"bottom"` \| `"top"` | `"auto"` | Vertical placement |
| `UIDropdown` | `align` | `"auto"` \| `"right"` \| `"left"` | `"auto"` | Horizontal alignment |
| `UIDropdownTrigger` | `asChild` | `boolean` | `false` | Passes trigger handlers to single child |
| `UIDropdownMenu` | `width` | `string` | `"w-52"` | Tailwind width class |
| `UIDropdownItem` | `icon` | `ReactNode` | — | Item icon |
| `UIDropdownItem` | `shortcut` | `string` | — | Keyboard shortcut label (e.g. `⌘E`) |
| `UIDropdownItem` | `destructive` | `boolean` | `false` | Red text & hover styling |
| `UIDropdownItem` | `disabled` | `boolean` | `false` | Disables item |
| `UIDropdownItem` | `onClick` | `function` | — | Click handler (automatically closes menu) |

#### Example

```jsx
<UIDropdown placement="auto" align="right">
  <UIDropdownTrigger asChild>
    <UIIconButton icon={<MoreVertical className="size-4" />} variant="ghost" size="sm" tooltip="Actions" />
  </UIDropdownTrigger>
  <UIDropdownMenu width="w-48">
    <UIDropdownLabel>Manage Item</UIDropdownLabel>
    <UIDropdownItem icon={<Edit3 className="size-4" />} onClick={handleEdit}>
      Edit Details
    </UIDropdownItem>
    <UIDropdownItem icon={<Copy className="size-4" />} onClick={handleDuplicate}>
      Duplicate
    </UIDropdownItem>
    <UIDropdownDivider />
    <UIDropdownItem icon={<Trash2 className="size-4" />} destructive onClick={handleDelete}>
      Delete Batch
    </UIDropdownItem>
  </UIDropdownMenu>
</UIDropdown>
```

---

### `UIPagination`
Page navigation bar with rows-per-page dropdown and total records counter.

```jsx
import { UIPagination } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | `1` | Current active page (1-indexed) |
| `totalPages` | `number` | `1` | Total available pages |
| `totalItems` | `number` | — | Total count of records across all pages |
| `pageSize` | `number` | `10` | Records displayed per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Available page size selections |
| `onPageChange` | `function(pageNumber)` | — | Page change handler |
| `onPageSizeChange` | `function(newPageSize)` | — | Rows-per-page change handler |
| `siblingCount` | `number` | `1` | Number of siblings around current page before `...` |
| `showPageSize` | `boolean` | `true` | Displays rows-per-page dropdown |
| `showSummary` | `boolean` | `true` | Displays *"Showing 1 to 10 of 1,420 results"* |

#### Example

```jsx
<UIPagination
  page={page}
  totalPages={Math.ceil(totalCount / pageSize)}
  totalItems={totalCount}
  pageSize={pageSize}
  onPageChange={(newPage) => setPage(newPage)}
  onPageSizeChange={(newSize) => {
    setPageSize(newSize);
    setPage(1);
  }}
/>
```

---

## 7. KPI Metrics, Summaries & Structured Cards

### `UIStatCard` (#28)
High-impact KPI metric card with trend badges, comparative period subtitles, icon badge containers, sparkline previews, and loading skeletons.

```jsx
import { UIStatCard } from "@/components/ui";
import { DollarSign, ShoppingCart, ShieldAlert } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Metric title (e.g. `"Total Revenue"`) |
| `value` | `string` \| `number` | — | Formatted metric value (e.g. `"48.25"`) |
| `prefix` | `string` | — | Metric prefix (e.g. `"₹"`) |
| `suffix` | `string` | — | Metric suffix (e.g. `"Lakhs"`, `"POs"`, `"units"`) |
| `subtitle` | `string` | — | Comparative period text (e.g. `"vs ₹41.20L last month"`) |
| `icon` | `ReactNode` | — | Top-right icon element |
| `trend` | `{ value: string, direction: "up" \| "down" \| "neutral", label?: string }` | — | Percentage trend badge |
| `color` | `"primary"` \| `"success"` \| `"warning"` \| `"error"` \| `"info"` \| `"purple"` \| `"neutral"` | `"primary"` | Accent theme for icon |
| `variant` | `"default"` \| `"elevated"` \| `"flat"` \| `"interactive"` | `"default"` | Card elevation style (`interactive` has hover spring) |
| `badge` | `ReactNode` | — | Optional badge tag beneath title |
| `sparklineData` | `number[]` | — | Array of numbers rendered as mini SVG trendline |
| `progress` | `{ value: number, label?: string }` | — | Progress bar display (0-100) |
| `isLoading` | `boolean` | `false` | Renders zero-CLS skeleton placeholder |
| `onClick` | `function` | — | Click handler |

#### Example

```jsx
<UIStatCard
  title="Total Sales (MTD)"
  value="48.25"
  prefix="₹"
  suffix="Lakhs"
  subtitle="vs previous month"
  icon={<DollarSign />}
  color="success"
  variant="interactive"
  trend={{ value: "+17.1%", direction: "up" }}
  sparklineData={[30, 42, 38, 55, 60, 52, 68, 75, 84]}
  onClick={() => navigate("/analytics/sales")}
/>
```

---

### `UISummaryCard` (#29)
Compact financial summaries, multi-stat horizontal overview strips, invoice calculations, and order totals.

```jsx
import { UISummaryCard, UIButton } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Summary card title |
| `subtitle` | `string` | — | Supporting text |
| `items` | `Array<{ label: string, value: string \| number, subtext?: string, icon?: ReactNode, isHighlight?: boolean, isDeduction?: boolean }>` | `[]` | Breakdown items list |
| `total` | `{ label?: string, value: string \| number, subtext?: string, badge?: ReactNode }` | — | Highlighted total footer section |
| `variant` | `"card"` \| `"strip"` \| `"compact"` \| `"flat"` | `"card"` | `"strip"` renders horizontal condensed metric row |
| `action` | `ReactNode` | — | Bottom CTA button (e.g. `<UIButton>Pay Now</UIButton>`) |
| `footer` | `ReactNode` | — | Bottom metadata footer slot |

#### Example

```jsx
{/* 1. Multi-stat Horizontal Overview Strip */}
<UISummaryCard
  variant="strip"
  items={[
    { label: "Total Billed", value: "₹ 1,84,500", isHighlight: true },
    { label: "Collected", value: "₹ 1,42,000" },
    { label: "Pending Dues", value: "₹ 42,500", isDeduction: true },
    { label: "Net Margin", value: "24.8%" },
  ]}
/>

{/* 2. Vertical Invoice Calculation Card */}
<UISummaryCard
  title="Invoice Billing Summary"
  items={[
    { label: "Gross Subtotal", value: "₹ 86,400.00" },
    { label: "Trade Discount (5%)", value: "₹ 4,320.00", isDeduction: true },
    { label: "CGST (6%)", value: "₹ 4,924.80" },
    { label: "SGST (6%)", value: "₹ 4,924.80" },
  ]}
  total={{
    label: "Net Payable",
    value: "₹ 91,929.60",
    subtext: "Includes all statutory taxes",
  }}
  action={<UIButton fullWidth>Confirm Invoice</UIButton>}
/>
```

---

### `UIInfoCard` (#30)
Display structured information, vendor profiles, drug compliance notices, and expandable details.

```jsx
import { UIInfoCard, UIBadge } from "@/components/ui";
import { AlertTriangle, Building2 } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Info card title |
| `description` | `string` | — | Supporting text |
| `icon` | `ReactNode` | `<Info />` | Leading icon element |
| `color` | `"primary"` \| `"success"` \| `"warning"` \| `"error"` \| `"info"` \| `"purple"` \| `"neutral"` | `"primary"` | Color theme |
| `variant` | `"default"` \| `"accent"` \| `"soft"` \| `"outlined"` | `"default"` | Accent border / soft tinted style |
| `badge` | `ReactNode` | — | Status badge next to title |
| `items` | `Array<{ label: string, value: string \| ReactNode, mono?: boolean }>` | `[]` | Structured key-value details grid |
| `collapsible` | `boolean` | `false` | Enables collapsible accordion body |
| `defaultExpanded` | `boolean` | `true` | Initial accordion state |
| `onDismiss` | `function` | — | Renders `✕` dismiss button on right |
| `actions` | `ReactNode` | — | Action buttons slot in header |
| `footer` | `ReactNode` | — | Bottom metadata footer slot |

#### Example

```jsx
<UIInfoCard
  variant="accent"
  color="warning"
  icon={<AlertTriangle className="size-4" />}
  title="Schedule H1 Dispenser Compliance"
  description="Maintain strict dual-signature dispenser registry."
  collapsible
  badge={<UIBadge label="Mandatory" color="warning" size="xs" />}
  items={[
    { label: "Regulatory Class", value: "Schedule H1 / Rx", mono: true },
    { label: "Dispenser License", value: "DL-20B/21B-4921", mono: true },
    { label: "Retention Period", value: "3 Years Records" },
  ]}
/>
```

---

### `UIDetailRow` (#31)
Micro-component for displaying structured `Label → Value` pairs across forms, details drawers, and invoice cards.

```jsx
import { UIDetailRow, UIBadge } from "@/components/ui";
import { Hash, Building2 } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Left label text |
| `value` | `string` \| `number` \| `ReactNode` | — | Right formatted value |
| `icon` | `ReactNode` | — | Leading icon next to label |
| `helpText` | `string` | — | Tooltip help icon next to label |
| `copyable` | `boolean` | `false` | Enables click-to-copy button with checkmark feedback |
| `copyValue` | `string` | — | Custom text to copy (defaults to `value`) |
| `mono` | `boolean` | `false` | Formats value in `font-mono tabular-nums` |
| `badge` | `ReactNode` | — | Inline status badge next to value |
| `href` | `string` | — | Formats value as external/internal hyperlink |
| `onClick` | `function` | — | Makes value clickable |
| `variant` | `"horizontal"` \| `"vertical"` \| `"inline"` | `"horizontal"` | Row orientation layout |
| `divider` | `"border"` \| `"dashed"` \| `"dotted"` \| `"none"` | `"border"` | Bottom separator style |
| `highlight` | `"default"` \| `"highlight"` \| `"subdued"` \| `"success"` \| `"warning"` \| `"error"` | `"default"` | Semantic value highlight style |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Row padding & typography scale |
| `labelWidth` | `string` | — | Optional custom width (e.g. `"w-40"`) |

#### Example

```jsx
<UIDetailRow
  label="GSTIN Number"
  value="27AABCA1234F1Z8"
  mono
  copyable
  size="md"
  divider="border"
/>
<UIDetailRow
  label="Credit Limit"
  value="₹ 5,00,000.00"
  highlight="highlight"
  mono
/>
```

---

### `UIKeyValueList` (#32)
Structured container for grouping multiple key-value rows with grid, striped, and card presets.

```jsx
import { UIKeyValueList } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Optional section header title |
| `subtitle` | `string` | — | Supporting description beneath title |
| `items` | `Array<{ label, value, icon?, helpText?, copyable?, mono?, badge?, href?, highlight? }>` | `[]` | Array of row definitions |
| `layout` | `"list"` \| `"grid"` \| `"striped"` \| `"card"` \| `"bordered"` | `"list"` | Container layout mode |
| `columns` | `1` \| `2` \| `3` \| `4` | `2` | Number of columns when `layout="grid"` |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Row height scale |
| `divider` | `"border"` \| `"dashed"` \| `"dotted"` \| `"none"` | `"border"` | Row separator style |
| `allowCopyAll` | `boolean` | `false` | Adds "Copy All" button in header (serializes all rows to clipboard) |
| `collapsible` | `boolean` | `false` | Enables collapsible accordion drawer |
| `defaultExpanded` | `boolean` | `true` | Initial accordion state |
| `emptyMessage` | `string` | `"No details available"` | Empty state text |
| `actions` | `ReactNode` | — | Right header action buttons |

#### Example

```jsx
<UIKeyValueList
  title="Batch Master Record"
  layout="grid"
  columns={2}
  allowCopyAll
  collapsible
  items={[
    { label: "Batch No", value: "BT-9912", mono: true, copyable: true },
    { label: "Manufacturing Date", value: "14 Jul 2026" },
    { label: "Expiry Date", value: "30 Jun 2028", highlight: "success" },
    { label: "MRP", value: "₹ 145.00", highlight: "highlight", mono: true },
  ]}
/>
```

---

## 8. Data Display & Badges

### `UIBadge`
Color-coded status chip with pulse dot and dismiss options.

```jsx
import { UIBadge } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` \| `children` | `string` \| `ReactNode` | — | Badge text content |
| `variant` | `"soft"` \| `"solid"` \| `"outline"` \| `"dot"` | `"soft"` | Visual style (`dot` includes colored status circle) |
| `color` | `"primary"` \| `"success"` \| `"warning"` \| `"error"` \| `"info"` \| `"neutral"` \| `"purple"` | `"primary"` | Semantic color token |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` | `"md"` | Size scale |
| `shape` | `"pill"` \| `"rounded"` \| `"square"` | `"pill"` | Corner radius |
| `pulse` | `boolean` | `false` | Enables animated ping/pulse ring on the dot |
| `icon` | `ReactNode` | — | Leading icon (not shown when `variant="dot"`) |
| `onDismiss` | `function` | — | Renders `✕` dismiss button on right |

#### Example

```jsx
{/* Live status with pulsing dot */}
<UIBadge label="In Transit" color="warning" variant="dot" pulse />

{/* Solid confirmation badge */}
<UIBadge label="Verified" color="success" variant="solid" icon={<CheckCircle2 className="size-3" />} />
```

---

### `UIStatusIndicator` (#33)
Active, inactive, pending, expired, and quarantined status indicator system with pulsing glowing dots and badges.

```jsx
import { UIStatusIndicator } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `"active"` \| `"inactive"` \| `"pending"` \| `"draft"` \| `"expired"` \| `"quarantined"` \| `"processing"` \| `"success"` \| `"warning"` \| `"error"` \| `"info"` | `"active"` | Semantic preset |
| `label` | `string` | — | Custom status text override |
| `variant` | `"dot"` \| `"badge"` \| `"solid"` \| `"outline"` \| `"bar"` | `"dot"` | Visual display style |
| `size` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` | `"md"` | Indicator sizing scale |
| `pulse` | `boolean` | `false` | Enables animated glowing ping/pulse effect |
| `showIcon` | `boolean` | `false` | Shows status icon instead of dot in badge/solid |
| `icon` | `ReactNode` | — | Custom icon override |

#### Example

```jsx
{/* Glowing live active dot */}
<UIStatusIndicator status="active" variant="dot" pulse />

{/* Soft capsule badge */}
<UIStatusIndicator status="pending" variant="badge" size="sm" />

{/* Critical expired status */}
<UIStatusIndicator status="expired" variant="solid" />

{/* Vertical card accent bar */}
<UIStatusIndicator status="quarantined" variant="bar" />
```

---

### `UITable` & Suite
Modular data table components with sorting, empty states, and loading skeletons.

```jsx
import {
  UITable,
  UITableHeader,
  UITableBody,
  UITableRow,
  UITableHead,
  UITableCell,
  UITableEmpty,
  UITableLoading,
  UIBadge,
  UIButton
} from "@/components/ui";
```

#### Sub-components & Props

- **`UITable`**: `containerClassName`, `stickyHeader`, `className`
- **`UITableRow`**: `selected` (`boolean`), `hoverable` (`boolean`, default `true`)
- **`UITableHead`**: `sortable` (`boolean`), `sortDirection` (`"asc"` \| `"desc"` \| `null`), `onSort` (`function`), `align` (`"left"` \| `"center"` \| `"right"`)
- **`UITableCell`**: `align` (`"left"` \| `"center"` \| `"right"`), `mono` (`boolean`, uses tabular numbers)
- **`UITableEmpty`**: `colSpan`, `title`, `description`, `icon`, `action`
- **`UITableLoading`**: `colSpan`, `rows` (default `3`)

#### Example

```jsx
<UITable>
  <UITableHeader>
    <UITableRow>
      <UITableHead sortable sortDirection={sortCol === "name" ? sortDir : null} onSort={() => handleSort("name")}>
        Medicine Name
      </UITableHead>
      <UITableHead>Batch</UITableHead>
      <UITableHead align="right">Stock</UITableHead>
      <UITableHead align="center">Status</UITableHead>
      <UITableHead align="right">Actions</UITableHead>
    </UITableRow>
  </UITableHeader>
  <UITableBody>
    {isLoading ? (
      <UITableLoading colSpan={5} rows={5} />
    ) : items.length === 0 ? (
      <UITableEmpty
        colSpan={5}
        title="No batches found"
        description="Try adjusting your filters or add a new batch."
        action={<UIButton size="sm">Add Batch</UIButton>}
      />
    ) : (
      items.map((item) => (
        <UITableRow key={item.id}>
          <UITableCell className="font-semibold">{item.name}</UITableCell>
          <UITableCell mono>{item.batchNumber}</UITableCell>
          <UITableCell align="right" mono>{item.quantity} strips</UITableCell>
          <UITableCell align="center">
            <UIBadge
              label={item.status}
              color={item.status === "Active" ? "success" : "warning"}
              variant="dot"
            />
          </UITableCell>
          <UITableCell align="right">
            <UIButton variant="ghost" size="xs">Edit</UIButton>
          </UITableCell>
        </UITableRow>
      ))
    )}
  </UITableBody>
</UITable>
```

---

## 7. Feedback & Overlays

### `UIModal` & Suite
Dialog modal with backdrop blur, scroll locking, and spring scale entrance.

```jsx
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIModalFooter,
  UIButton
} from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | `false` | Controls open/closed visibility |
| `onClose` | `function` | — | Close callback |
| `size` | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"full"` | `"md"` | Max width (`sm`: 448px, `md`: 512px, `lg`: 672px, `xl`: 896px, `full`: viewport) |
| `closeOnBackdrop` | `boolean` | `true` | Clicking dark backdrop triggers `onClose` |
| `closeOnEsc` | `boolean` | `true` | Pressing Escape triggers `onClose` |
| `showCloseButton` | `boolean` | `true` | Renders `✕` icon in top-right corner |
| `overlayClassName` | `string` | — | Custom backdrop styling |
| `className` | `string` | — | Custom dialog container styling |

#### Example

```jsx
<UIModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
  <UIModalHeader>
    <UIModalTitle>Add Stock Adjustment</UIModalTitle>
    <UIModalDescription>Record inventory breakage, expiration, or physical audit variance.</UIModalDescription>
  </UIModalHeader>
  <UIModalBody>
    {/* Form contents */}
  </UIModalBody>
  <UIModalFooter>
    <UIButton variant="outline" onClick={() => setIsModalOpen(false)}>
      Cancel
    </UIButton>
    <UIButton variant="primary" onClick={handleSaveAdjustment}>
      Confirm Adjustment
    </UIButton>
  </UIModalFooter>
</UIModal>
```

---

### `UIEmptyState`
Standard empty state display for empty tables, search results, or unconfigured settings.

```jsx
import { UIEmptyState } from "@/components/ui";
import { PackageOpen, Plus } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"No Records Found"` | Main empty title |
| `description` | `string` | — | Explanation text |
| `icon` | `ReactNode` | `<PackageOpen />` | Center icon badge |
| `iconColor` | `"primary"` \| `"success"` \| `"warning"` \| `"error"` \| `"neutral"` | `"primary"` | Icon container color token |
| `actionText` | `string` | — | Primary CTA button text |
| `onAction` | `function` | — | Primary CTA click handler |
| `actionVariant` | `string` | `"primary"` | Primary CTA button variant |
| `actionIcon` | `ReactNode` | — | Primary CTA button icon |
| `secondaryText` | `string` | — | Secondary button text |
| `onSecondaryAction` | `function` | — | Secondary button click handler |
| `variant` | `"card"` \| `"dashed"` \| `"inline"` | `"card"` | Container style |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Sizing scale |

#### Example

```jsx
<UIEmptyState
  variant="dashed"
  title="No Purchase Orders Yet"
  description="You haven't created any purchase orders this month. Start by ordering from registered vendors."
  actionText="New Purchase Order"
  actionIcon={<Plus className="size-4" />}
  onAction={() => navigate("/purchases/new")}
/>
```

---

### `UISkeleton` & Suite (#35)
Zero-CLS (Cumulative Layout Shift = 0) loading placeholders mimicking real content structures.

```jsx
import {
  UISkeleton,
  UISkeletonText,
  UISkeletonAvatar,
  UISkeletonButton,
  UISkeletonCard,
  UISkeletonTable,
  UISkeletonForm,
  UISkeletonKpi,
} from "@/components/ui";
```

#### Sub-components & Props

- **`UISkeleton`**: `variant` (`"text"` \| `"rectangular"` \| `"circular"` \| `"rounded"`), `animation` (`"shimmer"` \| `"pulse"` \| `"none"`), `width`, `height`, `className`, `style`
- **`UISkeletonText`**: `lines` (default `3`), `gap` (default `"gap-2.5"`), `lastLineWidth` (default `"65%"`), `height` (default `"h-3.5"`)
- **`UISkeletonAvatar`**: `size` (`"sm"` \| `"md"` \| `"lg"` \| `"xl"`), `shape` (`"circular"` \| `"rounded"`)
- **`UISkeletonButton`**: `size` (`"sm"` \| `"md"` \| `"lg"`), `width` (default `"w-28"`)
- **`UISkeletonCard`**: `hasHeader` (`boolean`), `hasFooter` (`boolean`), `lines` (default `3`)
- **`UISkeletonTable`**: `rows` (default `5`), `columns` (default `4`), `hasToolbar` (`boolean`), `hasPagination` (`boolean`)
- **`UISkeletonForm`**: `fields` (default `4`), `columns` (`1` \| `2`), `hasActions` (`boolean`)
- **`UISkeletonKpi`**: Full metric KPI card placeholder with title, value, and sparkline slot

#### Example

```jsx
{/* 1. Atomic text placeholder */}
<UISkeletonText lines={4} lastLineWidth="40%" />

{/* 2. Compound table skeleton */}
{isLoading ? <UISkeletonTable rows={6} columns={5} /> : <MyDataTable />}

{/* 3. Compound card skeleton */}
{isLoading ? <UISkeletonCard /> : <MyCardContent />}
```

---

### `UIAlert` (#36)
System message banners for warnings, error callouts, success confirmations, and regulatory compliance notices.

```jsx
import { UIAlert, UIButton } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"info"` \| `"success"` \| `"warning"` \| `"error"` \| `"purple"` \| `"neutral"` | `"info"` | Semantic color preset |
| `variant` | `"soft"` \| `"accent"` \| `"solid"` \| `"outlined"` | `"soft"` | Visual container styling |
| `title` | `string` | — | Alert headline |
| `description` | `string` \| `ReactNode` | — | Supporting body description |
| `icon` | `ReactNode` | — | Leading icon element override |
| `showIcon` | `boolean` | `true` | Toggles icon visibility |
| `dismissible` | `boolean` | `false` | Shows `✕` dismiss button |
| `onDismiss` | `function` | — | Dismiss callback |
| `action` | `ReactNode` | — | Right/bottom action CTA button |
| `details` | `string` \| `ReactNode` | — | Expandable technical diagnostics accordion |

#### Example

```jsx
<UIAlert
  type="warning"
  variant="accent"
  title="Schedule H1 Drug Compliance Reminder"
  description="Dispensing this formulation requires recording patient prescription number."
  dismissible
  action={<UIButton size="xs" variant="warning">Open Dispenser Log</UIButton>}
/>
```

---

### `UIToast` & `UIToastContainer` (#37)
Global ephemeral notification toast system with animated countdown progress timers and async promise support.

```jsx
import { UIToastContainer, uiToast } from "@/components/ui";
```

#### Global Triggers

```jsx
// 1. Semantic Triggers
uiToast.success("Stock Inward Verified", "500 strips added to inventory");
uiToast.error("Payment Failed", "Insufficient credit balance");
uiToast.warning("Near Expiry Warning", "Batch BT-8812 has 28 days remaining");
uiToast.info("Backup Completed", "Snapshot saved to cloud");

// 2. Async Promise Trigger
uiToast.promise(apiCallPromise, {
  loading: { title: "Generating E-Way Bill..." },
  success: { title: "E-Way Bill Generated!" },
  error: { title: "Generation Failed", description: (err) => err.message },
});

// 3. Clear All
uiToast.clearAll();
```

---

### `UITooltip` (#38)
Lightweight floating tooltip with 4-way collision auto-flipping and keyboard shortcut badges.

```jsx
import { UITooltip, UIButton } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `string` \| `ReactNode` | — | Tooltip text content |
| `shortcut` | `string` | — | Keyboard shortcut badge (e.g. `"⌘K"`, `"Esc"`) |
| `placement` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"top"` | Preferred orientation (auto-flips on collision) |
| `delay` | `number` | `150` | Open delay in ms |
| `arrow` | `boolean` | `true` | Shows directional pointer arrow |
| `disabled` | `boolean` | `false` | Disables tooltip |

#### Example

```jsx
<UITooltip content="Search medicines & batches" shortcut="⌘K" placement="top">
  <UIButton variant="outline">Search Catalogs</UIButton>
</UITooltip>
```

---

### `UIDrawer` (#39)
Slide-over side sheet panel for fast forms, detail views, batch inspections, and quick edits.

```jsx
import { UIDrawer, UIButton, UIInput, UIBadge } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | `false` | Open state |
| `onClose` | `function` | — | Close callback |
| `position` | `"right"` \| `"left"` \| `"bottom"` \| `"top"` | `"right"` | Slide-over orientation |
| `size` | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"full"` | `"md"` | Drawer width/height scale |
| `title` | `string` | — | Header title |
| `description` | `string` | — | Header description |
| `badge` | `ReactNode` | — | Header status badge tag |
| `footer` | `ReactNode` | — | Sticky bottom actions footer slot |
| `closeOnBackdrop` | `boolean` | `true` | Closes on backdrop click |
| `closeOnEsc` | `boolean` | `true` | Closes on Escape key press |

#### Example

```jsx
<UIDrawer
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  title="Batch QA Audit & Sign-off"
  description="Batch BT-2026-AUG-9912"
  badge={<UIBadge label="Pending" color="warning" size="xs" />}
  footer={
    <>
      <UIButton variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</UIButton>
      <UIButton variant="primary" onClick={handleApprove}>Approve & Release</UIButton>
    </>
  }
>
  <div className="space-y-4">
    <UIInput label="Pharmacist Name" defaultValue="Devansh Upadhyay" />
    <UIInput label="Disintegration Time" suffix="mins" defaultValue={4.5} />
  </div>
</UIDrawer>
```

---

## 10. Charts & KPI Metrics

### `AppKpiCard`
Metric card with trend badges, comparative period subtitles, and sparklines.

```jsx
import { AppKpiCard } from "@/components/charts";
import { DollarSign } from "lucide-react";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Metric title (e.g. `"Total Revenue"`) |
| `value` | `string` \| `number` | — | Formatted metric value (e.g. `"₹ 4,82,900"`) |
| `subtitle` | `string` | — | Context label (e.g. `"vs last month"`) |
| `icon` | `ReactNode` | — | Leading metric icon |
| `trend` | `{ value: string, direction: "up" \| "down" \| "neutral", label?: string }` | — | Percentage trend indicator |
| `badge` | `string` \| `ReactNode` | — | Top badge tag |
| `variant` | `"surface"` \| `"soft"` \| `"outlined"` | `"surface"` | Card appearance |
| `colorVariant` | `"primary"` \| `"success"` \| `"error"` \| `"warning"` \| `"info"` | `"primary"` | Accent theme |
| `loading` | `boolean` | `false` | Renders skeleton placeholder |
| `onClick` | `function` | — | Makes KPI card interactive and clickable |

#### Example

```jsx
<AppKpiCard
  title="Monthly Revenue"
  value="₹ 12,45,800"
  subtitle="vs previous month"
  icon={<DollarSign />}
  trend={{ value: "+14.2%", direction: "up" }}
  colorVariant="success"
/>
```

---

### Standard Chart Suite
Located in `@/components/charts`:
- `AppBarChart`: Categorical bar comparison
- `AppLineChart`: Time-series trend lines
- `AppAreaChart`: Gradient area volume
- `AppPieChart` & `AppDonutChart`: Distribution breakdowns
- `AppSparkline`: Mini inline chart for tables/cards

---

## 11. Pre-built Confirmation Dialogs

### `UIConfirmDialog` (#34)
Enterprise confirmation dialog for destructive actions, invoice cancellations, and critical state changes.

```jsx
import { UIConfirmDialog } from "@/components/ui";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | `false` | Modal open state |
| `onClose` | `function` | — | Close modal callback |
| `onConfirm` | `function` | — | Confirm action callback |
| `title` | `string` | `"Confirm Action"` | Modal headline title |
| `description` | `string` | — | Supporting warning/explanation text |
| `intent` | `"danger"` \| `"warning"` \| `"info"` \| `"success"` | `"danger"` | Visual intent & accent theme |
| `confirmText` | `string` | — | Custom confirm button label |
| `cancelText` | `string` | `"Cancel"` | Cancel button label |
| `itemName` | `string` | — | Name of target entity being modified/deleted |
| `itemDetails` | `string` | — | Secondary metadata line in target box |
| `requireInput` | `boolean` | `false` | Requires user to type confirmation phrase to unlock CTA |
| `confirmPhrase` | `string` | `"DELETE"` | Target phrase required when `requireInput={true}` |
| `isLoading` | `boolean` | `false` | Shows loading spinner on confirm button |

#### Example

```jsx
<UIConfirmDialog
  isOpen={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={handleDeleteBatch}
  intent="danger"
  title="Permanently Delete Batch BT-9912?"
  description="This will erase all batch records and linked stock ledgers from the system."
  itemName="Augmentin 625 Duo — 10,000 Strips"
  requireInput
  confirmPhrase="DELETE"
  isLoading={isDeleting}
/>
```

---

### Legacy `ConfirmDialog` & `DeleteConfirmDialog`

```jsx
import { ConfirmDialog, DeleteConfirmDialog } from "@/components/shared/dialogs";
```

#### `DeleteConfirmDialog` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Open state |
| `onClose` | `function` | — | Close handler |
| `onConfirm` | `function` | — | Confirm deletion handler |
| `title` | `string` | `"Delete Item"` | Dialog title |
| `itemName` | `string` | — | Name of entity being deleted (e.g. `"Batch BTC-901"`) |
| `warningText` | `string` | — | Additional warning message |
| `loading` | `boolean` | `false` | Loading state during deletion |

#### Example

```jsx
<DeleteConfirmDialog
  open={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={handleConfirmDelete}
  itemName={`Batch #${selectedBatch?.number}`}
  loading={isDeleting}
/>
```

---

## 10. Standard Page Assembly Recipe

Whenever creating a standard ERP management page, assemble components in this canonical order:

```jsx
import React, { useState } from "react";
import {
  UIPageHeader,
  UIButton,
  UIBadge,
  UITabs,
  UISearchInput,
  UISelect,
  UITable,
  UITableHeader,
  UITableBody,
  UITableRow,
  UITableHead,
  UITableCell,
  UITableEmpty,
  UITableLoading,
  UIPagination,
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIFormGrid,
  UIFormField,
  UIInput
} from "@/components/ui";
import { AppKpiCard } from "@/components/charts";
import { Plus, Download, Filter, Package } from "lucide-react";

export default function StockListPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Page Header */}
      <UIPageHeader
        title="Stock Inventory"
        description="Real-time pharmaceutical warehouse inventory & expiry tracking."
        badge={<UIBadge label="3,840 Items" color="primary" variant="soft" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Inventory" }
        ]}
        actions={
          <>
            <UIButton variant="outline" size="sm" startIcon={<Download className="size-4" />}>
              Export
            </UIButton>
            <UIButton
              variant="primary"
              size="sm"
              startIcon={<Plus className="size-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Stock
            </UIButton>
          </>
        }
      />

      {/* 2. Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppKpiCard title="Total Stock Units" value="84,200" trend={{ value: "+5.4%", direction: "up" }} colorVariant="primary" />
        <AppKpiCard title="Low Stock Items" value="14" trend={{ value: "-2", direction: "down" }} colorVariant="warning" />
        <AppKpiCard title="Expiring in 30 Days" value="6" colorVariant="error" />
        <AppKpiCard title="Total Valuation" value="₹ 48.2L" colorVariant="success" />
      </div>

      {/* 3. Filter Toolbar & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <UITabs
          variant="pill"
          tabs={[
            { id: "all", label: "All Items", badge: 840 },
            { id: "low", label: "Low Stock", badge: 14 },
            { id: "expired", label: "Near Expiry", badge: 6 }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="flex items-center gap-2">
          <UISearchInput
            placeholder="Search SKU or batch..."
            onSearch={setSearch}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* 4. Data Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <UITable>
          <UITableHeader>
            <UITableRow>
              <UITableHead sortable>Medicine</UITableHead>
              <UITableHead>Batch No.</UITableHead>
              <UITableHead align="right">Available Qty</UITableHead>
              <UITableHead align="center">Status</UITableHead>
              <UITableHead align="right">Actions</UITableHead>
            </UITableRow>
          </UITableHeader>
          <UITableBody>
            {/* Table Rows or UITableEmpty */}
          </UITableBody>
        </UITable>

        {/* 5. Pagination */}
        <UIPagination
          page={page}
          totalPages={10}
          totalItems={100}
          onPageChange={setPage}
        />
      </div>

      {/* 6. Form / Detail Modal */}
      <UIModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <UIModalHeader>
          <UIModalTitle>Add Stock Item</UIModalTitle>
        </UIModalHeader>
        <UIModalBody>
          <UIFormGrid columns={2}>
            <UIFormField label="Medicine Name" required colSpan={2}>
              <UIInput placeholder="e.g. Paracetamol 650mg" />
            </UIFormField>
            <UIFormField label="Batch Number" required>
              <UIInput placeholder="BTC-102" />
            </UIFormField>
            <UIFormField label="Quantity" required>
              <UIInput type="number" placeholder="100" />
            </UIFormField>
          </UIFormGrid>
        </UIModalBody>
        <UIModalFooter>
          <UIButton variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </UIButton>
          <UIButton variant="primary" onClick={() => setIsModalOpen(false)}>
            Save Stock
          </UIButton>
        </UIModalFooter>
      </UIModal>
    </div>
  );
}
```
