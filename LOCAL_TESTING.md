# 本地測試指南

本指南將幫助你在本地機器上測試完整的待辦事項應用。

## 前置條件

- Node.js 16+ 和 npm
- PostgreSQL 資料庫已安裝並配置
- 兩個 Terminal 視窗（一個用於後端，一個用於前端）

## 步驟 1: 配置環境變數

### 後端配置

在 `backend/.env` 中檢查以下設置：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"
JWT_SECRET="your-secret-key-change-this"
NODE_ENV="development"
```

### 前端配置

在 `frontend/.env` 中檢查：

```env
VITE_API_URL="http://localhost:4000/api"
```

## 步驟 2: 初始化資料庫

在後端目錄運行：

```bash
cd backend
npx prisma migrate dev --name init
```

這會創建所有必要的資料表（User 和 Task）。

## 步驟 3: 啟動後端

在第一個 Terminal 視窗中：

```bash
cd backend
npm run dev
```

你應該看到：
```
Express server running on http://localhost:4000
```

## 步驟 4: 啟動前端

在第二個 Terminal 視窗中：

```bash
cd frontend
npm run dev
```

你應該看到：
```
  VITE v5.4.21  ready in 123 ms
  ➜  Local:   http://localhost:5173/
```

## 步驟 5: 測試應用

1. 打開瀏覽器並轉到 `http://localhost:5173/`
2. 你應該看到登入/註冊頁面

### 測試功能

#### 1. 建立新帳戶

- 點擊「沒有帳戶？建立一個」
- 填入以下信息：
  - 姓名：Your Name
  - 電子郵件：user@example.com
  - 密碼：password123
- 點擊「建立帳戶」

#### 2. 查看待辦事項列表

- 註冊成功後，你應該看到待辦事項列表頁面
- 頁面應該顯示：
  - 歡迎信息「歡迎，Your Name」
  - 空的待辦事項列表
  - 新增任務輸入框

#### 3. 新增待辦事項

- 在「新增待辦事項...」輸入框中輸入：「學習 TypeScript」
- 點擊「新增」按鈕
- 任務應該立即出現在列表中

#### 4. 編輯任務

- 點擊任務旁邊的「編輯」按鈕
- 修改任務標題
- 點擊「保存」

#### 5. 完成任務

- 點擊任務左邊的勾選框
- 任務應該被標記為完成（灰色顯示）

#### 6. 刪除任務

- 點擊「刪除」按鈕
- 確認刪除
- 任務應該被移除

#### 7. 登出

- 點擊右上角的「登出」按鈕
- 你應該返回登入頁面

#### 8. 登入

- 使用之前建立的帳戶登入
- 輸入電子郵件和密碼
- 點擊「登入」
- 你應該看到之前建立的任務

## 多用戶測試

為了測試用戶隔離功能：

1. 建立第二個帳戶（例如 user2@example.com）
2. 在第二個帳戶中添加一些任務
3. 登出並以第一個帳戶登入
4. 驗證你只能看到該帳戶的任務

## 故障排除

### 連接資料庫失敗

```
Error: P1000: Can't reach database server at `localhost:5432`
```

解決方案：
- 確認 PostgreSQL 正在運行
- 檢查 DATABASE_URL 中的連接字符串
- 確認資料庫用户/密码正確

### 前端無法連接後端

```
Error: Network Error
```

解決方案：
- 確認後端運行在 http://localhost:4000
- 檢查瀏覽器控制台是否有 CORS 錯誤
- 確認 VITE_API_URL 正確

### Token 過期

- 重新登入
- 新的 7 天 Token 將被生成

## API 端點測試（使用 curl）

### 註冊

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'
```

### 登入

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 建立任務（需要 Token）

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Task"
  }'
```

## UI 特點

### 設計特性

- 紫色漸變背景（#667eea → #764ba2）
- 白色卡片式佈局
- 平滑的懸停效果和過渡
- 完整的中文用戶界面
- 響應式設計，適應各種螢幕尺寸

### 功能亮點

- ✅ 即時表單驗證
- ✅ 用戶隔離（每個用戶只能看到自己的任務）
- ✅ 安全的 JWT 認證
- ✅ 密碼用 bcrypt 加密
- ✅ 7 天 Token 過期時間
- ✅ 完全響應式設計

## 後續步驟

測試完成後，你可以：

1. 部署到雲平台（Railway、Vercel、Netlify 等）
   - 參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

2. 使用 ngrok 進行本地測試
   - 參考 [NGROK_GUIDE.md](./NGROK_GUIDE.md)

3. 添加更多功能
   - 任務分類
   - 優先級排序
   - 截止日期提醒
   - 團隊協作

## 常見問題

**Q: 如何重置資料庫？**
A: 運行 `npx prisma migrate reset --force`

**Q: 如何查看資料庫內容？**
A: 運行 `npx prisma studio` 然後訪問 http://localhost:5555

**Q: Token 儲存在哪裡？**
A: Token 儲存在瀏覽器的 localStorage 中，鍵名為 `authToken`

**Q: 如何更改 JWT 秘密？**
A: 在 `backend/.env` 中更改 `JWT_SECRET` 的值
