import { useState, useEffect } from 'react'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  importUsers,
  exportUsersExcel,
  exportUsersWord,
  exportUsersPDF,
} from '../api/users'
import { User } from '../types'

type UserType = User

export function useUsers() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<UserType>>({})

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

  async function handleUpdate(id: number, silent: boolean = false) {
    try {
      await updateUser(id, editData)
      setEditingId(null)
      setEditData({})
      await loadUsers()
      if (!silent) {
        alert('Updated successfully')
      }
    } catch (err: any) {
      alert('Update failed: ' + err.response?.data?.error)
    }
  }

  async function handleDelete(id: number, silent: boolean = false) {
    if (!confirm('Confirm delete?')) return
    try {
      await deleteUser(id)
      await loadUsers()
      if (!silent) {
        alert('Deleted successfully')
      }
    } catch (err: any) {
      alert('Delete failed: ' + err.response?.data?.error)
    }
  }

  async function handleCreate(data: Partial<UserType>) {
    if (!data.email || !data.name) {
      alert('Email and name are required')
      return
    }
    try {
      await createUser(data)
      setEditingId(null)
      setEditData({})
      await loadUsers()
      alert('Created successfully')
    } catch (err: any) {
      alert('Create failed: ' + err.response?.data?.error)
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

  async function handleExportWord() {
    try {
      const res = await exportUsersWord(search)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'users_export.docx')
      document.body.appendChild(link)
      link.click()
      link.parentElement?.removeChild(link)
    } catch (err: any) {
      console.error('Word export error:', err)
      const errMsg = err.response?.data?.error || err.message || 'Export Word failed'
      alert(`Export Word failed: ${errMsg}`)
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
    handleCreate,
    handleUpdate,
    handleDelete,
    handleImport,
    handleExportExcel,
    handleExportWord,
    handleExportPDF,
    handlePrint,
  }
}
