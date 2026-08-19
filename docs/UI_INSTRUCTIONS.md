# UI Build Instructions — PharmaERP

> Quick-reference operating instructions for building any UI in this project.
> For the full guide, see [UI_GUIDE.md](./UI_GUIDE.md).

---

## CRITICAL RULE — READ FIRST

> **NEVER use any existing `App*` components when building fresh UI.**
>
> Do NOT import or use: `AppButton`, `AppInput`, `AppCard`, `AppHeading`, `AppText`,
> `AppTable`, `AppForm`, `AppFormField`, `AppAlert`, `AppSkeleton`, `AppModal`,
> `AppBox`, or any other pre-existing component from `@/components`.
>
> **The workflow is always:**
> 1. Build new reusable primitive components from scratch first
> 2. Only then build feature pages using those new primitives
>
> This ensures the UI is fresh, intentional, and consistent with the new design system
> rather than inheriting legacy MUI-wrapped component styles.

---

## The Two-Phase Build Workflow

Every UI build follows two mandatory phases. Do NOT skip Phase 1.

```
PHASE 1 — Build Primitives First
  Create reusable base components using only:
  - Tailwind CSS v4 utility classes
  - shadcn/ui Radix primitives (raw, from src/components/ui/)
  - Lucide React icons
  - Framer Motion (for animation)
  - CSS custom properties (var(--app-color-*))
  Nothing else.

PHASE 2 — Build Feature Pages
  Build desktop and mobile pages using ONLY the
  components you created in Phase 1.
  Import from your new component module, not @/components.
```

---

## Step 0: Before You Write Any Code

Read these files first:

1. `.agent/skills/ui-ux-pro-max/SKILL.md` — design system generation tool
2. `docs/UI_GUIDE.md` — full project UI specification
3. `PRODUCT.md` — product context and user personas
4. `src/index.css` — all design tokens (CSS variables and Tailwind theme)
5. `src/theme/tokens.js` — all 5 theme color definitions

---

## Step 1: Run the Design System Tool

Before building, generate a design system recommendation:

```bash
cd .agent
python3 skills/ui-ux-pro-max/scripts/search.py "enterprise ERP pharma healthcare dashboard" --design-system -p "PharmaERP" -f markdown

# shadcn stack specifics
python3 skills/ui-ux-pro-max/scripts/search.py "data table form enterprise" --stack shadcn

# UX best practices
python3 skills/ui-ux-pro-max/scripts/search.py "animation accessibility keyboard" --domain ux
```

Available stacks: `html-tailwind`, `react`, `nextjs`, `shadcn`, `react-native`
Available domains: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`

---

## Step 2: Plan Which Primitives You Need

Before writing a single page, list every UI element your feature requires. Then build each one as a standalone reusable component.

### Primitive checklist for a typical List page

```
[ ] Button         — primary, outlined, ghost, destructive variants
[ ] IconButton     — icon-only clickable button
[ ] Badge          — status indicator (active, inactive, suspended)
[ ] SearchInput    — search field with icon
[ ] SelectFilter   — dropdown filter for status, category, etc.
[ ] DataCard       — mobile list item card (tappable, with info rows)
[ ] EmptyState     — zero-results illustration + message + CTA
[ ] LoadingSkeleton — card or table row placeholder
[ ] PageHeader     — title + subtitle + primary action button
[ ] Toolbar        — filter row container
```

### Primitive checklist for a typical Form page

```
[ ] Button         — (reuse from above)
[ ] TextInput      — labeled text field with error state
[ ] SelectInput    — labeled dropdown with error state
[ ] FormField      — label + input + hint + error message wrapper
[ ] FormSection    — titled group of fields with optional divider
[ ] FormGrid       — 2-column desktop / 1-column mobile grid
[ ] StickyFormBar  — bottom-fixed submit/cancel row (mobile)
[ ] ErrorSummary   — top-of-form validation error list
```

---

## Step 3: Build Primitives (Phase 1)

### Where to put new primitives

Create a dedicated folder for the feature's local primitives, or add to the shared design system folder if they will be used across features:

```
src/features/<feature>/components/
  Button.jsx
  Badge.jsx
  DataCard.jsx
  SearchInput.jsx
  ...

# OR for shared use across multiple features:
src/design-system/
  Button.jsx
  Badge.jsx
  Input.jsx
  ...
