# 組件重構快速參考

## 什麼發生了變化？

我們將 React 應用重構為 **三層架構**，將 JSX 標記從業務邏輯中分離出來。

## 前後對比

### ❌ 之前的做法（混合代碼）
```tsx
// TasksPage.tsx - 混合業務邏輯和 UI
export default function TasksPage() {
  const { tasks, addTask, ... } = useTasks()
  
  return (
    <>
      <div>
        <input ... />  {/* ← UI 代碼 */}
        <button onClick={addTask}>新增</button>
      </div>
      
      <div>
        {tasks.map(task => (  {/* ← 複雜的 JSX 標記 */}
          <li key={task.id}>
            <input type="checkbox" ... />
            <div>{task.title}</div>
            <button onClick={() => editTask(task)}>編輯</button>
          </li>
        ))}
      </div>
    </>
  )
}
```

**問題**:
- 頁面文件太大（221 行）
- UI 邏輯與業務邏輯混在一起
- 難以測試
- 難以重用

---

### ✅ 現在的做法（分層架構）

#### 1️⃣ **業務邏輯層** (src/hooks/useTasks.ts)
```tsx
export function useTasks() {
  const [tasks, setTasks] = useState([])
  
  const addTask = async () => { /* API 調用 */ }
  const editTask = (task: Task) => { /* 邏輯 */ }
  
  return { tasks, addTask, editTask, ... }  // ← 只返回狀態和方法
}
```

#### 2️⃣ **表現組件層** (src/components/tasks/TaskList.tsx)
```tsx
interface TaskListProps {
  tasks: Task[]
  title: string
  onAddTask: () => void
  onEditTask: (task: Task) => void
}

export default function TaskList({
  tasks,
  title,
  onAddTask,
  onEditTask,
}: TaskListProps) {
  // ← 只接收 props，無本地邏輯
  return (
    <>
      <div>
        <input value={title} />
        <button onClick={onAddTask}>新增</button>
      </div>
      
      <div>
        {tasks.map(task => (
          <li key={task.id}>
            <input type="checkbox" />
            <div>{task.title}</div>
            <button onClick={() => onEditTask(task)}>編輯</button>
          </li>
        ))}
      </div>
    </>
  )
}
```

#### 3️⃣ **容器層** (src/TasksPage.tsx)
```tsx
export default function TasksPage() {
  const {
    tasks,
    title,
    addTask,
    editTask,
    ...
  } = useTasks()  // ← 從 hook 獲取狀態和方法
  
  // ← 將所有內容作為 props 傳遞給表現組件
  return (
    <TaskList
      tasks={tasks}
      title={title}
      onAddTask={addTask}
      onEditTask={editTask}
      ...
    />
  )
}
```

**優勢**:
- ✅ 容器只有 35 行（從 221 行減少）
- ✅ 表現組件專注於 UI（210 行）
- ✅ 業務邏輯獨立於 UI
- ✅ 易於測試
- ✅ 易於重用

---

## 新增文件

| 文件 | 行數 | 職責 |
|------|------|------|
| `src/components/auth/AuthForm.tsx` | 130 | 純 UI - 認證表單 |
| `src/components/tasks/TaskList.tsx` | 210 | 純 UI - 任務列表 |
| `src/components/users/UserTable.tsx` | 340 | 純 UI - 用戶表 |
| `src/components/layout/AppHeader.tsx` | 150 | 純 UI - 導航欄 |

---

## 修改的文件

| 文件 | 之前 | 之後 | 減少 |
|------|------|------|------|
| `src/AuthPage.tsx` | 159 行 | 53 行 | -67% |
| `src/TasksPage.tsx` | 221 行 | 35 行 | -84% |
| `src/UsersPage.tsx` | 395 行 | 54 行 | -86% |
| `src/App.tsx` | 178 行 | 48 行 | -73% |

---

## 使用新組件

### 如何使用 AuthForm？

