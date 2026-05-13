# ERP Frontend

🚀 A comprehensive Enterprise Resource Planning (ERP) system frontend built with React, Redux, and Material UI. Complete with modular features, role-based access control, real-time dashboard, and enterprise-grade architecture.

**Purpose**: Full-stack ERP solution providing employee management, workspace organization, subscription handling, authentication, and comprehensive dashboard analytics.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Feature Modules](#feature-modules)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Integration](#api-integration)
- [Authentication & Authorization](#authentication--authorization)
- [State Management](#state-management)
- [UI Components](#ui-components)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing Guidelines](#contributing-guidelines)

---

## 🎯 Project Overview

The ERP Frontend is the user-facing application for a complete enterprise resource management system. It provides role-based access to various business modules including user and workspace management, subscription handling, analytics dashboards, and comprehensive administration tools.

### Key Objectives

- ✅ Centralized employee and user management
- ✅ Multi-workspace support with role-based access
- ✅ Subscription and billing management
- ✅ Real-time analytics and reporting
- ✅ Workflow automation and task management
- ✅ Secure authentication and authorization
- ✅ Responsive design for all devices

---

## ✨ Features

### Core Business Features

- **👥 User Management** - Complete employee lifecycle management with roles and permissions
- **🏢 Workspace Organization** - Multi-workspace support with team collaboration
- **💳 Subscription Management** - Billing, subscription plans, and payment tracking
- **📊 Analytics Dashboard** - Real-time KPIs, charts, and business metrics
- **🔔 Notifications System** - Real-time notifications for user activities
- **🔐 Authentication** - Secure login, registration, password recovery with JWT
- **👤 User Profiles** - Personal profile management and preferences
- **📝 Activity Logs** - Track user actions and system activities
- **📎 File Attachments** - Upload and manage attachments
- **🔗 Workflows** - Automated workflow management and approvals

### System Features

- **🎭 Dark/Light Theme** - Customizable theme with persistent preferences
- **📱 Responsive UI** - Mobile-first design for all screen sizes
- **♿ Accessibility** - WCAG compliant components
- **🛡️ Route Guards** - Protected routes with permission-based access
- **🔌 REST API Integration** - Axios with interceptors for API communication
- **💾 Local Storage** - Persistent user preferences and data
- **🎣 Custom Hooks** - Reusable hooks for common functionality
- **📦 Component Library** - Comprehensive pre-built components

---

## 🛠️ Tech Stack

### Frontend Framework

- ⚡ **Vite 8.0** - Next-generation build tool
- ⚛️ **React 19** - Latest React with hooks
- 🎯 **React Router DOM 7** - Client-side routing
- 🎨 **Material UI (MUI) 9** - Component library
- 💎 **Tailwind CSS 4** - Utility-first styling
- 🔄 **Redux Toolkit 2** - State management
- 📊 **MUI X Charts** - Data visualization

### Additional Libraries

- 📅 **DayJS** - Date manipulation
- 🎬 **Framer Motion** - Animation library
- 🔗 **Axios** - HTTP client
- 🎪 **React Icons** - Icon library
- 😊 **Emotion** - CSS-in-JS styling

---

## 📂 Project Structure

```
erp-frontend/
├── src/
│   ├── app/                      # Application entry point
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── providers.jsx
│   │   └── routes.jsx
│   │
│   ├── components/               # Reusable components
│   │   ├── charts/              # Chart components
│   │   │   ├── AppAreaChart.jsx
│   │   │   ├── AppBarChart.jsx
│   │   │   ├── AppDonutChart.jsx
│   │   │   ├── AppKpiCard.jsx
│   │   │   ├── AppLineChart.jsx
│   │   │   ├── AppPieChart.jsx
│   │   │   └── AppSparkline.jsx
│   │   │
│   │   ├── features/             # Feature-specific components
│   │   │   └── notifications/
│   │   │
│   │   ├── shared/              # Shared UI components
│   │   │   ├── activity/
│   │   │   ├── attachments/
│   │   │   ├── dialogs/
│   │   │   ├── display/
│   │   │   ├── filters/
│   │   │   ├── forms/
│   │   │   ├── import-export/
│   │   │   ├── layout/
│   │   │   ├── page/
│   │   │   ├── permissions/
│   │   │   ├── tables/
│   │   │   └── workflows/
│   │   │
│   │   └── ui/                  # Base UI components
│   │       ├── buttons/
│   │       ├── data-display/
│   │       ├── feedback/
│   │       ├── inputs/
│   │       ├── layout/
│   │       ├── navigation/
│   │       ├── overlays/
│   │       └── typography/
│   │
│   ├── features/                # Feature modules
│   │   ├── auth/               # Authentication
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── store/
│   │   │
│   │   ├── dashboard/          # Dashboard & analytics
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │
│   │   ├── user/               # User management
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   │
│   │   ├── workspace/          # Workspace management
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   │
│   │   ├── subscription/       # Subscription & billing
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   │
│   │   ├── landing/            # Landing pages
│   │   ├── public/             # Public routes
│   │   └── admin/              # Admin features (if applicable)
│   │
│   ├── config/                 # Application configuration
│   │   ├── env.js
│   │   ├── index.js
│   │   ├── navigation.js
│   │   └── sidebarMenu.js
│   │
│   ├── constants/              # Application constants
│   │   ├── app.js
│   │   ├── permissions.js
│   │   ├── roles.js
│   │   ├── routes.js
│   │   └── statuses.js
│   │
│   ├── contexts/               # React contexts
│   │   ├── SidebarContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── guards/                 # Route guards
│   │   ├── ProtectedRoute.jsx
│   │   ├── GuestRoute.jsx
│   │   └── PermissionGuard.jsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── usePagination.js
│   │   └── useToggle.js
│   │
│   ├── layouts/                # Layout components
│   │   ├── AppLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── PublicLayout.jsx
│   │
│   ├── pages/                  # Page components
│   │   ├── HomePage.jsx
│   │   └── UIComponentDisplayPage.jsx
│   │
│   ├── providers/              # Context providers
│   │   ├── AppProvider.jsx
│   │   ├── ReduxProvider.jsx
│   │   ├── ThemeProvider.jsx
│   │   └── ToastProvider.jsx
│   │
│   ├── services/               # API services
│   │   ├── apiClient.js
│   │   ├── endpoints.js
│   │   ├── interceptors.js
│   │   └── index.js
│   │
│   ├── store/                  # Redux store
│   │   ├── rootReducer.js
│   │   ├── store.js
│   │   └── middlewares/
│   │
│   ├── theme/                  # Theme configuration
│   │   ├── createAppTheme.js
│   │   ├── getThemeTokens.js
│   │   ├── tokens.js
│   │   └── index.js
│   │
│   ├── utils/                  # Utility functions
│   │   ├── downloadFile.js
│   │   ├── exportExcel.js
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   ├── helpers.js
│   │   ├── permissions.js
│   │   ├── storage.js
│   │   ├── validation.js
│   │   └── index.js
│   │
│   └── assets/                 # Static assets
│       ├── styles/
│       └── dashboard-showcase/
│
├── public/                     # Public static files
├── index.html
├── vite.config.js
├── eslint.config.js
├── jsconfig.json
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🔧 Feature Modules

### Authentication (`/features/auth`)

- User registration and login
- Password reset and recovery
- JWT token management
- Session handling
- Login persistence

### Dashboard (`/features/dashboard`)

- Analytics and KPI cards
- Real-time charts and graphs
- Activity feeds
- Quick action panels
- Customizable widgets

### User Management (`/features/user`)

- User profile management
- Employee directory
- Role and permission management
- User activity tracking
- Profile updates and preferences

### Workspace Management (`/features/workspace`)

- Create and manage workspaces
- Team member invitation
- Workspace settings
- Resource allocation
- Workspace switching

### Subscription (`/features/subscription`)

- Plan selection and upgrade
- Billing information
- Payment history
- Invoice management
- Usage tracking

### Landing (`/features/landing`)

- Public landing pages
- Marketing content
- Feature showcases
- Pricing information

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Git
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd erp-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=ERP System
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

---

## 💻 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint

# Fix ESLint issues automatically
npm run lint --fix
```

### Development Workflow

1. Create feature branch from `main`
2. Implement changes following the project structure
3. Run linter to ensure code quality
4. Test thoroughly in development
5. Create pull request for review
6. Merge to main after approval

### Code Style

- **ESLint** - Code quality and style consistency
- **Prettier** - Code formatting (configured via ESLint)
- **React Hooks Rules** - Proper hook usage
- **React Refresh** - Fast module refresh in development

---

## 📡 API Integration

### Service Layer (`/services`)

The application uses a centralized API service layer:

```javascript
// services/apiClient.js
import axios from "axios";
import { ENDPOINTS } from "./endpoints.js";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
```

### API Endpoints (`/services/endpoints.js`)

Centralized endpoint definitions:

```javascript
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    GET_ALL: "/users",
    GET_ONE: (id) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
  // ... more endpoints
};
```

### Interceptors (`/services/interceptors.js`)

- Automatic JWT token injection
- Response error handling
- Request/response logging
- Token refresh on expiry

### Making API Calls

```javascript
import apiClient from "@/services/apiClient.js";
import { ENDPOINTS } from "@/services/endpoints.js";

// GET request
const fetchUsers = async () => {
  try {
    const response = await apiClient.get(ENDPOINTS.USERS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// POST request
const createUser = async (userData) => {
  try {
    const response = await apiClient.post(ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. User submits login credentials
2. Backend validates and returns JWT token
3. Token stored in Redux store and localStorage
4. Token included in all subsequent requests
5. On token expiry, refresh token is used to obtain new token
6. Failed auth redirects to login page

### Route Guards

#### ProtectedRoute

Prevents unauthenticated users from accessing protected pages:

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

#### GuestRoute

Prevents authenticated users from accessing guest pages (login, register):

```javascript
<GuestRoute>
  <LoginPage />
</GuestRoute>
```

#### PermissionGuard

Restricts access based on user permissions:

```javascript
<PermissionGuard permissions={["user:read", "user:write"]}>
  <UserManagement />
</PermissionGuard>
```

### Role-Based Access Control

Roles and permissions defined in `/constants/roles.js` and `/constants/permissions.js`:

```javascript
// constants/roles.js
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  VIEWER: "viewer",
};

// constants/permissions.js
export const PERMISSIONS = {
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  USER_DELETE: "user:delete",
  WORKSPACE_MANAGE: "workspace:manage",
  // ... more permissions
};
```

---

## 🔄 State Management

### Redux Store Structure

```
store/
├── rootReducer.js      # Combines all reducers
├── store.js            # Store configuration
└── middlewares/
    └── custom middlewares
```

### Redux Slices

Feature modules contain their own Redux slices:

```javascript
// features/auth/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  // API call
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default authSlice.reducer;
```

### Using Redux in Components

```javascript
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/features/auth/store/authSlice.js";

export function LoginComponent() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    await dispatch(loginUser(credentials));
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

---

## 🎨 UI Components

### Component Categories

#### Chart Components (`/components/charts`)

- Area charts
- Bar charts
- Donut charts
- Line charts
- Pie charts
- Sparklines
- KPI cards

#### Shared Components (`/components/shared`)

- **Activity** - Activity feeds and logs
- **Attachments** - File upload and display
- **Dialogs** - Modal dialogs and confirmations
- **Display** - Data display components
- **Filters** - Filter controls
- **Forms** - Form components
- **Import/Export** - Bulk operations
- **Layout** - Layout components
- **Page** - Page containers
- **Permissions** - Permission-based rendering
- **Tables** - Data tables with sorting/filtering
- **Workflows** - Workflow components

#### UI Base Components (`/components/ui`)

- Buttons, inputs, forms
- Data display (lists, tables, cards)
- Feedback (alerts, tooltips)
- Layout containers
- Navigation components
- Overlays (modals, popovers)
- Typography

### Component Usage

```javascript
import { AppBarChart } from "@/components/charts";
import { DataTable } from "@/components/shared/tables";
import { PrimaryButton } from "@/components/ui/buttons";

export function Dashboard() {
  return (
    <div>
      <AppBarChart data={chartData} />
      <DataTable columns={columns} rows={rows} />
      <PrimaryButton onClick={handleClick}>Action</PrimaryButton>
    </div>
  );
}
```

---

## ⚙️ Configuration

### Environment Configuration (`/config`)

**env.js** - Environment-based configuration:

```javascript
export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  ENVIRONMENT: import.meta.env.MODE,
};
```

### Navigation Configuration

**navigation.js** - Route definitions and menu items

**sidebarMenu.js** - Sidebar menu structure with roles

### Theme Configuration (`/theme`)

**tokens.js** - Design tokens (colors, spacing, typography)

**createAppTheme.js** - Theme factory function

**getThemeTokens.js** - Dynamic token generation

### Tailwind Configuration

Customized Tailwind CSS configuration in `tailwind.config.js`:

- Custom colors
- Custom spacing
- Custom typography
- Plugin extensions

---

## 📦 Building & Deployment

### Production Build

```bash
npm run build
```

Generates optimized production build in `dist/` directory with:

- Code splitting and minification
- Asset optimization
- Source map generation
- Tree shaking

### Preview Production Build

```bash
npm run preview
```

Locally preview the production build before deployment.

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints pointing to production
- [ ] Build completes without errors
- [ ] No console errors or warnings
- [ ] Responsive design tested on multiple devices
- [ ] Authentication flow working
- [ ] API integration tested
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Error pages configured

### Deployment Platforms

The application can be deployed to:

- **Vercel** - Recommended for Vite + React
- **Netlify** - Auto-deployment from Git
- **AWS S3 + CloudFront**
- **Docker + Kubernetes**
- **Traditional web servers**

---

## 📚 Additional Resources

### Useful Links

- [React Documentation](https://react.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Material UI Docs](https://mui.com)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

### Component Catalog

Refer to [component-catalog.md](./component-catalog.md) for detailed component documentation and usage examples.

---

## 👥 Contributing Guidelines

### Before You Start

1. Understand the project structure
2. Follow existing code patterns
3. Check existing components before creating new ones
4. Write meaningful commit messages

### Creating New Features

1. Create feature branch: `git checkout -b feature/feature-name`
2. Follow the feature module structure
3. Create necessary components, services, and store
4. Add proper error handling
5. Test thoroughly
6. Create pull request with clear description

### Code Quality Standards

- ✅ All code must pass ESLint
- ✅ Components should be reusable
- ✅ Proper error handling required
- ✅ API calls should use service layer
- ✅ State managed through Redux
- ✅ Responsive design mandatory
- ✅ Accessibility considerations

### Commit Message Format

```
feat: add user dashboard page
fix: resolve sidebar collapse issue
docs: update API documentation
refactor: simplify auth logic
style: format code
test: add user component tests
```

---

## 📝 License

This project is proprietary and confidential.

---

## 📞 Support & Contact

For questions, issues, or support:

- Create an issue in the repository
- Contact the development team
- Check existing documentation

---

**Happy Coding! 🚀**

Built with ❤️ for enterprise excellence.
"@tailwindcss/vite": "^4.2.4",
"react-icons": "^5.6.0"
}

````

### Development Tools

- **Vite** - Build tool and dev server
- **ESLint** - Code quality and consistency
- **@vitejs/plugin-react** - React Fast Refresh support
- **React Hooks ESLint plugin** - Enforce React hooks rules

### Directory Structure Features

| Directory         | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `src/app/`        | Application entry point, routes configuration, providers setup |
| `src/features/`   | Feature modules (auth, dashboard, etc.) with isolated logic    |
| `src/providers/`  | Global providers (Redux, Theme, Toast, App)                    |
| `src/layouts/`    | Reusable layout components (Dashboard, Auth, Main)             |
| `src/guards/`     | Route protection components and guards                         |
| `src/store/`      | Redux store configuration, slices, and middleware              |
| `src/services/`   | API client, endpoints, and interceptors                        |
| `src/theme/`      | Theme configuration, tokens, and utilities                     |
| `src/components/` | Reusable UI components organized by category                   |
| `src/hooks/`      | Custom React hooks                                             |
| `src/utils/`      | Helper functions and utilities                                 |
| `src/constants/`  | App constants and configuration                                |
| `src/contexts/`   | React Context for theme and sidebar state                      |
| `src/config/`     | Environment and navigation configuration                       |
| `src/assets/`     | Static assets (images, icons, fonts)                           |

---

## 📁 Project Structure Overview

```text
erp-frontend/
│
├── 📂 public/
│   └── assets/                    # Static files (favicon, etc.)
│
├── 📂 src/
│   ├── 📂 app/
│   │   ├── App.jsx               # Root application component
│   │   ├── main.jsx              # Application bootstrap
│   │   ├── routes.jsx            # Route configuration
│   │   ├── ProtectedRoute.jsx    # Route protection component
│   │   └── providers.jsx         # Provider composition
│   │
│   ├── 📂 features/              # Feature modules
│   │   ├── 📂 auth/
│   │   │   ├── components/       # Auth UI components
│   │   │   │   ├── AuthCard.jsx
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── ForgotPasswordForm.jsx
│   │   │   │   └── ResetPasswordForm.jsx
│   │   │   ├── pages/            # Auth pages
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   └── ResetPasswordPage.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js    # Auth hook
│   │   │   ├── services/
│   │   │   │   └── authService.js
│   │   │   ├── store/
│   │   │   │   ├── authSlice.js  # Redux slice
│   │   │   │   ├── authThunk.js  # Async actions
│   │   │   │   └── authSelector.js
│   │   │   ├── routes/
│   │   │   │   └── authRoutes.jsx
│   │   │   └── index.js          # Feature exports
│   │   │
│   │   └── 📂 dashboard/
│   │       ├── components/
│   │       │   ├── DashboardCard.jsx
│   │       │   ├── DashboardStats.jsx
│   │       │   ├── DashboardCharts.jsx
│   │       │   └── RecentActivities.jsx
│   │       ├── pages/
│   │       │   └── DashboardPage.jsx
│   │       ├── services/
│   │       ├── store/
│   │       ├── hooks/
│   │       └── index.js
│   │
│   ├── 📂 providers/
│   │   ├── AppProvider.jsx       # Main provider composition
│   │   ├── ReduxProvider.jsx     # Redux store provider
│   │   ├── ThemeProvider.jsx     # Theme provider
│   │   ├── ToastProvider.jsx     # Toast provider
│   │   └── index.js
│   │
│   ├── 📂 layouts/
│   │   ├── PublicLayout.jsx      # Main app layout
│   │   ├── AuthLayout.jsx        # Dashboard layout with sidebar
│   │   ├── AppLayout.jsx         # Auth pages layout
│   │   └── index.js
│   │
│   ├── 📂 guards/
│   │   ├── ProtectedRoute.jsx    # Protect routes from unauthenticated access
│   │   ├── GuestRoute.jsx        # Prevent authenticated users from accessing
│   │   ├── PermissionGuard.jsx   # Role-based access control
│   │   └── index.js
│   │
│   ├── 📂 store/
│   │   ├── store.js              # Redux store configuration
│   │   ├── rootReducer.js        # Combine all reducers
│   │   ├── 📂 middlewares/
│   │   │   └── index.js          # Custom middleware
│   │   └── index.js
│   │
│   ├── 📂 services/
│   │   ├── apiClient.js          # Axios instance
│   │   ├── endpoints.js          # API endpoint definitions
│   │   ├── interceptors.js       # Request/response interceptors
│   │   └── index.js
│   │
│   ├── 📂 contexts/
│   │   ├── ThemeContext.jsx      # Theme context
│   │   ├── SidebarContext.jsx    # Sidebar state context
│   │   └── index.js
│   │
│   ├── 📂 theme/
│   │   ├── createAppTheme.js     # Theme creation utility
│   │   ├── getThemeTokens.js     # Token selection
│   │   ├── tokens.js             # Color and design tokens
│   │   └── index.js
│   │
│   ├── 📂 components/
│   │   ├── 📂 ui/                # Base UI components
│   │   ├── 📂 common/            # Common reusable components
│   │   ├── 📂 layout/            # Layout components
│   │   ├── 📂 shared/            # Shared components
│   │   ├── 📂 charts/            # Chart components
│   │   └── index.js              # Component exports
│   │
│   ├── 📂 hooks/
│   │   ├── useDebounce.js        # Debounce hook
│   │   ├── useLocalStorage.js    # Local storage hook
│   │   ├── usePagination.js      # Pagination hook
│   │   ├── useToggle.js          # Toggle state hook
│   │   └── index.js
│   │
│   ├── 📂 utils/
│   │   ├── formatDate.js         # Date formatting
│   │   ├── formatCurrency.js     # Currency formatting
│   │   ├── validation.js         # Form validation
│   │   ├── permissions.js        # Permission checks
│   │   ├── storage.js            # Local storage helpers
│   │   ├── helpers.js            # General helpers
│   │   ├── downloadFile.js       # File download utility
│   │   ├── exportExcel.js        # Excel export utility
│   │   └── index.js
│   │
│   ├── 📂 constants/
│   │   ├── app.js                # App constants
│   │   ├── routes.js             # Route paths
│   │   ├── roles.js              # Role definitions
│   │   ├── permissions.js        # Permission definitions
│   │   ├── statuses.js           # Status constants
│   │   └── index.js
│   │
│   ├── 📂 config/
│   │   ├── env.js                # Environment variables
│   │   ├── navigation.js         # Navigation configuration
│   │   ├── sidebarMenu.js        # Sidebar menu configuration
│   │   └── index.js
│   │
│   ├── 📂 assets/
│   │   ├── 📂 icons/
│   │   ├── 📂 images/
│   │   ├── 📂 svg/
│   │   └── 📂 styles/
│   │       └── globals.css
│   │
│   ├── index.css                 # Global styles
│   └── vite-env.d.js             # Vite type definitions
│
├── .env                          # Environment variables (local)
├── .env.example                  # Environment template
├── .gitignore
├── eslint.config.js              # ESLint configuration
├── jsconfig.json                 # JS path aliases
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies
├── package-lock.json             # Dependency lock file
└── README.md                     # This file
````

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url> my-app
cd my-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your API configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=My App
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=false
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

---

## ⚙️ Configuration

### Environment Configuration (`src/config/env.js`)

Centralize all environment variable access:

```javascript
export const ENV = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 10000,
  APP_NAME: import.meta.env.VITE_APP_NAME || "My App",
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
};
```

### Path Aliases (`jsconfig.json`)

Use `@/` to import from `src/`:

```javascript
// Instead of:
import { AppProvider } from "../../../providers";

// Use:
import { AppProvider } from "@/providers";
```

### Vite Configuration (`vite.config.js`)

Build optimization and plugin configuration for Vite.

---

## 🔄 Redux Store & State Management

### Store Architecture

The Redux store is configured in `src/store/store.js` using Redux Toolkit:

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/* custom middleware */),
});
```

### Feature-Based Redux Structure

Each feature (auth, dashboard, etc.) has its own Redux slice:

```
src/features/auth/store/
├── authSlice.js          # Redux slice definition
├── authThunk.js          # Async thunks
└── authSelector.js       # Selectors
```

### Creating a Redux Slice

**src/features/auth/store/authSlice.js**

```javascript
import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./authThunk";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
```

### Async Thunks

**src/features/auth/store/authThunk.js**

```javascript
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
```

### Selectors

**src/features/auth/store/authSelector.js**

```javascript
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
```

### Using Redux in Components

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/auth/store/authThunk';
import { selectUser, selectAuthLoading } from '@/features/auth/store/authSelector';

export function LoginForm() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  const handleLogin = async (credentials) => {
    await dispatch(loginUser(credentials));
  };

  return (
    // JSX
  );
}
```

### Combining Reducers

**src/store/rootReducer.js**

```javascript
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import dashboardReducer from "@/features/dashboard/store/dashboardSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
});
```

---

## 🧭 Routing & Navigation

### Route Configuration

**src/app/routes.jsx**

```javascript
import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "@/features/auth/routes/authRoutes";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ProtectedRoute } from "@/guards/ProtectedRoute";
import { GuestRoute } from "@/guards/GuestRoute";

