# Design Document: Member Dialogs Redesign & Switch Motion Fix

## Overview
This document outlines the redesign of the **Reset Member Password Modal**, **Member Access & Stores Modal**, and the motion fix for **`UISwitch`**.

---

## 1. Switch Motion Fix (`UISwitch.jsx`)
### Root Cause:
In `src/components/ui/UISwitch.jsx`, the thumb `<motion.div>` was using the Framer Motion `layout` prop. When any element above the switch in the DOM tree resizes, opens, or scrolls (e.g. searching, expanding accordions, or toggling master switches), Framer Motion calculates bounding-box deltas and animates the Y coordinate of the thumb, creating a noticeable visual lag or "falling motion" where the container moves first and the thumb drifts behind it.

### Solution:
- Remove the `layout` prop from the thumb in `UISwitch.jsx`.
- Use direct X translation (`x: isChecked ? currentSize.translateX : 0`) and standard hardware-accelerated CSS/spring physics for toggling.
- Ensure the track and thumb stay strictly aligned with zero vertical lag.

---

## 2. Reset Member Password Modal Redesign (`ResetMemberPasswordModal.jsx`)
### Design Goals:
- **Layout & Structure**: Half-size / compact centered modal (`size="sm"`, max-w 460px) utilizing compound components:
  - `<UIModalHeader>` with lock/key badge, clear title, and concise subtitle.
  - `<UIModalBody>` with padded content, staff identity capsule, security password generator, and strength visualizer.
  - `<UIModalFooter>` with clean Cancel and Save actions.
- **Staff Identity Pill**:
  - Member Avatar with initials and role badge.
  - User ID tag (`#USR-XXX`), login identifier (phone/email).
- **Password Input & Generator**:
  - `UIInput` with key prefix icon, visibility toggle (eye/eye-off), and auto-focus.
  - One-click auto-generator with spinning refresh icon.
  - Password strength / complexity meter (capsule indicators: Weak, Fair, Strong).
  - Quick copy button to easily copy before saving.
  - Alert error/success states with zero layout thrashing.

---

## 3. Member Access & Store Clearance Modal Redesign (`MemberAccessModal.jsx`)
### Design Goals:
- **Centered Half-Size Ergonomics**:
  - Size set to compact centered dialog (`size="lg"`, max-w ~620px), perfect for standard desktop and tablet viewports without being oversized or stretching full screen.
  - Fixed header and sticky footer with a smooth scrolling body (`max-h-[65vh]`).
- **Section 1: Company Clearance**:
  - Master toggle switch: "All Companies Authorized" vs "Custom Selection".
  - Search filter when > 3 companies.
  - Modern company cards with building icon, company code / tax ID badge, and instant `UISwitch`.
  - Active selection indicator counter (`X of Y selected`).
- **Section 2: Dynamic Reactive Branch Clearance**:
  - **Instant reactive filtering**: Whenever any company is toggled ON (regardless of whether it is the active/current company), its branches instantly appear in Section 2.
  - Toggling a company OFF instantly removes its branches from Section 2 and prunes unassigned branches.
  - Master toggle for branch clearance ("All Branches in Selected Companies" vs "Custom Branches").
  - Grouped or tagged branches showing company affiliation pill and dispensary type.
  - Friendly empty state with icon when no companies are selected.
- **Section 3: Sticky Modal Footer**:
  - Clear summary pill (`X companies, Y branches authorized`).
  - Secondary "Cancel" button and primary "Save Access Permissions" button with loading state.

---

## 4. Verification Plan
- Verify switch does not lag/fall during scroll or modal content changes.
- Verify reset password dialog renders centered, clean, and validates passwords.
- Verify member access dialog opens centered (half size), dynamically populates branches for any selected company instantly, and saves correctly.
- Run `npm run build` to confirm zero lint or TypeScript/Vite bundle compilation issues.
