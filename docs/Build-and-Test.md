# Build and Test Runbook

This runbook outlines the recommended commands for building, linting and previewing the Mechanico frontend. All commands are assumed to be run from the project root (`mechanico-main`).

## Install dependencies

Before running any scripts, install the project’s dependencies using npm (you can also use yarn or pnpm if preferred):

```bash
npm install
```

This will populate `node_modules` with the versions specified in `package.json`. No network calls occur at runtime – all data used in the UI is static or mocked.

## Lint and type‑check

Type checking and linting help catch errors early.

1. **Type‑check** using the TypeScript compiler:

   ```bash
   npx tsc --noEmit
   ```

   This runs the compiler against `tsconfig.json` without producing output files.

2. **Lint** the codebase with ESLint:

   ```bash
   npm run lint
   ```

   The script uses the configuration in `eslint.config.js` and reports any issues.

## Development server

To run a live‑reload development server on <http://localhost:5173>:

```bash
npm run dev
```

This uses Vite under the hood. The console will display the local URL once the server is ready.

## Production build

Generate an optimised production build with:

```bash
npm run build
```

The output is written to the `dist` directory. To test the built files locally, use Vite’s preview server:

```bash
npm run preview
```

This serves the `dist` folder on a local port (default 4173) and should behave exactly as it would in production.

## Quick UI checklist

When reviewing the build, walk through the following high‑level flows:

1. **Authentication** – Confirm that the demo credentials buttons populate the form and that the loading state disables the submit button correctly.
2. **Dashboard** – Verify that charts render, labels align to the right edge and tooltips appear to the left of the cursor.
3. **Navigation** – Test the sidebar/menu on desktop and mobile sizes. Ensure the off‑canvas menu opens from the right and that focus returns to the trigger when closed.
4. **Forms and tables** – Check that form fields align nicely, labels appear on the right side and tables scroll horizontally on small screens without breaking layout.
5. **Settings pages** – Save buttons should sit on the logical end (`ms‑auto`), and toggles should have clear focus rings and accessible labels.

Performing these manual checks after each build helps maintain a high‑quality, RTL‑correct interface.