export const router = createBrowserRouter([
  // Auth routes
  ...authRoutes,

  // Protected dashboard routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  // Catch-all
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
```

### Lazy Loading Routes

```javascript
import { lazy, Suspense } from "react";

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
]);
```

### Navigation Hook

```javascript
import { useNavigate } from "react-router-dom";

export function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

### Route Constants

**src/constants/routes.js**

```javascript
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
};
```

---

## 🎯 Providers Architecture

### Provider Hierarchy

```javascript
AppProvider
  ├── ThemeProvider
  ├── ReduxProvider
  │   └── ToastProvider
  │       └── Children
```

### App Provider

**src/providers/AppProvider.jsx**

```javascript
import { ReduxProvider } from "./ReduxProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <ToastProvider>{children}</ToastProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
};
```

### Redux Provider

**src/providers/ReduxProvider.jsx**

```javascript
import { Provider } from "react-redux";
import { store } from "@/store/store";

export const ReduxProvider = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);
```

### Theme Provider

**src/providers/ThemeProvider.jsx**

```javascript
import { useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeContext } from "@/contexts/ThemeContext";
import { createAppTheme } from "@/theme/createAppTheme";

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
```

### Toast Provider

**src/providers/ToastProvider.jsx**

```javascript
import { createContext, useState, useCallback } from "react";
import { Alert, Snackbar } from "@mui/material";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    (message, severity = "info", duration = 3000) => {
      setToast({ message, severity });
      setTimeout(() => setToast(null), duration);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Snackbar open onClose={() => setToast(null)}>
          <Alert severity={toast.severity}>{toast.message}</Alert>
        </Snackbar>
      )}
    </ToastContext.Provider>
  );
};
```

