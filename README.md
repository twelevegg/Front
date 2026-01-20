# Front (CS-Navigator)

## Install
```bash
npm install
```

## Run (dev)
```bash
npm run dev
```

## Notes
- This project uses **Vite + React**.
- Tailwind v4 is wired via `@tailwindcss/vite` and `@import "tailwindcss"` in `src/styles/index.css`.
- Role-based sidebar:
  - role=admin: Admin Dashboard + Assistant Dashboard
  - role=assistant: Assistant Dashboard only
- `Training Center` shows a hover submenu: PPT 교육 / RolePlaying.
- CoPilot modal pops up on a simulated call event. Use the button on Call history page.

Replace the dev role switch in the topbar with your real login flow.
