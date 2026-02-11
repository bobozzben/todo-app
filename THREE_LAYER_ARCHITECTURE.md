# 三層架構設計文檔

## 概述

本應用採用 **三層組件架構** 實現清晰的關注點分離：

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Container/Page Layer (頁面容器)                    │
│ - App.tsx, AuthPage.tsx, TasksPage.tsx, UsersPage.tsx       │
│ - 職責：協調 hooks 和 UI 組件                                 │
│ - 管理本地狀態，調用 hook 方法                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Custom Hooks Layer (業務邏輯層)                     │
│ - useAuth.ts, useTasks.ts, useUsers.ts                      │
│ - 職責：狀態管理，API 調用，業務邏輯                          │
│ - 返回狀態和處理方法給 Container                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Presentational Component Layer (表現層)            │
│ - AuthForm.tsx, TaskList.tsx, UserTable.tsx, AppHeader.tsx  │
│ - 職責：渲染 JSX，接收 props，無本地狀態                     │
│ - 所有事件通過 props 回調函數傳回                             │
└─────────────────────────────────────────────────────────────┘
```

## 層次詳解

### 層級 1：容器/頁面層 (Container/Page Layer)

**文件位置**: `src/App.tsx`, `src/AuthPage.tsx`, `src/TasksPage.tsx`, `src/UsersPage.tsx`

**職責**:
- 調用自訂 hooks 獲取狀態和方法
- 管理頁面導航
- 將 hook 返回的值作為 props 傳遞給 UI 組件
- 處理頁面級別的邏輯

**範例 (TasksPage.tsx)**:
```tsx
export default function TasksPage() {
  // ← 從 hooks 獲取狀態和方法
  const {
    tasks,
    loading,
    editingId,
    editingTitle,
    title,
    setTitle,
    setEditingTitle,
    addTask,
    removeTask,
    toggleTaskComplete,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useTasks()

  // ← 將所有狀態和方法作為 props 傳遞給 UI 組件
  return (
    <TaskList
      tasks={tasks}
      loading={loading}
      title={title}
      editingId={editingId}
      editingTitle={editingTitle}
      onTitleChange={setTitle}
      onAddTask={addTask}
      onToggleComplete={toggleTaskComplete}
      onStartEdit={startEdit}
      onSaveEdit={saveEdit}
      onCancelEdit={cancelEdit}
      onEditingTitleChange={setEditingTitle}
      onRemoveTask={removeTask}
    />
  )
}
```

### 層級 2：自訂 Hooks 層 (Custom Hooks Layer)

**文件位置**: `src/hooks/useAuth.ts`, `src/hooks/useTasks.ts`, `src/hooks/useUsers.ts`

**職責**:
- 管理應用狀態 (state)
- 封裝 API 調用邏輯
- 實現業務邏輯
- 返回狀態變數和處理函數

**API 文件位置**: `src/api/auth.ts`, `src/api/tasks.ts`, `src/api/users.ts`

**範例特性**:
- `useAuth`: 登錄/註冊、設置 token、初始化認證
- `useTasks`: 新增/刪除/編輯任務、切換完成狀態
- `useUsers`: 搜索、分頁、導入/導出、CRUD 操作

### 層級 3：表現組件層 (Presentational Component Layer)

**文件位置**: `src/components/`

**目錄結構**:
```
src/components/
├── auth/
│   └── AuthForm.tsx          (130 行)
├── layout/
│   └── AppHeader.tsx         (150 行)
├── tasks/
│   └── TaskList.tsx          (210 行)
└── users/
    └── UserTable.tsx         (340 行)
```

**職責**:
- 純粹渲染 JSX
- 所有狀態通過 props 接收
- 所有事件通過 props 回調函數
- 零本地狀態管理

**特點**:
- ✅ 無 hooks (useState, useEffect)
- ✅ 無 API 調用
- ✅ 無業務邏輯
- ✅ 完整的 TypeScript 類型定義
- ✅ 易於測試和重用

## 詳細組件 Props 介面

### AuthForm.tsx
```tsx
interface AuthFormProps {
  email: string
  name: string
  password: string
  isRegister: boolean
  loading: boolean
  error: string
  onEmailChange: (value: string) => void
  onNameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onToggleMode: () => void
  onSubmit: () => void
}
```

### TaskList.tsx
```tsx
interface TaskListProps {
  tasks: Task[]
  loading: boolean
  title: string
  editingId: number | null
  editingTitle: string
  onTitleChange: (value: string) => void
  onAddTask: () => void
  onToggleComplete: (task: Task) => void
  onStartEdit: (task: Task) => void
  onSaveEdit: (taskId: number) => void
  onCancelEdit: () => void
  onEditingTitleChange: (value: string) => void
  onRemoveTask: (taskId: number) => void
}
```

### UserTable.tsx
```tsx
interface UserTableProps {
  users: User[]
  loading: boolean
  search: string
  page: number
  total: number
  limit: number
  pages: number
  editingId: number | null
  editData: Partial<User>
  onSearch: (query: string) => void
  onPrint: () => void
  onExportExcel: () => void
  onExportPDF: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpdate: (userId: number) => void
  onDelete: (userId: number) => void
  onPagination: (page: number) => void
  onSetEditingId: (id: number | null) => void
  onSetEditData: (data: Partial<User>) => void
}
```

### AppHeader.tsx
```tsx
interface AppHeaderProps {
  currentPage: 'tasks' | 'users'
  userName: string | undefined
  onPageChange: (page: 'tasks' | 'users') => void
  onLogout: () => void
}
```

## 數據流示例

### 用例：添加新任務

```
用戶在 TaskList 中輸入任務標題
       ↓ (onTitleChange)
  setTitle() 更新 TasksPage 狀態
       ↓
  useTasks() 中的 title 狀態已更新
       ↓
用戶點擊 "新增" 按鈕
       ↓ (onAddTask)
  addTask() 被調用
       ↓
  useTask() 中調用 API 創建任務
       ↓
返回新任務，更新 tasks 陣列
       ↓
  TaskList 組件通過 props 接收新的 tasks 陣列
       ↓
  UI 重新渲染，顯示新任務
```

## 優勢

### 1. 關注點分離 (Separation of Concerns)
- 業務邏輯與 UI 渲染分離
- 每層只負責自己的職責

### 2. 可重用性 (Reusability)
- 表現組件可在不同容器中重用
- Hooks 可在多個頁面中使用

### 3. 易於測試 (Testability)
- 表現組件易於單元測試（測試 props 和 UI）
- Hooks 易於集成測試（測試狀態變化）
- 容器易於進行端到端測試

### 4. 易於維護 (Maintainability)
- 修改 UI 不需要改變業務邏輯
- 修改業務邏輯不需要改變 UI
- 代碼結構清晰，易於理解

### 5. 性能優化 (Performance)
- 表現組件無副作用，易於優化渲染
- Hooks 層可以高效管理狀態更新

## 文件結構

```
frontend/src/
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx         ← 純表現組件
│   ├── layout/
│   │   └── AppHeader.tsx        ← 純表現組件
│   ├── tasks/
│   │   └── TaskList.tsx         ← 純表現組件
│   ├── users/
│   │   └── UserTable.tsx        ← 純表現組件
│
├── hooks/                         ← 業務邏輯層
│   ├── useAuth.ts
│   ├── useTasks.ts
│   └── useUsers.ts
│
├── api/                           ← API 調用層
│   ├── auth.ts
│   ├── tasks.ts
│   └── users.ts
│
├── App.tsx                        ← 主容器
├── AuthPage.tsx                   ← 認證頁容器
├── TasksPage.tsx                  ← 任務頁容器
└── UsersPage.tsx                  ← 用戶管理頁容器
```

## 遷移規則

如果需要添加新功能，請遵循：

### 添加新功能步驟

1. **定義 API 方法** (`src/api/`)
   - 在 `/api` 中創建 API 調用函數

2. **創建 Hook** (`src/hooks/`)
   - 創建新的自訂 hook
   - 返回狀態和方法

3. **創建表現組件** (`src/components/`)
   - 創建純 UI 組件在 `components/` 中
   - 只接收 props，無本地狀態

4. **創建容器** (`src/`)
   - 在根目錄創建新頁面容器
   - 使用新的 hook 和組件

### 禁止的做法 ❌
- ❌ 在表現組件中調用 API
- ❌ 在表現組件中使用 useState/useEffect
- ❌ 在容器中直接渲染大量 JSX
- ❌ 混合業務邏輯和 UI 渲染

### 推薦的做法 ✅
- ✅ 業務邏輯放在 hooks 中
- ✅ 表現組件接收 props 並渲染
- ✅ 容器組合 hooks 和 UI 組件
- ✅ 使用完整的 TypeScript 類型

## 代碼行數對比

### 重構前
- AuthPage.tsx: 159 行
- TasksPage.tsx: 221 行
- UsersPage.tsx: 395 行
- **總計: 775 行混合代碼**

### 重構後
- AuthPage.tsx: 53 行 (容器)
- TasksPage.tsx: 35 行 (容器)
- UsersPage.tsx: 54 行 (容器)
- AuthForm.tsx: 130 行 (純表現)
- TaskList.tsx: 210 行 (純表現)
- UserTable.tsx: 340 行 (純表現)
- AppHeader.tsx: 150 行 (純表現)
- **總計: 972 行，但結構更清晰**

✅ **代碼改進**: 原容器代碼減少 ~80%，業務邏輯與 UI 完全分離

## 編譯狀態

```
✓ 94 modules transformed
✓ Build successful
- No breaking changes
- All components compile without errors
```

## 下一步改進

1. 添加單元測試（針對表現組件）
2. 添加集成測試（針對 hooks）
3. 添加 Storybook 用於組件文檔
4. 考慮使用 Redux 或 Zustand 進行全局狀態管理
5. 性能優化：添加 React.memo 和 useMemo
