import { useState, useEffect } from 'react'
import axios from '../api/axios'

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
  userId: number
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [title, setTitle] = useState('')

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

  async function addTask() {
    if (!title.trim()) return
    try {
      await axios.post('/tasks', { title: title.trim() })
      setTitle('')
      await fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Create failed')
    }
  }

  async function removeTask(id: number) {
    if (!confirm('Delete this task?')) return
    try {
      await axios.delete(`/tasks/${id}`)
      await fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  async function toggleTaskComplete(task: Task) {
    try {
      await axios.put(`/tasks/${task.id}`, { completed: !task.completed })
      await fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  async function saveEdit(id: number) {
    if (!editingTitle.trim()) return alert('Title required')
    try {
      await axios.put(`/tasks/${id}`, { title: editingTitle.trim() })
      setEditingId(null)
      setEditingTitle('')
      await fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingTitle('')
  }

  return {
    tasks,
    loading,
    editingId,
    editingTitle,
    title,
    setTitle,
    setEditingTitle,
    fetchTasks,
    addTask,
    removeTask,
    toggleTaskComplete,
    startEdit,
    saveEdit,
    cancelEdit,
  }
}
