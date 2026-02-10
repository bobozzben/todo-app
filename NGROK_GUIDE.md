# 使用 ngrok 進行反向代理

ngrok 可以將你的本地服務暴露到網際網路上，方便協作與遠端測試。

## 安裝 ngrok

### 方法 1: 從官網下載
1. 訪問 https://ngrok.com/download
2. 下載 Windows 版本
3. 解壓到任意目錄
4. 將目錄加入 PATH 環境變數（或在該目錄開啟終端）

### 方法 2: 使用 winget (推薦)
```powershell
winget install ngrok.ngrok
```

### 方法 3: 使用 Chocolatey
```powershell
choco install ngrok
```

## 快速開始

### Terminal 1: 啟動後端
```powershell
cd f:\ADSProject\todo-app\backend
npm run dev
# 伺服器於 http://localhost:4000 運行
```

### Terminal 2: 啟動 ngrok 隧道
```powershell
ngrok http 4000
```

輸出範例：
```
ngrok by @inconshreveable

Session Status                online
Account                       <your-account>
Update                        update available (version 3.0.0, Ctrl-U to update)
Version                       3.0.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abcd-1234.ngrok.io -> http://localhost:4000
```

現在你的後端可以通過 **https://abcd-1234.ngrok.io** 存取。

## 測試 ngrok 隧道

### 方法 1: curl 測試
```powershell
# 健康檢查
curl https://abcd-1234.ngrok.io/health

# 列出任務
curl https://abcd-1234.ngrok.io/api/tasks
```

### 方法 2: PostMan / Insomnia
1. 匯入後端路由到 API 客戶端
2. 將基礎 URL 改為 `https://abcd-1234.ngrok.io`
3. 發送請求測試

### 方法 3: 前端連接

#### 選項 A: 編輯 frontend/.env.local
```
VITE_API_URL=https://abcd-1234.ngrok.io/api
```

#### 選項 B: 手動設定環境變數後啟動
```powershell
cd f:\ADSProject\todo-app\frontend

# PowerShell 方式
$env:VITE_API_URL = "https://abcd-1234.ngrok.io/api"
npm run dev

# 或 cmd.exe 方式
set VITE_API_URL=https://abcd-1234.ngrok.io/api && npm run dev
```

## ngrok 細節

### URL 變動
每次重啟 ngrok，URL 地址都會改變。如果需要固定 URL，請在 ngrok 帳戶升級到付費方案。

### 隧道監控
ngrok 提供 Web 監控介面：http://127.0.0.1:4040

在此可以看到所有進出的 HTTP/HTTPS 請求、回應內容等。

### 帶有認證的 ngrok (進階)

若要保護隧道（防止他人任意存取），可加入基本認證：

```powershell
# 設定認證
ngrok config add-authtoken YOUR_AUTHTOKEN

# 啟動有認證的隧道
ngrok http --auth="user:password" 4000
```

### 自訂子網域 (Pro 方案以上)

```powershell
ngrok http --subdomain=my-todo-app 4000
# https://my-todo-app.ngrok.io
```

## 常見問題

**為什麼每次重啟 URL 都不同？**
- 免費版 ngrok 每次啟動都會分配新 URL
- 付費版可以選購自訂網域或固定 URL

**ngrok 顯示 "Access denied" 或 "Bad Gateway"?**
- 確認後端正在 `http://localhost:4000` 運行
- 檢查防火牆是否阻止了通訊
- 試試重啟 ngrok

**前端連接到 ngrok URL 後出現 CORS 錯誤?**
- 後端已啟用 CORS (見 `backend/src/index.ts`)
- 確認 URL 格式正確，帶有 `/api` 前綴

**如何停止 ngrok?**
- 在 ngrok 終端按 `Ctrl+C`

## 場景範例

### 場景 1: 本地開發 + ngrok 暴露測試
```powershell
# Terminal 1: 後端
cd backend && npm run dev

# Terminal 2: ngrok 隧道
ngrok http 4000

# Terminal 3: 前端 (本地)
cd frontend && npm run dev
# 前端使用 localhost:4000 (dev proxy)，無需改 env

# 整安其他人可以訪問 https://abcd-1234.ngrok.io 測試後端 API
```

### 場景 2: 前端也指向 ngrok (手機測試或遠端測試)
```powershell
# Terminal 1: 後端
cd backend && npm run dev

# Terminal 2: ngrok
ngrok http 4000
# 得到 URL: https://abcd-1234.ngrok.io

# Terminal 3: 前端
cd frontend
$env:VITE_API_URL = "https://abcd-1234.ngrok.io/api"
npm run dev

# 開啟 http://localhost:5173 (或其他電腦訪問該 IP)
# 前端改為呼叫 ngrok 的後端
```

### 場景 3: 完全遠端測試（前端也暴露）

若要讓前端也遠端存取，可使用多個 ngrok 隧道或改用 Vercel/Netlify for 前端：

```powershell
# Terminal 1: 後端
cd backend && npm run dev

# Terminal 2: ngrok for 後端
ngrok http 4000                    # https://back-xxxx.ngrok.io

# Terminal 3: ngrok for 前端
cd frontend && npm run build
# 使用另一隻 ngrok 或直接部署到 Vercel
ngrok http -p dist 3000           # https://front-xxxx.ngrok.io
```

## 延伸閱讀

- ngrok 官方文件: https://ngrok.com/docs
- ngrok CLI 指令: `ngrok help`
