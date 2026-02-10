# 部署前檢查清單

在部署到生產環境前，請確保以下所有項目都已完成：

## 代碼質量

- [ ] **後端單元測試通過**
  ```bash
  cd backend
  npm test
  ```
  應該看到類似 "2 passed" 的結果

- [ ] **前端構建成功**
  ```bash
  cd frontend
  npm run build
  ```
  應該在 `frontend/dist/` 生成靜態檔案

- [ ] **TypeScript 編譯無誤**
  ```bash
  cd backend
  npm run build
  ```

- [ ] **程式碼已提交至 Git**
  ```bash
  git add .
  git commit -m "feat: ready for deployment"
  git push origin main
  ```

## 環境配置

### 後端
- [ ] `.env` 文件已建立（不要提交到 Git）
- [ ] `DATABASE_URL` 指向有效的 PostgreSQL 實例
- [ ] `PORT` 已設定（預設 4000）
- [ ] 其他所需環境變數已設定

### 前端
- [ ] `.env.local` 已建立（若需要自訂 API URL）
- [ ] `VITE_API_URL` 指向正確的後端 URL（若使用自訂 API）
- [ ] 其他所需環境變數已設定

## 資料庫

- [ ] PostgreSQL 伺服器可到達
- [ ] 資料庫 `todo_app` 已建立
- [ ] Prisma migration 已執行
  ```bash
  cd backend
  npx prisma migrate deploy
  ```
- [ ] 資料庫表格已確認建立
  ```bash
  npx prisma studio  # 視覺化檢查
  ```

## 功能驗證

- [ ] **本地測試完成**
  ```bash
  # Terminal 1
  cd backend && npm run dev
  
  # Terminal 2
  cd frontend && npm run dev
  
  # 訪問 http://localhost:5173，測試所有功能
  ```

- [ ] **所有 CRUD 操作正常**
  - [ ] 建立新任務
  - [ ] 列表顯示所有任務
  - [ ] 編輯任務標題
  - [ ] 切換完成狀態
  - [ ] 刪除任務

- [ ] **API 端點測試**
  ```bash
  curl http://localhost:4000/health
  curl http://localhost:4000/api/tasks
  ```

- [ ] **錯誤處理測試**
  - [ ] 試著獲取不存在的任務
  - [ ] 試著建立無效的任務 (空標題)
  - [ ] 檢查錯誤消息是否合理

## CI/CD 準備

- [ ] **GitHub Actions workflow 已啟用**
  - `.github/workflows/ci.yml` 存在
  - 推送至 GitHub 後，workflow 應自動執行

- [ ] **CI 檢查通過**
  - 訪問 GitHub repo → Actions 標籤
  - 最新的 workflow 應顯示綠色 ✓

## 部署準備

選擇部署平台並完成對應步驟：

### 若選擇 Vercel + Railway

**後端 (Railway)**
- [ ] Railway 帳號已建立
- [ ] 倉庫已連接至 Railway
- [ ] PostgreSQL 資料庫已建立
- [ ] 環境變數已配置
- [ ] 部署成功，取得公開 URL (如 `https://todo-app-xxx.railway.app`)
- [ ] 後端健康檢查通過
  ```bash
  curl https://your-railway-url/health
  ```

**前端 (Vercel)**
- [ ] Vercel 帳號已建立
- [ ] 倉庫已連接至 Vercel
- [ ] 環境變數已配置 `VITE_API_URL=https://your-railway-url/api`
- [ ] 部署成功，取得公開 URL (如 `https://todo-app-xxx.vercel.app`)

### 若選擇 Netlify + Railway

**後端 (Railway)**
- [ ] 同上

**前端 (Netlify)**
- [ ] Netlify 帳號已建立
- [ ] 倉庫已連接至 Netlify
- [ ] Build 設定已配置（base: frontend, build: npm run build）
- [ ] 環境變數已配置
- [ ] 部署成功

### 若選擇 Railway (全端)

- [ ] Railway 帳號已建立
- [ ] 倉庫已連接至 Railway
- [ ] PostgreSQL 資料庫已建立
- [ ] 後端服務已配置並部署
- [ ] 前端服務已配置並部署
- [ ] 環境變數已配置
- [ ] 兩個服務均可訪問

## 上線測試

- [ ] **前端可訪問**
  - 開啟 https://your-frontend-url
  - 頁面正常顯示

- [ ] **前後端通訊正常**
  - 列表載入成功
  - 可建立新任務
  - 任務出現在列表中

- [ ] **監控與日誌**
  - 後端日誌無錯誤
  - 前端控制台無 CORS 或網路錯誤
  - 使用平台提供的監控工具（Railway Dashboard、Vercel Analytics 等）

## 安全檢查

- [ ] **敏感資訊保護**
  - [ ] 資料庫密碼不在代碼中暴露
  - [ ] `.env` 已加入 `.gitignore`
  - [ ] API 金鑰 (若有) 已安全存儲

- [ ] **CORS 設定正確**
  - [ ] 只允許預期的前端域名 (若需要限制)
  - [ ] 當前設定允許所有來源 (開發/公開 API)

- [ ] **資料庫備份**
  - [ ] Railway/Heroku 的自動備份已啟用
  - [ ] 知道如何恢復備份

## 火後(Post-Launch)

- [ ] **監控告警已設定**
  - [ ] 後端崩潰告警
  - [ ] 資料庫告警
  - [ ] 效能告警 (若需要)

- [ ] **文件已更新**
  - [ ] README.md 指向正確的生產 URL
  - [ ] DEPLOYMENT.md 記錄部署步驟
  - [ ] API 文件已發佈 (若需要)

- [ ] **後續計畫**
  - [ ] 定期檢查日誌
  - [ ] 設定自動化備份
  - [ ] 計畫定期更新與維護
  - [ ] 收集使用者回饋

---

## 快速參考

### 部署後立即測試
```bash
# 健康檢查
curl https://your-backend-url/health

# 列出任務
curl https://your-backend-url/api/tasks

# 建立任務
curl -X POST https://your-backend-url/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task"}'
```

### 常用命令
```bash
# 本地開發
cd backend && npm run dev
cd frontend && npm run dev

# 本地測試
cd backend && npm test

# 本地構建
cd backend && npm run build
cd frontend && npm run build

# Prisma 操作
cd backend
npx prisma studio        # GUI 資料庫檢視
npx prisma migrate ...   # 資料庫遷移
npx prisma generate      # 生成 Prisma client
```

### 疑難排解
```bash
# 檢查 API 可到達性
curl -v https://your-backend-url/health

# 檢查簽證
curl -I https://your-frontend-url

# 查看後端日誌 (Railway)
# 在 Railway Dashboard 中查看 "Logs" 標籤

# 查看前端日誌 (Vercel)
# 在 Vercel Dashboard 中查看 "Deployments" → 日誌

# 本地資料庫故障排除
cd backend
npx prisma db push      # 同步 schema
npx prisma migrate reset # 重置資料庫 ⚠️ 會刪除所有資料
```

