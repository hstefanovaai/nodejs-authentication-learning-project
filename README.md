<img width="783" height="448" alt="image" src="https://github.com/user-attachments/assets/fc7f9f70-8752-4759-b9e7-325a595c9539" />

# Plan:

<img width="715" height="262" alt="image" src="https://github.com/user-attachments/assets/b07069e2-3d90-4618-9850-7293c0c96d74" />

# What each library does:
<img width="715" height="258" alt="image" src="https://github.com/user-attachments/assets/ae69a274-f6b9-4933-91cb-f8f2216b478b" />



## Running it

Two terminals.

```bash
# terminal 1
cd server
cp .env.example .env   # already done once; keep .env out of git
npm run dev            # http://localhost:4000

# terminal 2
cd client
npm run dev            # http://localhost:5173
```

Open http://localhost:5173 — the card should say `API status: ok`. If it says
`unreachable`, the server terminal is not running.

## How the two halves talk

The Vite dev server proxies anything starting with `/api` to
`http://localhost:4000` (see `client/vite.config.ts`). So in React you fetch
`/api/health`, never `http://localhost:4000/api/health`.

This matters more than it looks: to the browser, the API appears to live on the
*same origin* as the React app. Same-origin requests make cookie-based
authentication behave in development the way it will in production. CORS is
also configured on the server as a fallback for when you call the API directly
(from Postman, curl, or a deployed frontend on another domain).

## Server layout

```
server/src/
├── index.ts          # entry point — starts the HTTP listener
├── app.ts            # builds the Express app: middleware + route mounting
├── config/env.ts     # reads and validates environment variables, once
├── routes/           # URL → controller mapping only
├── controllers/      # read the request, call a service, shape the response
├── services/         # business logic; knows nothing about req/res
├── models/           # database schema / data access
├── middleware/       # cross-cutting concerns (auth, validation, errors)
├── utils/            # small helpers
└── types/            # shared TypeScript types
```

Most folders are empty placeholders. The plan fills them in order.

Two conventions worth noticing now:

1. **`app.ts` and `index.ts` are separate.** `createApp()` returns a configured
   Express app without starting a server. That is what makes the app testable
   later — a test can create the app and fire requests at it without binding a
   port.
2. **Relative imports end in `.js`.** The project is native ESM
   (`"type": "module"`), where Node requires the file extension at runtime. You
   write `./config/env.js` even though the file on disk is `env.ts`, because
   `.js` is what the compiled output will be. TypeScript understands this.

## Scripts

| Location | Command | What it does |
| --- | --- | --- |
| `server/` | `npm run dev` | Runs with `tsx watch` — restarts on save, no build step |
| `server/` | `npm run typecheck` | Type errors only, emits nothing |
| `server/` | `npm run build` | Compiles `src/` → `dist/` |
| `server/` | `npm start` | Runs the compiled output |
| `client/` | `npm run dev` | Vite dev server with HMR |
| `client/` | `npm run build` | Typecheck + production bundle |
| `client/` | `npm run lint` | oxlint |