### Application Bootstrap

**src/app/main.jsx**

```javascript
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import App from "./App";
import { AppProvider } from "@/providers";
import { router } from "./routes";
import "@/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);
```

---

## 🔐 Authentication Flow

### Auth Feature Structure

```
src/features/auth/
├── components/
│   ├── AuthCard.jsx
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── ForgotPasswordForm.jsx
│   └── ResetPasswordForm.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ForgotPasswordPage.jsx
│   └── ResetPasswordPage.jsx
├── hooks/
│   └── useAuth.js
├── services/
│   └── authService.js
├── store/
│   ├── authSlice.js
│   ├── authThunk.js
│   └── authSelector.js
└── routes/
    └── authRoutes.jsx
```

### Auth Service

**src/features/auth/services/authService.js**

```javascript
import { apiClient } from "@/services/apiClient";

export const authService = {
  login: (credentials) => apiClient.post("/auth/login", credentials),

  register: (data) => apiClient.post("/auth/register", data),

  forgotPassword: (email) => apiClient.post("/auth/forgot-password", { email }),

  resetPassword: (token, newPassword) =>
    apiClient.post("/auth/reset-password", { token, newPassword }),

  logout: () => apiClient.post("/auth/logout"),

  getMe: () => apiClient.get("/auth/me"),

  refreshToken: () => apiClient.post("/auth/refresh-token"),
};
```

