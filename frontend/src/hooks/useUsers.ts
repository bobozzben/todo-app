import { useState, useEffect } from 'react'
import {
  fetchUsers,
  updateUser,
  deleteUser,
  importUsers,
  exportUsersExcel,
  exportUsersPDF,
} from '../api/users'

type User = {
  id: number
  email: string
  name: string
  phone?: string
  address?: string
  company?: string
  position?: string
  notes?: string
  createdAt: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<User>>({})

  useEffect(() => {
    loadUsers()
  }, [page, search])

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetchUsers(page, limit, search)
      setUsers(res.data.data)
      setTotal(res.data.total)
      setEditingId(null)
      setEditData({})
    } catch (err) {
      console.error(err)
      alert('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(id: number) {
    try {
      await updateUser(id, editData)
      setEditingId(null)
      setEditData({})
      await loadUsers()
      alert('Updated successfully')
    } catch (err: any) {
      alert('Update failed: ' + err.response?.data?.error)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Confirm delete?')) return
    try {
      await deleteUser(id)
      await loadUsers()
      alert('Deleted successfully')
    } catch (err: any) {
      alert('Delete failed: ' + err.response?.data?.error)
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await importUsers(file)
      alert(`Import completed\nNew: ${res.data.imported}\nUpdated: ${res.data.updated}`)
      await loadUsers()
    } catch (err: any) {
      alert('Import failed: ' + err.response?.data?.error)
    }
  }

  async function handleExportExcel() {
    try {
      const res = await exportUsersExcel(search)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'users_export.xlsx')
      document.body.appendChild(link)
      link.click()
      link.parentElement?.removeChild(link)
    } catch (err) {
      alert('Export Excel failed')
    }
  }

  async function handleExportPDF() {
    try {
      const res = await exportUsersPDF(search)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'users_export.pdf')
      document.body.appendChild(link)
      link.click()
      link.parentElement?.removeChild(link)
    } catch (err: any) {
      console.error('PDF export error:', err)
      const errMsg = err.response?.data?.error || err.message || 'Export PDF failed'
      alert(`Export PDF failed: ${errMsg}`)
    }
  }

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handlePagination(newPage: number) {
    setPage(newPage)
  }

  function handlePrint() {
    window.print()
  }

  const pages = Math.ceil(total / limit)

  return {
    users,
    loading,
    search,
    page,
    total,
    limit,
    pages,
    editingId,
    editData,
    handleSearch,
    handlePagination,
    setEditingId,
    setEditData,
    loadUsers,
    handleUpdate,
    handleDelete,
    handleImport,
    handleExportExcel,
    handleExportPDF,
    handlePrint,
  }
}
