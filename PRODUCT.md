# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are enterprise business owners, organization administrators, branch managers, and operational staff managing multi-tenant and multi-branch operations (workspaces, companies, branches, inventory, sales, finance, parties, and catalogs).

## Product Purpose

`erp-frontend` is a modern, responsive, multi-tenant enterprise resource planning (ERP) platform. It provides centralized control over business operations, hierarchical tenant and role-based access management, inventory and master data tracking, financial analytics, and marketplace collaboration.

## Positioning

A unified, modular ERP client designed for end-to-end multi-branch enterprise workflows—bridging master catalog records, granular branch-level inventory, RBAC permission matrices, and subscription tiers in a cohesive responsive interface.

## Operating Context

- **Multi-Tenant Hierarchy**: Workspace -> Company -> Branch -> User Role.
- **Environments & Viewports**: Dedicated desktop and mobile layout experiences tailored for high-density desktop data operations and touch-friendly mobile task execution.
- **Data Densities**: Extensive master catalogs (HSN, UOM, Salt, Manufacturer, Category), KPI dashboards, tabular grids, and transactional forms.

## Capabilities and Constraints

- **Architecture**: React 19, Vite, Redux Toolkit, React Router DOM, Axios.
- **Design System & Styling**: Custom design system tokens (`colorTokens`, CSS variables), Tailwind CSS v4, and shadcn/ui primitives.
- **Dual Layout Hierarchy**: Distinct desktop and mobile layouts per feature module with shared business logic and state hooks.
- **Role-Based Access Control (RBAC)**: Route guards and action-level permission checks (`can()`, `hasRole()`).
- **Theme System**: Dynamic multi-theme support (emerald, classicBlue, slate, warm, indigo) with dark mode toggle.

## Brand Commitments

- Clean, high-contrast, professional enterprise appearance.
- Semantic color-coded states (primary, success, warning, error, info) tied to theme tokens.
- No hardcoded ad-hoc colors in page markup; use design-system props or theme variables.

## Evidence on Hand

- Component catalog and token specification in [`component-catalog.md`](component-catalog.md).
- Feature implementations in `src/features/` (auth, dashboard, workspace, company, branch, catalog, finance, parties, marketplace, subscription).
- Reusable UI component library in `src/components/ui/`.

## Product Principles

1. **Hierarchy First**: Clear multi-tenant context awareness (Workspace -> Company -> Branch) across all views.
2. **Scanability & Speed**: Fast, high-density data views for desktop with keyboard navigation and streamlined mobile equivalents.
3. **Design System Consistency**: Reusable UI primitives and theme variables over one-off custom components.
4. **Resilient Data Handling**: Explicit loading, empty, and error feedback states for all asynchronous network operations.

## Accessibility & Inclusion

- Keyboard navigable interactive elements and dialogs.
- High color contrast compliant with light and dark theme palettes.
- Semantic HTML markup with ARIA roles where applicable.
