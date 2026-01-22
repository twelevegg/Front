# App Configuration Guide

## Purpose
The `app` directory serves as the "brain" of the frontend application. It contains global configuration, routing definitions, route guards, and the main entry component.

## Key Files

### `App.jsx`
-   **Role**: Main Application Component.
-   **Responsibility**: Defines the `<Routes>` structure.
-   **Structure**:
    -   Public Routes (`/login`, `/signup`)
    -   Protected Routes (Wrapped in `<RequireAuth>`)
        -   Admin Routes (Wrapped in `<RequireRole allow={['admin']}>`)
        -   Assistant Routes
        -   Common Routes

### `routeConstants.js`
-   **Role**: Single source of truth for URL paths.
-   **Usage**: Import `ROUTES` from here instead of hardcoding strings.
-   **Example**: `ROUTES.DASH_ADMIN` instead of `'/dashboard/admin'`.

### `RequireAuth.jsx`
-   **Role**: Route Guard.
-   **Logic**: Checks if `user` exists in `AuthContext`. If not, redirects to `ROUTES.LOGIN`.

### `RequireRole.jsx`
-   **Role**: RBAC (Role-Based Access Control) Guard.
-   **Logic**: Checks if `user.role` is in the `allow` array. If not, redirects to home or shows permission denied.

### `HomeRedirect.jsx`
-   **Role**: Smart redirector for the root path (`/`).
-   **Logic**: Redirects admins to Admin Dashboard and assistants to Assistant Dashboard automatically.

## State Management
-   Global providers (`AuthProvider`, etc.) wrap `<App />` in `src/main.jsx`, NOT inside `App.jsx` itself.
