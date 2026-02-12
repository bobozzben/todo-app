interface User {
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
  onSearchChange: (value: string) => void
  onPrint: () => void
  onExportExcel: () => void
  onExportWord: () => void
  onExportPDF: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
  onStartEdit: (user: User) => void
  onCancelEdit: () => void
  onEditDataChange: (data: Partial<User>) => void
  onPagination: (page: number) => void
}

export default function UserTable({
  users,
  loading,
  search,
  page,
  total,
  limit,
  pages,
  editingId,
  editData,
  onSearchChange,
  onPrint,
  onExportExcel,
  onExportWord,
  onExportPDF,
  onImport,
  onUpdate,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onEditDataChange,
  onPagination,
}: UserTableProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
            用户管理
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>共 {total} 个用户</p>
        </div>

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
              onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={onPrint}
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
              onClick={onExportExcel}
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
              onClick={onExportWord}
              style={{
                padding: '12px 20px',
                background: '#0066cc',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              📘 导出 Word
            </button>

            <button
              onClick={onExportPDF}
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
                onChange={onImport}
                style={{ display: 'none' }}
              />
            </label>
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
                              value={editData.name || ''}
                              onChange={(e) =>
                                onEditDataChange({ ...editData, name: e.target.value })
                              }
                              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          {editingId === user.id ? (
                            <input
                              value={editData.phone || ''}
                              onChange={(e) =>
                                onEditDataChange({ ...editData, phone: e.target.value })
                              }
                              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                            />
                          ) : (
                            user.phone || '-'
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          {editingId === user.id ? (
                            <input
                              value={editData.company || ''}
                              onChange={(e) =>
                                onEditDataChange({ ...editData, company: e.target.value })
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
                              value={editData.position || ''}
                              onChange={(e) =>
                                onEditDataChange({ ...editData, position: e.target.value })
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
                                onClick={() => onUpdate(user.id)}
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
                                onClick={onCancelEdit}
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
                                onClick={() => onStartEdit(user)}
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
                                onClick={() => onDelete(user.id)}
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
                    onClick={() => onPagination(Math.max(1, page - 1))}
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
                    onClick={() => onPagination(Math.min(pages, page + 1))}
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
