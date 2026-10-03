# ERP Frontend

A modern frontend application for an enterprise resource planning (ERP) system built with React, Vite, Redux Toolkit, Material UI, and Tailwind CSS.

This repository contains the user-facing client for managing authentication, dashboards, workspaces, users, subscriptions, and application configuration.

---

## 📌 Overview

`erp-frontend` is designed as a modular, feature-driven React application with role-based access control and a reusable component library.

Key focus areas:

- Authentication and authorization
- Business dashboards and analytics
- Workspace and user management
- Subscription and billing pages
- Shared UI components and layout system
- API integration via Axios

---

## 🚀 Built With

- Vite
- React
- Redux Toolkit
- React Router DOM
- Material UI
- Tailwind CSS
- Axios
- DayJS
- Framer Motion
- React Icons

---

## ✨ Features

- Authentication pages with login, registration, and password recovery
- Protected and guest route guards
- Dashboard charts, KPI cards, and analytics views
- Workspace and team management features
- User profile and permission handling
- Subscription plan and billing status pages
- Notifications and activity display components
- Theme context with light/dark mode support
- Reusable layouts, forms, dialogs, and tables

---

## 📁 Project Structure

```
erp-frontend/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── providers.jsx
│   │   └── routes.jsx
│   ├── assets/
│   ├── components/
│   │   ├── charts/
│   │   ├── features/
│   │   ├── shared/
│   │   └── ui/
│   ├── config/
│   │   ├── env.js
│   │   ├── index.js
│   │   ├── navigation.js
│   │   └── sidebarMenu.js
│   ├── constants/
│   ├── contexts/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── public/
│   │   ├── subscription/
│   │   ├── user/
│   │   └── workspace/
│   ├── guards/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── providers/
│   ├── services/
│   ├── store/
│   ├── theme/
│   └── utils/
├── public/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── jsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🧩 Feature Modules

### `src/features/auth`

Authentication flow, session state, user login, registration, and protected routes.

### `src/features/dashboard`

Dashboard pages, charts, KPI widgets, and analytics components.

### `src/features/user`

User profile management, permissions, and user-related pages.

### `src/features/workspace`

Workspace creation, team assignments, and workspace settings.

### `src/features/subscription`

Subscription plans, billing information, and invoices.

### `src/features/landing`

Public-facing landing and marketing pages.

---

## 🛠️ Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Install dependencies

```bash
git clone <repository-url>
cd erp-frontend
npm install
# or
# yarn install
```

### Environment configuration

Create a `.env.local` file at the project root, or update `src/config/env.js` with your API settings.

Example:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=ERP System
```

### Run locally

```bash
npm run dev
# or
# yarn dev
```

Open the app at `http://localhost:5173`.

---

## 📦 Scripts

```bash
npm run dev      # Start Vite development server
npm run build    # Create production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint checks
```

---

## ⚙️ Configuration

Important configuration files:

- `src/config/env.js` - environment settings and API base URL
- `src/config/navigation.js` - route navigation definitions
- `src/config/sidebarMenu.js` - sidebar menu items
- `src/constants/` - app constants such as roles, permissions, routes, and statuses
- `src/theme/` - theme creation and token management

---

## 🧠 Architecture

- `App.jsx` initializes the app layout and route system
- `main.jsx` bootstraps the React app with providers
- `providers.jsx` wraps app context providers for theme, Redux, and toast notifications
- `services/apiClient.js` configures Axios with base URLs and interceptors
- `store/` contains Redux Toolkit configuration and reducers
- `guards/` protect routes based on authentication and permissions
- `hooks/` includes reusable custom hooks
- `components/` holds reusable UI elements and charts

---

## 🤝 Contributing

- Branch from `main`
- Follow existing folder structure and naming patterns
- Keep features modular and reusable
- Run `npm run lint` before committing
- Submit pull requests for review

---

## 📌 Notes

- This repo is the frontend only and requires a backend API.
- Update `VITE_API_BASE_URL` to your backend endpoint.
- If you add new environment variables, use Vite's `VITE_` prefix.
