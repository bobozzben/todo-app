# Todo App

Monorepo for a fullstack Todo application with Express + React + PostgreSQL + Prisma.

Folders:
- `backend/` — Node + Express + TypeScript + Prisma + Zod
- `frontend/` — React + Vite + Axios

## Quick Start

### Prerequisites
- Node.js (v18+) & npm ✓ (已安裝)
- PostgreSQL (v12+) ✓ (已設定)
- ngrok (選用，用於 localhost 反向代理)

### Setup (已完成)

#### 後端 ✓
```powershell
cd backend
npm install           # ✓ 已完成
npx prisma generate  # ✓ 已完成
npx prisma migrate   # ✓ 已完成
```

#### 前端 ✓
```powershell
cd frontend
npm install           # ✓ 已完成
```

## Running the Application

### Terminal 1: 啟動後端 (http://localhost:4000)
```powershell
cd backend
npm run dev
# 或測試健康檢查：curl http://localhost:4000/health
```

### Terminal 2: 啟動前端 (http://localhost:5173)
```powershell
cd frontend
npm run dev
```

前端已配置 Vite dev proxy，自動將 `/api/*` 轉發至 `http://localhost:4000`。

## 功能清單
- ✓ 建立/編輯/刪除/完成切換任務
- ✓ Express + TypeScript 後端
- ✓ React + Vite 前端
- ✓ PostgreSQL + Prisma ORM
- ✓ Zod 驗證 (後端)
- ✓ 錯誤中介與 CORS
- ✓ Jest + Supertest 單元測試

## API 路由
- `GET /api/tasks` — 列出所有任務
- `GET /api/tasks/:id` — 取得單個任務
- `POST /api/tasks` — 建立任務 (`{title, description?}`)
- `PUT /api/tasks/:id` — 更新任務
- `DELETE /api/tasks/:id` — 刪除任務

## ngrok 用法 (選用)

若要將 localhost 暴露給外部：

```powershell
# Terminal 3
ngrok http 4000
```

取得公開 URL (如 `https://abcd-1234.ngrok.io`)。

### 選項 A：直接測試 ngrok
```powershell
curl https://abcd-1234.ngrok.io/api/tasks
```

### 選項 B：讓前端指向 ngrok URL
建立 `frontend/.env.local`:
```
VITE_API_URL=https://abcd-1234.ngrok.io/api
```
重啟前端伺服器即可。

## 專案結構
```
todo-app/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express 進入點
│   │   ├── routes/tasks.ts       # 任務路由 (CRUD)
│   │   ├── middleware/           # 錯誤處理
│   │   ├── validators/           # Zod schemas
│   │   └── prismaClient.ts
│   ├── prisma/schema.prisma      # DB 模型
│   └── package.json, tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # 主 UI 元件
│   │   ├── api/axios.ts          # Axios 設定
│   │   └── main.tsx              # React 進入點
│   ├── index.html, vite.config.ts
│   └── package.json, tsconfig.json
└── README.md
```

## 疑難排解

**後端無法啟動？**
- 檢查 DATABASE_URL 是否有效
- 確認 PostgreSQL 運行中
- 嘗試 `npx prisma db push`

**前端 /api 呼叫 404？**
- 確認後端正在 :4000 運行
- 檢查 `frontend/vite.config.ts` 的 proxy 設定

**Migration 錯誤？**
- 重建資料庫：`dropdb -U postgres todo_app && createdb -U postgres todo_app`
- 重跑 migration：`npx prisma migrate dev --name init`