```tsx
// ❌ 舊寫法 - 混合在 AuthPage 中
export default function AuthPage() {
  const [email, setEmail] = useState('')
  
  return (
    <form>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      ...
    </form>
  )
}

// ✅ 新寫法 - 使用 AuthForm 組件
import AuthForm from './components/auth/AuthForm'

export default function AuthPage({ onAuth }) {
  const { loading, error, handleLogin, ... } = useAuth()
  
  return (
    <AuthForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      loading={loading}
      error={error}
    />
  )
}
```

### 如何使用 TaskList？

```tsx
// ✅ 新寫法 - 在 TasksPage 中
import TaskList from './components/tasks/TaskList'

export default function TasksPage() {
  const { tasks, title, setTitle, addTask, ... } = useTasks()
  
  return (
    <TaskList
      tasks={tasks}
      title={title}
      onTitleChange={setTitle}
      onAddTask={addTask}
      onToggleComplete={toggleTaskComplete}
      ...
    />
  )
}
```

---

## 架構圖

```
┌─────────────────────────────────────┐
│   用戶交互 (點擊、輸入)             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   表現組件層 (Pure Components)      │
│   - AuthForm.tsx (130 行)           │
│   - TaskList.tsx (210 行)           │
│   - UserTable.tsx (340 行)          │
│   - AppHeader.tsx (150 行)          │
│                                     │
│   特點：無狀態、無邏輯、無副作用   │
└──────────────┬──────────────────────┘
               ↓ props (數據) / callbacks (事件)
┌─────────────────────────────────────┐
│   容器層 (Containers)               │
│   - AuthPage.tsx (53 行)            │
│   - TasksPage.tsx (35 行)           │
│   - UsersPage.tsx (54 行)           │
│   - App.tsx (48 行)                 │
│                                     │
│   特點：組合 hooks 和組件            │
└──────────────┬──────────────────────┘
               ↓ hooks
┌─────────────────────────────────────┐
│   業務邏輯層 (Custom Hooks)          │
│   - useAuth.ts                      │
│   - useTasks.ts                     │
│   - useUsers.ts                     │
│                                     │
│   特點：狀態管理、API 調用、邏輯     │
└──────────────┬──────────────────────┘
               ↓ API 調用
┌─────────────────────────────────────┐
│   API 層                             │
│   - src/api/auth.ts                 │
│   - src/api/tasks.ts                │
│   - src/api/users.ts                │
└─────────────────────────────────────┘
```

---

## 編譯狀態 ✅

```bash
$ npm run build

✓ 94 modules transformed.
dist/index.html                  0.32 kB │ gzip:  0.23 kB
dist/assets/index-4ejs59v-.js  202.25 kB │ gzip: 66.68 kB
✓ built in 473ms
```

---

## 下一步

### 已完成 ✅
- [x] 創建表現組件層
- [x] 提取 JSX 標記
- [x] 重構容器組件
- [x] 驗證編譯成功

### 可考慮的改進
- [ ] 添加單元測試
- [ ] 添加集成測試
- [ ] 添加 Storybook 文檔
- [ ] 性能優化（React.memo）
- [ ] 全局狀態管理（Redux/Zustand）

---

## 常見問題

### Q: 為什麼要做這個重構？
A: 將 UI 與業務邏輯分離，使代碼更易維護、測試和重用。

### Q: 這會影響性能嗎？
A: 不會。事實上，純表現組件更容易優化。

### Q: 我應該在什麼時候創建新組件？
A: 當一個組件太大（> 100 行）或包含多個責任時。

### Q: 可以在表現組件中使用 useState 嗎？
A: 原則上不應該。表現組件應該是純簡的。

### Q: 如何測試這些組件？
A: 表現組件易於測試 - 只需傳入 props 並檢查呈現結果。

---

## 相關文檔

- 📖 [完整三層架構詳解](./THREE_LAYER_ARCHITECTURE.md)
- 📚 [Hooks 使用指南](./HOOKS_USAGE_GUIDE.md)
- 🏗️ [架構重構文檔](./ARCHITECTURE_REFACTORING.md)