```

### How to build a primitive — the rules

1. **Use only Tailwind v4 utility classes** for all styling
2. **Use `var(--app-color-*)` CSS variables** for all colors — never hardcoded hex
3. **Use shadcn/ui Radix primitives** for interactive behavior (Select, Dialog, Tooltip, etc.)
4. **Use Lucide React** for all icons — never emojis
5. **Accept `className` as a prop** to allow composition
6. **Accept `children`** where content is variable
7. **Handle all states**: default, hover, focus, disabled, loading
8. **Handle dark mode** automatically via CSS token usage

### Example: building a fresh Button primitive

```jsx
// src/features/branch/components/Button.jsx
// OR src/design-system/Button.jsx

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary: [
    "bg-primary text-primary-contrast",
    "hover:bg-primary-hover",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  ].join(" "),

  outlined: [
    "border border-border bg-transparent text-text",
    "hover:bg-surface-hover",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
  ].join(" "),

  ghost: [
    "bg-transparent text-text",
    "hover:bg-surface-hover",
  ].join(" "),

  destructive: [
    "bg-error text-white",
    "hover:bg-error-hover",
  ].join(" "),
};

const sizeVariants = {
  sm:  "h-8 px-3 text-xs",
  md:  "h-9 px-4 text-sm",
  lg:  "h-10 px-6 text-sm",
  xl:  "h-11 px-8 text-base",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  children,
  className,
  onClick,
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2",
        "rounded-lg font-medium",
        "cursor-pointer select-none",
        "transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Variant
        buttonVariants[variant],
        // Size
        sizeVariants[size],
        // Full width
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
```

### Example: building a fresh Badge primitive

```jsx
// src/features/branch/components/Badge.jsx

import { cn } from "@/lib/utils";

const variants = {
  success: "bg-success-soft text-success",
  error:   "bg-error-soft text-error",
  warning: "bg-warning-soft text-warning",
  info:    "bg-info-soft text-info",
  default: "bg-surface-alt text-text-muted",
};

const Badge = ({ variant = "default", children, className }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
      "text-xs font-medium",
      variants[variant],
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
```

### Example: building a fresh TextInput primitive

```jsx
// src/design-system/TextInput.jsx

import { cn } from "@/lib/utils";

const TextInput = ({
  label,
  hint,
  error,
  required,
  id,
  className,
  ...inputProps
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text"
        >
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          "h-9 w-full rounded-lg border border-border bg-surface",
          "px-3 text-sm text-text placeholder:text-text-disabled",
          "outline-none transition-colors duration-150",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt",
          error && "border-error focus:border-error focus:ring-error/20",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...inputProps}
      />

      {hint && !error && (
        <span id={`${inputId}-hint`} className="text-xs text-text-muted">
          {hint}
        </span>
      )}

      {error && (
        <span id={`${inputId}-error`} className="text-xs text-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextInput;
```

### Example: building a fresh DataCard primitive (mobile list item)

```jsx
// src/features/branch/components/DataCard.jsx

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const DataCard = ({
  onClick,
  children,
  showArrow = true,
  className,
}) => (
  <div
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={onClick ? (e) => e.key === "Enter" && onClick(e) : undefined}
    className={cn(
      "rounded-xl border border-border bg-surface p-4",
      "transition-colors duration-150",
      onClick && [
        "cursor-pointer",
        "hover:bg-surface-hover hover:border-border-strong",
        "active:bg-surface-active",
      ],
      className
    )}
  >
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">{children}</div>
      {onClick && showArrow && (
        <ChevronRight size={16} className="shrink-0 text-text-disabled" />
      )}
    </div>
  </div>
);

export default DataCard;
```

---

## Step 4: Create the Page Files (Mandatory Pattern)

Only after your primitives are built, create the page files:

```
src/features/<feature>/pages/
  FeaturePage.jsx              <- Parent gate (no UI)
  desktop/
    FeatureDesktopPage.jsx     <- Desktop UI using your new primitives
    index.js
  mobile/
    FeatureMobilePage.jsx      <- Mobile UI using your new primitives
    index.js
```

### Parent Page (always exactly this)

```jsx
// src/features/<feature>/pages/FeaturePage.jsx

import { useIsMobile } from "@/hooks";
import { FeatureDesktopPage } from "./desktop";
import { FeatureMobilePage } from "./mobile";

const FeaturePage = () => {
  const isMobile = useIsMobile();
  return isMobile ? <FeatureMobilePage /> : <FeatureDesktopPage />;
};

export default FeaturePage;
```

If shared data is needed, fetch in parent and pass as props:

```jsx
const FeaturePage = () => {
  const isMobile = useIsMobile();
  const { items, isLoading, onDelete } = useFeatureHook();

  const props = { items, isLoading, onDelete };
  return isMobile ? <FeatureMobilePage {...props} /> : <FeatureDesktopPage {...props} />;
};
```

---

## Step 5: Build the Desktop Page

Use ONLY the primitives you built in Phase 1.

```jsx
// src/features/branch/pages/desktop/BranchesDesktopPage.jsx

// Import from YOUR new primitives — NOT from @/components
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import DataTable from "../../components/DataTable";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const BranchesDesktopPage = ({ branches, isLoading, onDelete }) => {
  // loading
  if (isLoading) return <LoadingSkeleton />;

  return (
    <section className="min-h-screen bg-bg p-8">
      <div className="mx-auto max-w-[1200px]">

        {/* Page header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Branches</h1>
            <p className="mt-0.5 text-sm text-text-muted">
              Manage your company branch locations
            </p>
          </div>
          <Button variant="primary" icon={<Plus size={16} />}>
            New Branch
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex items-center gap-3">
          <SearchInput placeholder="Search branches..." className="max-w-xs" />
          {/* status filter, etc. */}
        </div>

        {/* Table */}
        {branches.length === 0 ? (
          <EmptyState
            title="No branches yet"
            description="Create your first branch to get started."
            action={<Button variant="primary">Create Branch</Button>}
          />
        ) : (
          <DataTable columns={columns} data={branches} />
        )}

      </div>
    </section>
  );
};
```

### Desktop layout rules

- Root: `<section className="min-h-screen bg-bg p-8">`
- Container: `<div className="mx-auto max-w-[1200px]">`
- Form grids: `<div className="grid grid-cols-2 gap-6">`
- Section spacing: `mb-6` between sections
- Card surfaces: `rounded-xl border border-border bg-surface p-6`
- Table rows: dense, ~48px height

---

## Step 6: Build the Mobile Page

Use ONLY the primitives you built in Phase 1.

```jsx
// src/features/branch/pages/mobile/BranchesMobilePage.jsx

import DataCard from "../../components/DataCard";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const BranchesMobilePage = ({ branches, isLoading }) => {
  if (isLoading) return <LoadingSkeleton />;

  return (
    <section className="min-h-screen bg-bg px-4 py-6">

      {/* Search */}
      <div className="mb-4">
        <SearchInput placeholder="Search branches..." fullWidth />
      </div>

      {/* Count */}
      <p className="mb-3 text-sm text-text-muted">
        {branches.length} branches
      </p>

      {/* Card list */}
      {branches.length === 0 ? (
        <EmptyState
          title="No branches yet"
          action={<Button variant="primary" fullWidth>Create Branch</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {branches.map((branch) => (
            <DataCard key={branch._id} onClick={() => navigate(`/branches/${branch._id}`)}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-text">{branch.name}</p>
                <Badge variant={branch.status === "active" ? "success" : "default"}>
                  {branch.status}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-text-muted">{branch.address?.city}</p>
            </DataCard>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => navigate("/branches/create")}
        className={[
          "fixed bottom-20 right-4",
          "flex size-14 items-center justify-center",
          "rounded-full bg-primary text-primary-contrast",
          "shadow-[var(--app-shadow-lg)]",
          "transition-transform duration-150 hover:scale-105 active:scale-95",
          "cursor-pointer",
        ].join(" ")}
        aria-label="Create new branch"
      >
        <Plus size={24} />
      </button>

    </section>
  );
};
```

### Mobile layout rules

- Root: `<section className="min-h-screen bg-bg px-4 py-6">`
- No max-width — always full width
- List gap: `flex flex-col gap-3`
- Form sections: stacked cards, single column
- Bottom action bar: `fixed bottom-16 left-0 right-0 border-t border-border bg-surface px-4 py-3`
- Touch targets: min `h-11` (44px) for all interactive elements
- Font sizes: `text-sm` body, `text-base` headings

---

## Step 7: Color and Token Rules

### Priority order

1. Tailwind semantic class (preferred): `bg-surface`, `text-text-muted`, `border-border`
2. CSS variable in `style` or inline for one-offs: `var(--app-color-surface)`
3. CSS variable via Tailwind arbitrary: `bg-[var(--app-color-primary-soft)]` (last resort)

### Complete token quick reference

```
Backgrounds       bg-bg  bg-surface  bg-surface-alt  bg-surface-hover  bg-surface-active
Text              text-text  text-text-muted  text-text-disabled
Borders           border-border  border-border-strong  divide-divider
Brand             bg-primary  text-primary  bg-primary-soft  text-primary-contrast
Success           bg-success  text-success  bg-success-soft
Error             bg-error  text-error  bg-error-soft
Warning           bg-warning  text-warning  bg-warning-soft
Info              bg-info  text-info  bg-info-soft
```

### Hard rules

- NEVER: `bg-green-500`, `text-gray-600`, `border-slate-200`
- NEVER: `color: "#00994a"`, `backgroundColor: "#f9fafb"`
- NEVER: `bg-[#00994a]`

---

## Step 8: Tailwind v4 Rules

```css
/* index.css — what is already there */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));  /* class-based dark mode */
@theme { /* all custom token mappings */ }
```

- No `tailwind.config.js` — configuration lives entirely in CSS
- Dark mode is `.dark` class-based — not media query
- Custom tokens via `@theme {}` — already set up in `src/index.css`

---

## Step 9: Shadcn/ui Primitives — How to Use

Use raw shadcn primitives for **interactive behavior** inside your new primitive components:

```jsx
// Inside your new SelectInput primitive:
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";  // raw shadcn — OK inside a primitive

// Style it with Tailwind + tokens
const SelectInput = ({ options, value, onChange, label, error }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-text">{label}</label>}
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 border-border bg-surface text-sm text-text">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-border bg-surface">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-sm text-text">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <span className="text-xs text-error">{error}</span>}
  </div>
);
```

Raw shadcn primitives are allowed **inside primitive components only** — not directly in feature page JSX.

---

## Step 10: Animation Guidelines

```jsx
// Page entry — wrap the page root element
import { motion } from "framer-motion";

<motion.section
  className="min-h-screen bg-bg p-8"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
  ...
</motion.section>

// Hover on interactive cards — Tailwind only
className="transition-shadow duration-200 hover:shadow-md"

// List item stagger (optional, for card lists)
{items.map((item, i) => (
  <motion.div
    key={item._id}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.04, duration: 0.2 }}
  >
    <DataCard>{...}</DataCard>
  </motion.div>
))}
```

---

## Step 11: Icon Usage

```jsx
// Always lucide-react — no exceptions
import { Plus, Edit, Trash2, Search, X, ChevronRight, MoreVertical } from "lucide-react";

// In buttons
<Button icon={<Plus size={16} />}>New Branch</Button>

// Standalone icon button (build as a primitive)
<IconButton onClick={onEdit} aria-label="Edit branch">
  <Edit size={18} />
</IconButton>

// Never emojis
// Never MUI icons in feature pages
```

---

## Step 12: Data State Pattern

Handle all three states in every page:

```jsx
// Loading
if (isLoading) {
  return (
    <section className="min-h-screen bg-bg p-8">
      <div className="mx-auto max-w-[1200px] space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-alt" />
        ))}
      </div>
    </section>
  );
}

// Error
if (error) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-bg">
      <div className="rounded-xl border border-error-soft bg-error-soft p-8 text-center">
        <p className="text-sm font-medium text-error">Failed to load branches</p>
        <p className="mt-1 text-xs text-text-muted">{error.message}</p>
        <Button variant="outlined" className="mt-4" onClick={refetch}>
          Try again
        </Button>
      </div>
    </section>
  );
}

// Empty
if (!items.length) {
  return <EmptyState title="No branches yet" description="..." />;
}

// Data
return <YourDataView data={items} />;
```

---

## Verification Checklist Before Claiming Done

```
PHASE 1 — Primitives
  [ ] All needed primitives built BEFORE any page
  [ ] No App* components imported anywhere in new code
  [ ] No @/components barrel imports in new primitives or pages
  [ ] Each primitive uses only: Tailwind tokens, CSS vars, shadcn raw, lucide, framer-motion

PHASE 2 — Pages
  [ ] Parent page: zero UI markup, only useIsMobile() + conditional render
  [ ] Desktop child: pages/desktop/FeatureDesktopPage.jsx
  [ ] Mobile child: pages/mobile/FeatureMobilePage.jsx
  [ ] Both desktop/index.js and mobile/index.js export the child

Visual
  [ ] No emojis as icons
  [ ] No hardcoded hex colors
  [ ] Desktop has max-w-[1200px] container
  [ ] Mobile has px-4 padding, full width, no max-width

Interactions
  [ ] Clickable elements have cursor-pointer
  [ ] Cards/rows have hover:bg-surface-hover
  [ ] Mobile touch targets >= 44px (min h-11)

Data States
  [ ] Loading skeleton shown (animate-pulse or Framer Motion)
  [ ] Empty state shown
  [ ] Error state shown

Code Quality
  [ ] No console.log left
  [ ] No style={{}} for layout
  [ ] Light mode tested
  [ ] Dark mode tested
```
