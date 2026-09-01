# UI Build Instructions — PharmaERP (v3.0)

> **Quick-reference operating instructions for building and redesigning any UI surface across PharmaERP.**
> For converting image mockups into UI, see **[IMAGE_TO_UI_INSTRUCTIONS.md](./IMAGE_TO_UI_INSTRUCTIONS.md)**.
> For reusable component specifications & motion physics, see **[REUSABLE_COMPONENTS_GUIDE.md](./REUSABLE_COMPONENTS_GUIDE.md)**.
> For detailed visual standards, see **[DESIGN_STANDARDS.md](./DESIGN_STANDARDS.md)** and **[UI_GUIDE.md](./UI_GUIDE.md)**.

---

## 1. CRITICAL POLICY: Zero Legacy `App*` Components

> **NEVER use any existing `App*` components when building fresh UI.**
>
> Do NOT import: `AppButton`, `AppInput`, `AppCard`, `AppHeading`, `AppText`, `AppTable`, `AppForm`,
> `AppFormField`, `AppAlert`, `AppSkeleton`, `AppModal`, `AppBox`, or any component from `@/components`.
>
> **Mandatory Workflow:**
> 1. Build new reusable primitives first using Tailwind v4 + semantic CSS tokens + Lucide React icons + Framer Motion.
> 2. Build feature pages using ONLY those fresh primitives.

---

## 2. Universal Multi-Device Build Instructions

Every page build must implement the **Universal Device Selection Matrix**:

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

---

## 3. Short Laptop Screen Handling (< 700px Viewport Height)

1. **No Fixed Unscrollable Heights**: Always use `min-h-[100dvh]` with `py-6 sm:py-8 lg:py-10`.
2. **Fluid Centering**: Place `my-auto` on the main card container so it centers on tall monitors but scrolls smoothly without clipping buttons on laptops with 768px height.
3. **Touch Targets**: Minimum `44px × 44px` on all buttons, inputs, links, and checkboxes.

---

## 4. Pre-Delivery Audit

Before marking any task done:
- [ ] Verified on Foldable (< 360px) and Standard Mobile (390px).
- [ ] Verified on Tablet Portrait (768px – 1023px) in single-column desktop card mode.
- [ ] Verified on Short Laptop (< 700px height) with natural vertical scrolling.
- [ ] Verified on Desktop (1024px+) in full dual-panel split.
- [ ] Tested build with `npx vite build --mode development` (Exit Code 0).

---

*PharmaERP UI Build Instructions v3.0*