### Auth Hook

**src/features/auth/hooks/useAuth.js**

```javascript
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout } from "../store/authThunk";
import { selectUser, selectIsAuthenticated } from "../store/authSelector";

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogin = async (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
```

### Login Page Example

**src/features/auth/pages/LoginPage.jsx**

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const handleSubmit = async (credentials) => {
    try {
      setError(null);
      await login(credentials);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthCard title="Sign In">
      <LoginForm onSubmit={handleSubmit} error={error} />
    </AuthCard>
  );
}
```

---

## 🎨 Theme System

### Token System

**src/theme/tokens.js**

```javascript
export const colorTokens = {
  light: {
    bg: "#f7fbfc",
    surface: "#ffffff",
    primary: "#2b7f87",
    primaryHover: "#256f76",
    success: "#16a34a",
    error: "#dc2626",
    warning: "#f59e0b",
    text: "#0f2343",
    textMuted: "rgba(15,35,67,0.6)",
    border: "rgba(43,127,135,0.16)",
  },
  dark: {
    bg: "#0f1419",
    surface: "#1a1f2e",
    primary: "#4db8c4",
    primaryHover: "#5cc8d4",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#eab308",
    text: "#f1f5f9",
    textMuted: "rgba(241,245,249,0.6)",
    border: "rgba(77,184,196,0.16)",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};
```

### Theme Creation

**src/theme/createAppTheme.js**

```javascript
import { createTheme } from "@mui/material/styles";
import { getThemeTokens } from "./getThemeTokens";

export const createAppTheme = (mode = "light") => {
  const tokens = getThemeTokens(mode);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        light: tokens.primaryLight,
        dark: tokens.primaryDark,
      },
      secondary: {
        main: tokens.secondary,
      },
      success: {
        main: tokens.success,
      },
      error: {
        main: tokens.error,
      },
      warning: {
        main: tokens.warning,
      },
      background: {
        default: tokens.bg,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.text,
        secondary: tokens.textMuted,
      },
    },
    typography: {
      fontFamily: '"Segoe UI", "Roboto", "Oxygen"',
      h1: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  });
};
```

### Using Theme in Components

```javascript
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const theme = useTheme();
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Toggle {mode === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
```

---

## 🔌 Services & API Integration

### API Client Setup

**src/services/apiClient.js**

```javascript
import axios from "axios";
import { ENV } from "@/config/env";

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

### API Endpoints

**src/services/endpoints.js**

```javascript
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Users
  USERS: {
    LIST: "/users",
    GET: (id) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    PROFILE: "/users/me/profile",
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    ACTIVITIES: "/dashboard/activities",
    CHARTS: "/dashboard/charts",
  },
};
```

### Using API Client in Services

**Example: User Service**

```javascript
import { apiClient } from "@/services/apiClient";
import { ENDPOINTS } from "@/services/endpoints";

export const userService = {
  getAll: (params) => apiClient.get(ENDPOINTS.USERS.LIST, { params }),

  getById: (id) => apiClient.get(ENDPOINTS.USERS.GET(id)),

  create: (data) => apiClient.post(ENDPOINTS.USERS.CREATE, data),

  update: (id, data) => apiClient.put(ENDPOINTS.USERS.UPDATE(id), data),

  delete: (id) => apiClient.delete(ENDPOINTS.USERS.DELETE(id)),
};
```

### Using in Components

```javascript
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 🛡️ Route Guards

### Protected Route

**src/guards/ProtectedRoute.jsx**

```javascript
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "@/features/auth/store/authSelector";
import { ROUTES } from "@/constants/routes";

export function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
```

### Guest Route

**src/guards/GuestRoute.jsx**

```javascript
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "@/features/auth/store/authSelector";
import { ROUTES } from "@/constants/routes";

export function GuestRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
```

### Permission Guard

**src/guards/PermissionGuard.jsx**

```javascript
import { useSelector } from "react-redux";
import { selectUser } from "@/features/auth/store/authSelector";
import { hasPermission } from "@/utils/permissions";
import { AccessDenied } from "@/components/common/AccessDenied";

export function PermissionGuard({ children, permission }) {
  const user = useSelector(selectUser);

  if (!hasPermission(user, permission)) {
    return <AccessDenied />;
  }

  return children;
}
```

### Using Guards in Routes

```javascript
import { PermissionGuard } from "@/guards/PermissionGuard";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <PermissionGuard permission="ADMIN_ACCESS">
          <AdminPage />
        </PermissionGuard>
      </ProtectedRoute>
    ),
  },
]);
```

---

## 🎣 Hooks & Utilities

### Custom Hooks

#### useDebounce

```javascript
import { useDebounce } from "@/hooks/useDebounce";

