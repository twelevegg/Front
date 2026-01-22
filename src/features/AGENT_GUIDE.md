# Features Directory Guide

## Purpose
The `features` directory contains the business logic of the application, organized by domain. Each folder represents a specific feature slice.

## Structure
Each feature folder typically contains:
-   `*Provider.jsx`: Context provider for global state (e.g., `AuthProvider`).
-   `*Events.js`: Event emitters/listeners for decoupled communication (e.g., `callEvents.js`).
-   `mock*.js`: Mock data for development.
-   `api.js`: API integration logic (currently mocked).

## Existing Features

### `auth`
-   **Responsibility**: Authentication, session management, user roles.
-   **Key Files**:
    -   `AuthProvider.jsx`: Manages `user` state, `login`, `logout`.
    -   `signupApi.js`: Mock API for user registration.

### `calls`
-   **Responsibility**: Call handling, simulation, and event broadcasting.
-   **Key Files**:
    -   `callEvents.js`: `emitCallConnected` is used to trigger the CoPilot modal from anywhere.
    -   `mockCalls.js`: Sample call history data.

### `copilot`
-   **Responsibility**: The AI assistant overlay that appears during calls.
-   **Key Files**:
    -   `CoPilotProvider.jsx`: Manages the visibility and state of the CoPilot modal.
    -   `CoPilotModal.jsx`: The actual UI for the assistant.

### `training`
-   **Responsibility**: Training modules (PPT, Roleplay).
-   **Key Files**:
    -   (Currently mostly page-level logic, moving logic here in future).

## How to Add a New Feature
1.  Create a folder `src/features/<feature-name>`.
2.  Add state management (`Context` or simple hooks).
3.  Add mock data if backend is not ready.
4.  Export components/hooks to be used in `pages`.
