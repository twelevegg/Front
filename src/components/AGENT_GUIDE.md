# Components Directory Guide

## Purpose
This directory contains the reusable UI building blocks (Design System) of the application. Components here should be **pure presentational components** whenever possible, receiving data and callbacks via props.

## Structure
-   `common/`: Generic, atomic components (Modals, Toasts).
-   `layout/`: (Optional) specialized layout parts if not in `src/layouts`.
-   Root level: Frequently used atoms/molecules (`Card`, `Badge`, `Pill`).

## Key Components

### `Card.jsx`
-   **Usage**: The primary container for dashboard widgets.
-   **Style**: Glassmorphic styling is applied by default or via props.
-   **Props**: `className`, `children`, `hoverEffect` (boolean).

### `Badge.jsx` / `Pill.jsx`
-   **Usage**: Status indicators.
-   **Tones**: `High` (Red), `Medium` (Yellow/Orange), `Low` (Green), `Normal` (Blue/Gray).
-   **Difference**: `Badge` is usually smaller/inline. `Pill` is a rounded capsule.

### `Sidebar.jsx`
-   **Usage**: Main navigation.
-   **Behavior**: Responsive, sticky, or floating depending on screen size (currently floating desktop).
-   **Role-Based**: Renders different menu items based on `user.role` (admin vs assistant).

### `common/NotificationModal.jsx`
-   **Usage**: Notification center popover.
-   **Features**: Master-detail view, entrance animations.

### `common/ToastProvider.jsx`
-   **Usage**: Global toast notifications.
-   **Hook**: `useToast()` -> `{ addToast }`.

## Design System Rules
1.  **Tailwind First**: Use Tailwind utility classes.
2.  **Colors**: Use `slate-*` for neutrals, `blue-*` for primary actions.
3.  **Typography**: `font-extrabold` for headers, `font-medium`/`semibold` for UI text.
4.  **Icons**: Use `lucide-react` icons (e.g., `<Home size={20} />`).
