# Pages Directory Guide

## Purpose
This directory contains the top-level Page components that correspond to routes in the application.

## Structure
-   `auth/`: Login, SignUp pages.
-   `dashboards/`: Dashboard pages (Admin, Assistant, Analysis).
-   `training/`: Training pages (PPT, Roleplay).
-   Root level: Generic pages (`CallHistoryPage`, `CaseLibraryPage`).

## Key Pages

### `auth/`
-   `LoginPage.jsx`: Entry point.
-   `SignUpPage.jsx`: Multi-step registration flow.

### `dashboards/`
-   `AdminDashboardPage.jsx`: Overview for managers. Interactive charts & team filters.
-   `AssistantDashboardPage.jsx`: Personal metrics for counselors. Chart toggles & CoPilot trigger.
-   `AdminAnalysisPage.jsx`: Detailed analytics (Attrition, Burnout).

### `training/`
-   `PptTrainingPage.jsx`: Document-based training.
-   `RolePlayingPage.jsx`: Voice-based interactive training (simulated).

## Routing
-   Routes are defined in `src/app/App.jsx`.
-   URL constants are in `src/app/routeConstants.js`.
-   **Always** use `ROUTES.*` constants for navigation, never hardcoded strings.

## How to Add a New Page
1.  Create `NewPage.jsx`.
2.  Add a route in `src/app/routeConstants.js`.
3.  Import and add `<Route>` in `src/app/App.jsx`.
4.  Add a `RequireRole` wrapper if it needs specific permissions.
