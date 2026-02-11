import React, { useEffect, useState } from 'react'
import axios from './api/axios'
import { setAuthToken, getAuthToken, initAuthToken } from './api/auth'
import AuthPage from './AuthPage'
import UsersPage from './UsersPage'

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
  userId: number
}

type User = {
  id: number
  email: string
  name: string
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [currentPage, setCurrentPage] = useState<'tasks' | 'users'>('tasks')

  useEffect(() => {
    initAuthToken()
    const token = getAuthToken()
    if (token) {
      checkAuth()
    }
  }, [])

  async function checkAuth() {
    try {
      const res = await axios.get('/auth/me')
      setUser(res.data)
      setAuthenticated(true)
      fetchTasks()
    } catch (err) {
      setAuthToken(null)
      setAuthenticated(false)
    }
  }

  async function fetchTasks() {
    setLoading(true)
    try {
      const res = await axios.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  async function add() {
    if (!title.trim()) return
    try {
      await axios.post('/tasks', { title: title.trim() })
      setTitle('')
      fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Create failed')
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this task?')) return
    try {
      await axios.delete(`/tasks/${id}`)
      fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  async function toggleComplete(t: Task) {
    try {
      await axios.put(`/tasks/${t.id}`, { completed: !t.completed })
      fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  function startEdit(t: Task) {
    setEditingId(t.id)
    setEditingTitle(t.title)
  }

  async function saveEdit(id: number) {
    if (!editingTitle.trim()) return alert('Title required')
    try {
      await axios.put(`/tasks/${id}`, { title: editingTitle.trim() })
      setEditingId(null)
      setEditingTitle('')
      fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingTitle('')
  }

  function handleLogout() {
    setAuthToken(null)
    setAuthenticated(false)
    setUser(null)
    setTasks([])
  }

  if (!authenticated) {
    return <AuthPage onAuth={(token) => {
      setAuthToken(token)
      checkAuth()
    }} />
  }

  // 显示用户管理页面
  if (currentPage === 'users') {
    return (
      <div>
        {/* 顶部导航栏 */}
        <div style={{
          background: 'white',
          padding: '16px 40px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <button
              onClick={() => setCurrentPage('tasks')}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#667eea',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              📋 待辦事項
            </button>
            <button
              onClick={() => setCurrentPage('users')}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#999',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              👥 用戶管理
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ color: '#666' }}>{user?.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                color: '#666',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              登出
            </button>
          </div>
        </div>
        <UsersPage />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* 顶部导航栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
              <button
                onClick={() => setCurrentPage('tasks')}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#667eea',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                📋 待辦事項
              </button>
              <button
                onClick={() => setCurrentPage('users')}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#999',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                👥 用戶管理
              </button>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 4, color: '#333', margin: '0 0 4px 0' }}>待辦事項</h1>
            <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>歡迎，{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#f5f5f5',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              color: '#666',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#efefef'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#f5f5f5'
            }}
          >
            登出
          </button>
        </div>

        {/* Add task section */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
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
              onChange={e => setTitle(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && add()}
              placeholder="新增待辦事項..."
            />
            <button
              onClick={add}
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
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              新增
            </button>
          </div>
        </div>

        {/* Task list */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>加載中...</div>
          ) : tasks.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>還沒有待辦事項，開始建立吧！</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tasks.map((t, idx) => (
                <li
                  key={t.id}
                  style={{
                    padding: '16px 24px',
                    borderBottom: idx < tasks.length - 1 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: t.completed ? '#fafafa' : 'white',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#667eea',
                    }}
                  />
                  {editingId === t.id ? (
                    <>
                      <input
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          fontSize: '14px',
                          border: '1px solid #667eea',
                          borderRadius: '6px',
                        }}
                      />
                      <button
                        onClick={() => saveEdit(t.id)}
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
                        onClick={cancelEdit}
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
                            color: t.completed ? '#ccc' : '#333',
                            textDecoration: t.completed ? 'line-through' : 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {t.title}
                        </div>
                        {t.description && (
                          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{t.description}</div>
                        )}
                      </div>
                      <button
                        onClick={() => startEdit(t)}
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
                        onMouseOver={e => (e.currentTarget.style.background = '#0b7dda')}
                        onMouseOut={e => (e.currentTarget.style.background = '#2196F3')}
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => remove(t.id)}
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
                        onMouseOver={e => (e.currentTarget.style.background = '#da190b')}
                        onMouseOut={e => (e.currentTarget.style.background = '#f44336')}
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
      </div>
    </div>
  )
}

