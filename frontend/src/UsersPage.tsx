import React, { useState, useEffect } from 'react'
import {
  fetchUsers,
  updateUser,
  deleteUser,
  importUsers,
  exportUsersExcel,
  exportUsersPDF,
} from './api/users'

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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<User>>({})
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [page, search])

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetchUsers(page, limit, search)
      setUsers(res.data.data)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
      alert('加载用户失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(id: number) {
    try {
      await updateUser(id, editData)
      setEditingId(null)
      setEditData({})
      loadUsers()
      alert('更新成功')
    } catch (err: any) {
      alert('更新失败：' + err.response?.data?.error)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('确定要删除此用户吗？')) return
    try {
      await deleteUser(id)
      loadUsers()
      alert('删除成功')
    } catch (err: any) {
      alert('删除失败：' + err.response?.data?.error)
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const res = await importUsers(file)
      alert(`导入完成\n新增: ${res.data.imported}\n更新: ${res.data.updated}`)
      loadUsers()
    } catch (err: any) {
      alert('导入失败：' + err.response?.data?.error)
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
      alert('导出 Excel 失败')
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
    } catch (err) {
      alert('导出 PDF 失败')
    }
  }

  function handlePrint() {
    window.print()
  }

  const pages = Math.ceil(total / limit)

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
            用户管理
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>共 {total} 个用户</p>
        </div>

        {/* 搜索和操作栏 */}
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <input
              type="text"
              placeholder="搜索用户（姓名、邮箱、公司等）..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              style={{
                flex: 1,
                minWidth: 250,
                padding: '12px 16px',
                fontSize: '14px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
            />

            <button
              onClick={handlePrint}
              style={{
                padding: '12px 20px',
                background: '#2196F3',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📄 列印
            </button>

            <button
              onClick={handleExportExcel}
              style={{
                padding: '12px 20px',
                background: '#4CAF50',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📊 导出 Excel
            </button>

            <button
              onClick={handleExportPDF}
              style={{
                padding: '12px 20px',
                background: '#f44336',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📕 导出 PDF
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <label
              style={{
                padding: '12px 20px',
                background: '#FF9800',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
              📤 导入 Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* 用户表格 */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>加载中...</div>
          ) : users.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
              无用户数据，请先导入或添加用户
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                  }}
                >
                  <thead>
                    <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>ID</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>邮箱</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>姓名</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>电话</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>公司</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>职位</th>
                      <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600 }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: idx < users.length - 1 ? '1px solid #f0f0f0' : 'none',
                          background: editingId === user.id ? '#f9f9f9' : 'white',
                        }}
                      >
                        <td style={{ padding: '16px' }}>{user.id}</td>
                        <td style={{ padding: '16px' }}>{user.email}</td>
                        <td style={{ padding: '16px' }}>
                          {editingId === user.id ? (
                            <input
                              value={editData.name || user.name}
                              onChange={e => setEditData({ ...editData, name: e.target.value })}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          {editingId === user.id ? (
                            <input
                              value={editData.phone || user.phone || ''}
                              onChange={e => setEditData({ ...editData, phone: e.target.value })}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                            />
                          ) : (
                            user.phone || '-'
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          {editingId === user.id ? (
                            <input
                              value={editData.company || user.company || ''}
                              onChange={e =>
                                setEditData({ ...editData, company: e.target.value })
                              }
                              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                            />
                          ) : (
                            user.company || '-'
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          {editingId === user.id ? (
                            <input
                              value={editData.position || user.position || ''}
                              onChange={e =>
                                setEditData({ ...editData, position: e.target.value })
                              }
                              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                            />
                          ) : (
                            user.position || '-'
                          )}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          {editingId === user.id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(user.id)}
                                style={{
                                  padding: '6px 12px',
                                  background: '#4CAF50',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  marginRight: 8,
                                }}
                              >
                                保存
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null)
                                  setEditData({})
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#999',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                取消
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(user.id)
                                  setEditData(user)
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#2196F3',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  marginRight: 8,
                                }}
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                style={{
                                  padding: '6px 12px',
                                  background: '#f44336',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                删除
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div
                style={{
                  padding: '16px',
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#fafafa',
                }}
              >
                <div style={{ color: '#999' }}>
                  第 {page} 页，共 {pages} 页（每页 {limit} 条）
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    style={{
                      padding: '8px 16px',
                      background: page === 1 ? '#e0e0e0' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: page === 1 ? 'default' : 'pointer',
                    }}
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setPage(Math.min(pages, page + 1))}
                    disabled={page === pages}
                    style={{
                      padding: '8px 16px',
                      background: page === pages ? '#e0e0e0' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: page === pages ? 'default' : 'pointer',
                    }}
                  >
                    下一页
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 列印样式 */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          div[style*="background: linear-gradient"] {
            background: white !important;
          }
          button,
          input:not([type="checkbox"]),
          label {
            display: none;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  )
}
