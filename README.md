# react-scaffold

## Backend (Node + TypeScript)

This repo now includes a minimal Express backend under `backend/` that exposes `/health`, `/query`, and `/insert` endpoints using raw SQL statements.

### Setup

1. `cd backend`
2. `cp .env.example .env` and update `DATABASE_URL` if needed.
3. `npm install`
4. `npm i --save-dev @types/pg`
5. `npm i --save-dev @types/cors`

### Running locally

```bash
npm run dev
```

The server listens on `http://localhost:4000` by default and expects JSON payloads like:

```bash
curl -X POST http://localhost:4000/query \\
  -H 'Content-Type: application/json' \\
  -d '{\"sql\": \"SELECT * FROM my_table WHERE id = $1\", \"params\": [1]}'
```

⚠️ These endpoints execute whatever SQL you send them. Only keep this setup for local development.

## Frontend (React + Vite)

The `react-app/` directory houses the Vite-powered React frontend.

### Setup

1. `cd react-app`
2. `npm install`

### Development workflow

- `npm run dev` — start the Vite dev server (defaults to http://localhost:5173 with HMR).
- `npm run build` — create an optimized production build under `dist/`.
- `npm run preview` — serve the contents of `dist/` locally to spot-check the production build.

Point API calls at the backend (e.g., `fetch('http://localhost:4000/query', ...)`) while both dev servers are running.

### Example React-to-backend call

```tsx
async function runQuery() {
  const response = await fetch('http://localhost:4000/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sql: 'SELECT * FROM widgets WHERE id = $1',
      params: [42],
    }),
  });

  if (!response.ok) {
    throw new Error('Backend error');
  }

  const data = await response.json();
  console.log(data.rows); // do something with rows/rowCount
}
```

Call `runQuery()` from a component event handler (e.g., inside a button click) to send raw SQL through the backend while developing locally.
