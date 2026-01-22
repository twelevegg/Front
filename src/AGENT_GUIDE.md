# CS-Navigator Front-End Developer Guide

## Overview
This project is a React-based frontend for the CS-Navigator counseling platform. It is designed to be a "Glassmorphic", premium dashboard for call center agents and administrators.

## Tech Stack
-   **Framework**: React 18 + Vite
-   **Routing**: React Router DOM v6
-   **Styling**: Tailwind CSS v4 (with custom glassmorphism utilities)
-   **Icons**: Lucide React
-   **Charts**: Recharts
-   **State Management**: React Context API (AuthProvider, CoPilotProvider, ToastProvider)
-   **Animation**: Framer Motion

## Project Structure
The project follows a modified feature-slice + layered architecture:

-   `src/app`: Global app configuration, routes, and main entry point logic.
-   `src/components`: Reusable UI components (Design System).
-   `src/features`: Business logic slices grouped by domain (auth, calls, copilot).
-   `src/layouts`: Page layouts (e.g., AppLayout, AuthShell).
-   `src/pages`: Page components that map to routes.
-   `src/store`: Global store configuration (if using Redux/Zustand - currently minimal).
-   `src/styles`: Global CSS and Tailwind configuration.

## Key Conventions
1.  **Glassmorphism**: Use `bg-white/70`, `backdrop-blur-xl`, `border-white/20` for panels.
2.  **Absolute Imports**: Use relative imports for now (e.g., `../../components`). *TODO: Configure aliases.*
3.  **Components**: Functional components with hooks.
4.  **Tailwind**: Utility-first styling. Use `index.css` for complex utilities like `.glass-panel`.

## Getting Started
1.  `npm install`
2.  `npm run dev`

## Useful Commands
-   **Search**: Use `grep_search` to find code.
-   **Icons**: Look up icons in `lucide-react` docs or checking imports.

---
**Note for Agents**: When modifying this codebase, always maintain the "Premium/Glass" aesthetic. Avoid flat, solid colors for main containers.
