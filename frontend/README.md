# Todo App Frontend

React + Vite + Axios + TypeScript

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Dev server runs on http://localhost:5173

### Dev Proxy
Vite is configured to proxy `/api/*` requests to `http://localhost:4000` (the backend).

## Build

```bash
npm run build
```

Outputs to `dist/`

## Preview

```bash
npm run preview
```

## Configuration

### API Base URL

By default, the frontend uses `/api` (proxied to backend in dev, or your backend domain in production).

To override, set `VITE_API_URL` environment variable:

#### Option 1: Create `.env.local`
```
VITE_API_URL=https://your-backend-domain.com/api
```

#### Option 2: Set via command line (PowerShell)
```powershell
$env:VITE_API_URL = "https://your-backend-domain.com/api"
npm run dev
```

#### Option 3: ngrok + .env.local
```
VITE_API_URL=https://abcd-1234.ngrok.io/api
```

## Project Structure

```
src/
├── main.tsx       # React entry point
├── App.tsx        # Main component with task CRUD UI
└── api/
    └── axios.ts   # Axios instance with configured base URL
```

## Features

- List all tasks
- Create new task
- Edit task title
- Toggle completion status
- Delete task
- Loading state
- Error handling with alerts

## Dependencies

### Production
- `react` — UI framework
- `react-dom` — DOM rendering
- `axios` — HTTP client

### Development
- `vite` — Build tool & dev server
- `@vitejs/plugin-react` — React plugin for Vite
- `typescript` — TypeScript
- Type definitions for all packages

## Vite Dev Proxy

The `vite.config.ts` includes a proxy configuration:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

This allows you to write API calls like `axios.get('/api/tasks')` and they'll be forwarded to the backend during development.

## Troubleshooting

**Can't connect to backend?**
- Ensure backend is running on http://localhost:4000
- Check browser console for CORS errors
- Verify proxy settings in `vite.config.ts`

**ngrok URL not working?**
- Create/update `frontend/.env.local` with your ngrok URL
- Restart the dev server after changing env variables
- Ensure ngrok tunnel is still active

**API calls return 404?**
- Check backend routes are correct
- Verify `/api` path prefix (frontend sends `/api/tasks`, etc.)
- Review backend console for errors