export function SearchUsers({ onSearch }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

#### useLocalStorage

```javascript
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar', true);

  return (
    // JSX using theme and sidebarOpen
  );
}
```

#### usePagination

```javascript
import { usePagination } from "@/hooks/usePagination";

export function UserList({ items }) {
  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
  } = usePagination(items, 10);

  return (
    <>
      {paginatedItems.map((item) => (
        <UserCard key={item.id} user={item} />
      ))}
      <Pagination
        current={currentPage}
        total={totalPages}
        onPageChange={goToPage}
      />
    </>
  );
}
```

#### useToggle

```javascript
import { useToggle } from "@/hooks/useToggle";

export function CollapsiblePanel() {
  const [isOpen, toggle] = useToggle(false);

  return (
    <>
      <button onClick={toggle}>{isOpen ? "Hide" : "Show"}</button>
      {isOpen && <PanelContent />}
    </>
  );
}
```

### Utility Functions

#### Permission Utils

```javascript
// src/utils/permissions.js
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};

export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role;
};

export const hasAnyRole = (user, roles) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};
```

#### Format Utils

```javascript
// src/utils/formatDate.js
import dayjs from "dayjs";

export const formatDate = (date) => dayjs(date).format("MMM DD, YYYY");
export const formatDateTime = (date) =>
  dayjs(date).format("MMM DD, YYYY HH:mm");
export const formatTime = (date) => dayjs(date).format("HH:mm");

// src/utils/formatCurrency.js
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};
```

#### Validation Utils

```javascript
// src/utils/validation.js
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateForm = (data, schema) => {
  const errors = {};
  Object.keys(schema).forEach((field) => {
    const validator = schema[field];
    if (!validator(data[field])) {
      errors[field] = `Invalid ${field}`;
    }
  });
  return errors;
};
```

---

## 📦 Components Structure

### Component Organization

```
src/components/
├── ui/                      # Base UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   └── ...
├── common/                  # Reusable components
│   ├── LoadingSpinner.jsx
│   ├── EmptyState.jsx
│   ├── AccessDenied.jsx
│   ├── ErrorBoundary.jsx
│   └── ...
├── layout/                  # Layout components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Container.jsx
│   └── ...
├── shared/                  # Shared features
│   ├── NotificationBell.jsx
│   ├── UserMenu.jsx
│   └── ...
├── charts/                  # Chart components
│   ├── BarChart.jsx
│   ├── LineChart.jsx
│   └── ...
└── index.js                 # Export all
```

### Component Best Practices

**Create reusable, composable components**

```javascript
// Button component example
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
```

---

## 🔨 Development Workflow

### Running Development Server

```bash
npm run dev
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Project Structure Tips

1. **Keep components focused** - One responsibility per component
2. **Use feature folders** - Group related code together
3. **Centralize configuration** - Store config in `src/config/`
4. **Use constants** - Define app constants in `src/constants/`
5. **Reuse utilities** - Create utility functions for common operations
6. **Type safety** - Add JSDoc comments for better IDE support

### Development Best Practices

- ✅ Use Redux for global state only
- ✅ Keep components small and focused
- ✅ Extract custom hooks for reusable logic
- ✅ Use selectors to access Redux state
- ✅ Implement proper error handling
- ✅ Add loading states to async operations
- ✅ Use environment variables for configuration
- ✅ Keep API logic in services, not components

---

## 🏗️ Building & Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build Locally

```bash
npm run preview
```

### Build Output

The production build includes:

- ✅ Minified and bundled JavaScript
- ✅ Optimized CSS
- ✅ Tree-shaken unused code
- ✅ Asset optimization
- ✅ Source maps for debugging

### Deployment

#### Vercel

```bash
vercel
```

#### Netlify

```bash
netlify deploy --prod --dir=dist
```

#### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

---

## 🎓 Best Practices

### Code Organization

✅ **DO:**

```javascript
// Organize imports
import React from "react";
import { Component } from "@/components";
import { useSelector } from "react-redux";
import { useCustomHook } from "@/hooks";
import { utility } from "@/utils";

// Use named exports
export function MyComponent() {
  // Component code
}
```

❌ **DON'T:**

```javascript
// Don't mix concerns
import everything from "../../../relative/paths";
// Don't use default exports
export default MyComponent;
```

### State Management

✅ **DO:**

```javascript
// Use Redux for global state
const user = useSelector(selectUser);

// Use local state for component-only state
const [isOpen, setIsOpen] = useState(false);
```

❌ **DON'T:**

```javascript
// Don't put everything in Redux
// Don't use Redux for transient UI state
```

### API Calls

✅ **DO:**

```javascript
// Create service functions
const { data } = await userService.getAll();

// Handle errors properly
try {
  await userService.create(data);
  showToast("Created successfully");
} catch (error) {
  showToast(error.message, "error");
}
```

❌ **DON'T:**

```javascript
// Don't make API calls directly in components
const { data } = await axios.get("/users");

// Don't ignore errors
await userService.create(data);
```

### Component Props

✅ **DO:**

```javascript
// Use destructuring
function Card({ title, children, variant = 'primary' }) {
  return (
    // JSX
  );
}

// Use JSDoc for documentation
/**
 * Button component
 * @param {string} variant - Button style variant
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 */
function Button({ variant, onClick, children }) {
  // Component code
}
```

---

## 📱 Responsive Design

The template uses Material UI's responsive grid system and Tailwind CSS:

```javascript
import { Box, Container, Grid } from "@mui/material";

export function ResponsiveLayout() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          {/* Content */}
        </Grid>
      </Grid>
    </Container>
  );
}
```

---

## 🧪 Testing Setup

For testing, we recommend:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Example test:

```javascript
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

