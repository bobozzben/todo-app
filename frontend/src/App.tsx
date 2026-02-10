import React, { useEffect, useState } from 'react'
import axios from './api/axios'
import { setAuthToken, getAuthToken, initAuthToken } from './api/auth'
import AuthPage from './AuthPage'

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

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>Todo</h1>
          <p style={{ margin: 0, color: '#666' }}>Welcome, {user?.name}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: 8, cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input style={{ flex: 1 }} value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" />
        <button onClick={add}>Add</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(t => (
            <li key={t.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(t)} />
              {editingId === t.id ? (
                <>
                  <input value={editingTitle} onChange={e => setEditingTitle(e.target.value)} style={{ flex: 1 }} />
                  <button onClick={() => saveEdit(t.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    {t.description && <div style={{ fontSize: 12, color: '#666' }}>{t.description}</div>}
                  </div>
                  <button onClick={() => startEdit(t)}>Edit</button>
                  <button onClick={() => remove(t.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

