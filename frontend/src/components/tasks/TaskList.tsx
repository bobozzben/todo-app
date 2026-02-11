import React from 'react'

interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
}

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
  onSaveEdit: (id: number) => void
  onCancelEdit: () => void
  onRemoveTask: (id: number) => void
  onEditingTitleChange: (value: string) => void
}

export default function TaskList({
  tasks,
  loading,
  title,
  editingId,
  editingTitle,
  onTitleChange,
  onAddTask,
  onToggleComplete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemoveTask,
  onEditingTitleChange,
}: TaskListProps) {
  return (
    <>
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddTask()}
            placeholder="新增待辦事項..."
          />
          <button
            onClick={onAddTask}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            新增
          </button>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>加載中...</div>
        ) : tasks.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
            還沒有待辦事項，開始建立吧！
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks.map((task, idx) => (
              <li
                key={task.id}
                style={{
                  padding: '16px 24px',
                  borderBottom: idx < tasks.length - 1 ? '1px solid #f0f0f0' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: task.completed ? '#fafafa' : 'white',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: '#667eea',
                  }}
                />
                {editingId === task.id ? (
                  <>
                    <input
                      value={editingTitle}
                      onChange={(e) => onEditingTitleChange(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        fontSize: '14px',
                        border: '1px solid #667eea',
                        borderRadius: '6px',
                      }}
                    />
                    <button
                      onClick={() => onSaveEdit(task.id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      保存
                    </button>
                    <button
                      onClick={onCancelEdit}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: '#999',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 500,
                          color: task.completed ? '#ccc' : '#333',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                          {task.description}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onStartEdit(task)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#0b7dda')}
                      onMouseOut={(e) => (e.currentTarget.style.background = '#2196F3')}
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => onRemoveTask(task.id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#da190b')}
                      onMouseOut={(e) => (e.currentTarget.style.background = '#f44336')}
                    >
                      刪除
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
