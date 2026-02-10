# Todo App Backend

Express + TypeScript + Prisma + Zod

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## Development

```bash
npm run dev
```

Server runs on http://localhost:4000

## Testing

```bash
npx jest
```

## Scripts

- `npm run dev` — 開發模式（自動重啟）
- `npm run build` — 編譯 TypeScript
- `npm start` — 啟動編譯後的程式
- `npm run prisma:generate` — 產生 Prisma client
- `npm run prisma:migrate` — 執行資料庫遷移

## API Routes

All routes prefixed with `/api`:

### Tasks
- `GET /tasks` — List all tasks
- `GET /tasks/:id` — Get a specific task
- `POST /tasks` — Create a task
  - Body: `{ title: string, description?: string, completed?: boolean }`
  - Validation: Zod
- `PUT /tasks/:id` — Update a task
  - Body: `{ title?, description?, completed? }`
- `DELETE /tasks/:id` — Delete a task

### Health Check
- `GET /health` — Returns `{status: 'ok'}`

## Environment Variables

Create `.env` from `.env.example`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/todo_app"
PORT=4000
```

## Database

PostgreSQL with Prisma ORM.

### Models
- Task: id, title, description, completed, createdAt, updatedAt

## Error Handling

- Zod validation errors → 400 status + validation issues
- Record not found (Prisma P2025) → 404 status
- Other errors → 500 status with error message
- 404 endpoint → 404 status with 'Not found'

## Dependencies

### Production
- `express` — Web framework
- `@prisma/client` — ORM
- `zod` — Schema validation
- `cors` — CORS middleware
- `dotenv` — Environment config

### Development
- `typescript` — TypeScript
- `ts-node-dev` — Development runner
- `jest`, `ts-jest` — Testing
- `supertest` — HTTP testing
- Type definitions for all packages
