# 新架构快速参考指南

## 使用 Custom Hooks

### 在组件中使用 useAuth

```tsx
import { useAuth } from './hooks/useAuth'

export default function MyComponent() {
  const { authenticated, user, loading, error, handleLogin, handleLogout } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {authenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### 在组件中使用 useTasks

```tsx
import { useTasks } from './hooks/useTasks'

export default function TasksComponent() {
  const {
    tasks,
    loading,
    title,
    setTitle,
    addTask,
    removeTask,
    toggleTaskComplete,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useTasks()
  
  return (
    <div>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTask()}
      />
      <button onClick={addTask}>Add Task</button>
      
      {tasks.map(task => (
        <div key={task.id}>
          <input 
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskComplete(task)}
          />
          <span>{task.title}</span>
          <button onClick={() => startEdit(task)}>Edit</button>
          <button onClick={() => removeTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

### 在组件中使用 useUsers

```tsx
import { useUsers } from './hooks/useUsers'

export default function UsersComponent() {
  const {
    users,
    loading,
    search,
    page,
    total,
    handleSearch,
    handlePagination,
    handleUpdate,
    handleDelete,
    handleImport,
    handleExportExcel,
    handleExportPDF,
    setEditingId,
    setEditData,
    editingId,
    editData,
  } = useUsers()
  
  return (
    <div>
      <input
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search users..."
      />
      
      <button onClick={handleExportExcel}>Export Excel</button>
      <button onClick={handleExportPDF}>Export PDF</button>
      
      <label>
        Import Excel
        <input
          type="file"
          accept=".xlsx"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </label>
      
      <table>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {editingId === user.id ? (
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <>
                    <button onClick={() => handleUpdate(user.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => {
                      setEditingId(user.id)
                      setEditData(user)
                    }}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        Page {page} of {Math.ceil(total / 10)}
        <button onClick={() => handlePagination(page - 1)}>Previous</button>
        <button onClick={() => handlePagination(page + 1)}>Next</button>
      </div>
    </div>
  )
}
```

## Hook API 完整参考

### useAuth

#### 状态
- `authenticated: boolean` - 用户是否已认证
- `user: User | null` - 当前用户信息
- `loading: boolean` - 加载状态
- `error: string | null` - 错误信息

#### 函数
- `initAuth()` - 初始化身份验证
- `checkAuth()` - 检查当前身份
- `handleRegister(email, name, password)` - 注册新用户
- `handleLogin(email, password)` - 登录用户
- `handleLogout()` - 登出用户

### useTasks

#### 状态
- `tasks: Task[]` - 任务列表
- `loading: boolean` - 加载状态
- `editingId: number | null` - 正在编辑的任务 ID
- `editingTitle: string` - 编辑中的标题
- `title: string` - 新任务标题输入框

#### 函数
- `setTitle(value)` - 设置新任务标题
- `setEditingTitle(value)` - 设置编辑中的标题
- `fetchTasks()` - 加载任务列表
- `addTask()` - 添加新任务
- `removeTask(id)` - 删除任务
- `toggleTaskComplete(task)` - 切换完成状态
- `startEdit(task)` - 开始编辑
- `saveEdit(id)` - 保存编辑
- `cancelEdit()` - 取消编辑

### useUsers

#### 状态
- `users: User[]` - 用户列表
- `loading: boolean` - 加载状态
- `search: string` - 搜索关键词
- `page: number` - 当前页码
- `total: number` - 用户总数
- `limit: number` - 每页显示数
- `editingId: number | null` - 正在编辑的用户 ID
- `editData: Partial<User>` - 编辑中的用户数据

#### 函数
- `handleSearch(value)` - 搜索用户（重置分页）
- `handlePagination(page)` - 分页
- `loadUsers()` - 重新加载用户列表
- `handleUpdate(id)` - 更新用户信息
- `handleDelete(id)` - 删除用户
- `handleImport(event)` - 导入 Excel 文件
- `handleExportExcel()` - 导出 Excel
- `handleExportPDF()` - 导出 PDF
- `handlePrint()` - 打印用户列表
- `setEditingId(id)` - 设置编辑模式
- `setEditData(data)` - 设置编辑数据

## 常见模式

### 模式 1: 搜索和分页

```tsx
const { users, search, page, handleSearch, handlePagination } = useUsers()

return (
  <>
    <input value={search} onChange={(e) => handleSearch(e.target.value)} />
    {/* 当 search 变化时，会自动重置 page 并重新加载数据 */}
    
    <UserList users={users} />
    
    <button onClick={() => handlePagination(page - 1)}>Previous</button>
    <button onClick={() => handlePagination(page + 1)}>Next</button>
  </>
)
```

### 模式 2: 编辑和保存

```tsx
const { users, editingId, editData, setEditingId, setEditData, handleUpdate } = useUsers()

return (
  <table>
    {users.map(user => (
      <tr key={user.id}>
        <td>
          {editingId === user.id ? (
            <input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          ) : (
            user.name
          )}
        </td>
        <td>
          {editingId === user.id ? (
            <button onClick={() => handleUpdate(user.id)}>Save</button>
          ) : (
            <button onClick={() => {
              setEditingId(user.id)
              setEditData(user)
            }}>Edit</button>
          )}
        </td>
      </tr>
    ))}
  </table>
)
```

### 模式 3: 文件导入/导出

```tsx
const { handleImport, handleExportExcel, handleExportPDF } = useUsers()

return (
  <>
    <label>
      Import Excel
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
    </label>
    {/* handleImport 会自动处理文件、上传、刷新列表 */}
    
    <button onClick={handleExportExcel}>Export Excel</button>
    {/* 自动下载为 users_export.xlsx */}
    
    <button onClick={handleExportPDF}>Export PDF</button>
    {/* 自动下载为 users_export.pdf */}
  </>
)
```

## 性能优化建议

### 1. 使用 useCallback 缓存函数

```tsx
import { useCallback } from 'react'
import { useUsers } from './hooks/useUsers'

export default function UserTable() {
  const { users, handleUpdate } = useUsers()
  
  const onUpdate = useCallback((id, data) => {
    handleUpdate(id)
  }, [handleUpdate])
  
  return <UserTableComponent users={users} onUpdate={onUpdate} />
}
```

### 2. 使用 useMemo 缓存派生状态

```tsx
import { useMemo } from 'react'
import { useUsers } from './hooks/useUsers'

export default function UserStats() {
  const { users } = useUsers()
  
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => !u.deleted).length,
    premium: users.filter(u => u.isPremium).length,
  }), [users])
  
  return <div>Total: {stats.total}, Active: {stats.active}</div>
}
```

## 错误处理

所有 hooks 都内置了错误处理，使用 alert 显示错误消息。如果需要自定义错误处理：

```tsx
// 修改 hook 中的错误处理
// 在 src/hooks/useUsers.ts 中：

async function handleUpdate(id: number) {
  try {
    await updateUser(id, editData)
    // 成功后的逻辑
  } catch (err: any) {
    // 自定义错误处理而不是 alert
    console.error('Update failed:', err)
    // 可以设置状态来显示错误消息
  }
}
```

## 总结

新架构通过 custom hooks 将所有业务逻辑集中管理，使组件可以专注于渲染。这样做的好处：

✓ 逻辑和 UI 完全分离
✓ 易于测试和维护
✓ 可以跨多个组件共享逻辑
✓ 组件代码更加简洁
✓ 业务逻辑更容易理解和修改