test("renders button with text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Material UI Documentation](https://mui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

---

## 📝 Notes

- Keep the project structure organized as outlined
- Use the provided constants and utilities
- Follow the established patterns for routes, services, and state management
- Utilize the provider hierarchy for global state and styling
- Leverage custom hooks for reusable component logic

---

## 🤝 Contributing

When adding new features:

1. Follow the existing folder structure
2. Create feature folders under `src/features/`
3. Include necessary store, services, components, and pages
4. Export public APIs via `index.js` files
5. Update route configuration if adding routes
6. Add environment variables to `.env.example`

---

## 📄 License

This template is open source and available under the MIT License.

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build locally

```bash
npm run preview
```

### 6. Run lint checks

```bash
npm run lint
```

---

## Customizing the template

### Update environment variables

Copy `.env.example` to `.env` and update values for your API base URL or other environment-specific settings.

### Configure routes

Edit `src/app/routes.jsx` and `src/constants/routes.js` to add or adjust application routes.

### Add a new feature module

1. Create a new folder under `src/features/`
2. Add page(s), components, services, and store logic there
3. Register new routes in `src/app/routes.jsx`
4. Add navigation items in `src/config/navigation.js` or `src/config/sidebarMenu.js`

### Modify theme and styles

- Use `src/theme/tokens.js` and `src/theme/getThemeTokens.js` to adjust theme colors, typography, and spacing.
- Update `src/theme/createAppTheme.js` for Material UI theme settings.
- Add global CSS in `src/index.css` or component-level styles in `src/assets/styles/globals.css`.

### Extend state management

- Add new Redux slices inside `src/features/<feature>/store/`
- Export selectors and thunks from each feature folder
- Combine slices in `src/store/rootReducer.js`
- Use the store via `src/providers/ReduxProvider.jsx`

---

## Auth and routing flow

This template includes a basic auth flow and route protection:

- `src/features/auth/pages/` contains auth pages like `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`
- `src/guards/ProtectedRoute.jsx` protects authenticated routes
- `src/guards/GuestRoute.jsx` prevents signed-in users from visiting auth pages
- `src/guards/PermissionGuard.jsx` restricts access based on permissions
- `src/features/auth/store/` contains `authSlice`, `authThunk`, and selectors for auth state

---

## Recommended workflow

1. Start by renaming the project in `package.json`.
2. Replace placeholder pages with your own dashboard and feature pages.
3. Connect `src/services/apiClient.js` to your backend API.
4. Use the existing layout components to keep a consistent app shell.
5. Reuse `src/utils/`, `src/hooks/`, and `src/providers/` for new features.

---

## Useful developer tips

- Keep shared logic in `src/components/`, `src/hooks/`, and `src/utils/`.
- Keep feature-specific logic inside `src/features/<feature>/`.
- Use `src/config/` for navigation and sidebar behavior rather than hardcoding values in UI.
- Keep UI and business logic separate by using service files and Redux for API calls.
- Use route guards for secure pages and public pages.

---

## Dependencies

Key libraries included in this template:

- `react`
- `react-dom`
- `react-router-dom`
- `@reduxjs/toolkit`
- `react-redux`
- `@mui/material`
- `@mui/icons-material`
- `@mui/x-charts`
- `axios`
- `dayjs`
- `framer-motion`
- `react-icons`
- `vite`
- `eslint`

---

## Next steps after cloning

- Replace the example auth and dashboard pages with your application content.
- Configure API endpoints in `src/services/endpoints.js`.
- Update the sidebar navigation in `src/config/sidebarMenu.js`.
- Add tests or Storybook if you want to extend the boilerplate to a full development platform.

---

## License

This starter template is open for your use and modification. Add a license file if you want to publish it for reuse or open-source distribution.
