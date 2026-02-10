# 部署指引

本指南涵蓋如何將前後端分別部署到常見的平臺。

## 目錄

1. [前端部署](#前端部署)
   - [Vercel](#vercel-推薦前端)
   - [Netlify](#netlify)
   - [Railway](#railway)

2. [後端部署](#後端部署)
   - [Railway](#railway-推薦後端)
   - [Heroku](#heroku)
   - [Render](#render)

3. [整合](#整合)

---

## 前端部署

### Vercel (推薦前端)

Vercel 是 Vite/React 應用的最佳選擇，部署簡單且免費。

#### 步驟

1. **推送到 GitHub**
   ```bash
   git init
   git remote add origin https://github.com/yourusername/todo-app.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **在 Vercel 中新建項目**
   - 訪問 https://vercel.com/new
   - 選擇 "Import Git Repository"
   - 連接你的 GitHub
   - 選擇 `todo-app` 倉庫

3. **配置設定**
   - **Project Name**: `todo-app-frontend` (或任意)
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **設定環境變數**
   - 在 Vercel 項目設定 → Environment Variables
   - 若後端在 Railway 上：
     ```
     VITE_API_URL=https://your-backend-railway-url/api
     ```

5. **部署**
   - 點擊 "Deploy"
   - 等待完成，Vercel 會給你一個公開 URL (如 `https://todo-app-frontend.vercel.app`)

#### 後續推送
每次 push 到 `main` 分支，Vercel 會自動重新部署。

---

### Netlify

另一个前端部署选项。

#### 步驟

1. **連接 Netlify**
   - 訪問 https://app.netlify.com
   - "New site from Git" → 連接 GitHub

2. **配置**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **環境變數**
   - Site settings → Build & deploy → Environment
   - 設定 `VITE_API_URL=https://your-backend-url/api`

4. **部署**
   - Netlify 會自動部署

---

### Railway (多功能平台)

Railway 可同時部署前後端，並易於管理環境變數與資料庫。

#### 步驟

1. **推送到 GitHub**
   - 同上

2. **在 Railway 中建立項目**
   - 訪問 https://railway.app
   - "New Project" → "Deploy from GitHub repo"
   - 授權 GitHub 並選擇 `todo-app`

3. **配置前端服務**
   - Add Service → GitHub Repo (同一個倉庫)
   - 設定環境變數
     ```
     VITE_API_URL=https://your-backend-railway-url/api
     ```
   - Build: `npm run build --prefix frontend`
   - Start: 無需（靜態應用）
   - 發佈目錄設為 `frontend/dist`

4. **部署**
   - Railway 會自動取得公開域名

---

## 後端部署

### Railway (推薦後端)

Railway 提供簡單的 Node.js 部署方案，並內建 PostgreSQL 支援。

#### 步驟

1. **訪問 Railway 儀表板**
   - https://railway.app

2. **新建 PostgreSQL 資料庫**
   - "New" → "Database" → "PostgreSQL"
   - Railway 會自動為你提供 `DATABASE_URL`

3. **部署後端應用**
   - "New" → "Deploy from GitHub repo"
   - 選擇 `todo-app`
   - Railway 會自動偵測 Node.js 應用

4. **配置環境變數**
   - 在項目設定 → Variables
   - `DATABASE_URL` 應自動從 PostgreSQL 服務連結
   - 若需調整，可在此編輯
   - 確保其他變數如 `PORT` 設為 `3000` 或 `4000`

5. **設定啟動命令**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`

6. **部署**
   - Railway 會自動部署
   - 提供公開 URL (如 `https://todo-app-production.railway.app`)

#### 檢查後端
```bash
curl https://your-railway-backend-url/health
# 應返回 {"status":"ok"}

curl https://your-railway-backend-url/api/tasks
# 應返回任務列表 (若無任務則為 [])
```

---

### Heroku

Heroku 是經典選擇，但免費額度已停用。下述為付費方案。

#### 步驟

1. **安裝 Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **建立 Heroku 應用**
   ```bash
   heroku create your-app-name
   ```

3. **添加 PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev -a your-app-name
   # Heroku 自動設定 DATABASE_URL
   ```

4. **部署**
   ```bash
   git subtree push --prefix backend heroku main
   # 或使用 Heroku CLI：
   heroku git:remote -a your-app-name
   heroku config:set YARN_PRODUCTION=false
   git push heroku main
   ```

5. **檢查日誌**
   ```bash
   heroku logs --tail -a your-app-name
   ```

---

### Render

另一個簡單的部署平台。

#### 步驟

1. **訪問 Render**
   - https://render.com

2. **新建 Web 服務**
   - "New+" → "Web Service"
   - 連接 GitHub 倉庫

3. **配置**
   - **Repository**: 選擇 `todo-app`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **連接 PostgreSQL**
   - "New+" → "PostgreSQL"
   - Render 會提供連接字串

5. **配置環境變數**
   - Environment: 設定 `DATABASE_URL` 為 PostgreSQL 連線字串
   - 其他必要變數

6. **部署**
   - Render 自動部署

---

## 整合

### 前後端連線

部署後，需要確保前端知道後端的 URL。

#### 步驟

1. **獲取後端公開 URL**
   - Railway: `https://your-backend.railway.app`
   - Heroku: `https://your-app-name.herokuapp.com`
   - Render: `https://your-app-name.onrender.com`

2. **更新前端環境變數**
   - Vercel: 設定 `VITE_API_URL=https://your-backend-url/api`
   - Netlify: 同上
   - Railway: 同上

3. **重新部署前端**
   - 若合併至 `main` 分支，自動觸發部署
   - 或在平台中手動觸發

4. **測試**
   ```bash
   # 開啟前端 URL
   https://your-frontend-url

   # 檢查控制台是否有 CORS 或連線錯誤
   # 試著建立、編輯、刪除任務
   ```

---

## 常見問題

### Q: 前端無法連接到後端？
**A**: 
- 檢查 `VITE_API_URL` 環境變數是否正確設定
- 確認後端已部署並可訪問 (測試 `/health` 端點)
- 檢查瀏覽器控制台是否有 CORS 錯誤
- 若使用 ngrok，確認 URL 仍有效

### Q: 資料庫遷移失敗？
**A**:
- 檢查 `DATABASE_URL` 是否正確
- 在後端啟動時，執行 `npx prisma migrate deploy`
- 若需重新初始化，先清空資料庫再重新建立表格

### Q: 如何查看生產環境日誌？
**A**:
- **Railway**: 在儀表板中查看 "Logs" 標籤
- **Heroku**: `heroku logs --tail`
- **Render**: 在 Dashboard 中查看 "Logs"
- **Vercel**: 在 Deployments 中查看

### Q: 如何更新已部署的應用？
**A**:
- 提交程式碼至 Git
- Push 到主分支 (如 `main`)
- 大多數平台會自動重新部署
- 或在平台中手動觸發重新部署

### Q: 如何設定自訂域名？
**A**:
- **Vercel**: 在 Project Settings → Domains，輸入自訂域名，照指示更新 DNS
- **Netlify**: Site settings → Domain management
- **Railway / Render / Heroku**: 查看各平台文件

---

## 完整部署清單

- [ ] 後端已推送至 GitHub
- [ ] 前端已推送至 GitHub
- [ ] 後端已部署 (Railway / Heroku / Render)
- [ ] PostgreSQL 資料庫已建立並已執行 migrations
- [ ] 前端已部署 (Vercel / Netlify / Railway)
- [ ] 前端環境變數已設定 (`VITE_API_URL`)
- [ ] 前後端可互相連線（已測試 API 呼叫）
- [ ] 自訂域名已設定 (選用)
- [ ] GitHub Actions CI/CD 已正確執行

---

## 參考資源

- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com
- **Railway**: https://docs.railway.app
- **Heroku**: https://devcenter.heroku.com
- **Render**: https://render.com/docs
- **Prisma Deploy**: https://www.prisma.io/docs/guides/deployment/deploy-prisma

