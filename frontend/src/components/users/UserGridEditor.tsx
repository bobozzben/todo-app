import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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

interface UserGridEditorProps {
  users: User[]
  loading: boolean
  editingId: number | null
  editData: Partial<User>
  onEditStart: (user: User) => void
  onEditChange: (data: Partial<User>) => void
  onEditSave: (id: number) => void
  onEditCancel: () => void
  onDelete: (id: number) => void
  onAddNew: () => void
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function UserGridEditor({
  users,
  loading,
  editingId,
  editData,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
  onAddNew,
  page,
  total,
  limit,
  onPageChange,
}: UserGridEditorProps) {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / limit)
  const [editingCell, setEditingCell] = useState<{ userId: number; field: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const EDITABLE_FIELDS = ['name', 'phone', 'company', 'position'] as const

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const handleCellClick = (user: User, field: string) => {
    if (field === 'email') return
    if (editingId !== user.id) {
      onEditStart(user)
    }
    setEditingCell({ userId: user.id, field })
  }

  const handleCellKeyDown = (e: React.KeyboardEvent, userId: number, field: string) => {
    const fieldIndex = EDITABLE_FIELDS.indexOf(field as typeof EDITABLE_FIELDS[number])

    if (e.key === 'Enter') {
      e.preventDefault()
      // 移动到下一个字段
      if (fieldIndex < EDITABLE_FIELDS.length - 1) {
        const nextField = EDITABLE_FIELDS[fieldIndex + 1]
        setEditingCell({ userId, field: nextField })
      } else {
        // 最后一个字段，保存行
        onEditSave(userId)
        setEditingCell(null)
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (e.shiftKey) {
        // Shift+Tab: 上一个字段
        if (fieldIndex > 0) {
          const prevField = EDITABLE_FIELDS[fieldIndex - 1]
          setEditingCell({ userId, field: prevField })
        }
      } else {
        // Tab: 下一个字段
        if (fieldIndex < EDITABLE_FIELDS.length - 1) {
          const nextField = EDITABLE_FIELDS[fieldIndex + 1]
          setEditingCell({ userId, field: nextField })
        } else {
          // 最后一个字段，保存
          onEditSave(userId)
          setEditingCell(null)
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onEditCancel()
      setEditingCell(null)
    }
  }

  const handleSaveClick = (userId: number) => {
    onEditSave(userId)
    setEditingCell(null)
  }

  const handleCancelClick = () => {
    onEditCancel()
    setEditingCell(null)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={onAddNew}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ➕ {t('users.title')}
        </button>
      </div>

      <div style={{ 
        marginBottom: 15, 
        padding: '10px 15px', 
        background: '#e3f2fd', 
        borderRadius: '4px',
        border: '1px solid #90caf9',
        fontSize: '13px',
        color: '#1565c0'
      }}>
        💡 {t('users.click')} | Tab / Shift+Tab {t('users.next')} | Enter {t('users.save')} | Esc {t('users.cancel')}
      </div>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>{t('users.id')}</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>{t('users.email')}</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>{t('users.name')}</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>{t('users.phone')}</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>{t('users.company')}</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>{t('users.position')}</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>{t('users.action')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isRowEditing = editingId === user.id

              return (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    background: isRowEditing ? '#f0f8ff' : 'white',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <td style={{ padding: '12px' }}>{user.id}</td>
                  <td style={{ padding: '12px', cursor: 'not-allowed', background: '#f9f9f9' }}>
                    {user.email}
                  </td>

                  {(['name', 'phone', 'company', 'position'] as const).map((field) => {
                    const isCellEditing = isRowEditing && editingCell?.field === field
                    const value = (editData[field] as string) || ''

                    return (
                      <td
                        key={`${user.id}_${field}`}
                        style={{
                          padding: '8px',
                          cursor: 'text',
                          background: isCellEditing ? '#fff8dc' : isRowEditing ? '#f0f8ff' : 'white',
                          borderLeft: isCellEditing ? '3px solid #667eea' : 'none',
                        }}
                        onClick={() => handleCellClick(user, field)}
                      >
                        {isCellEditing ? (
                          <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => onEditChange({ ...editData, [field]: e.target.value })}
                            onKeyDown={(e) => handleCellKeyDown(e, user.id, field)}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '2px solid #667eea',
                              borderRadius: '4px',
                              boxSizing: 'border-box',
                              fontSize: '14px',
                              fontFamily: 'inherit',
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              display: 'block',
                              padding: '6px',
                              minHeight: '24px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              userSelect: 'none',
                            }}
                          >
                            {value || user[field] || '-'}
                          </span>
                        )}
                      </td>
                    )
                  })}

                  <td style={{ padding: '12px' }}>
                    {isRowEditing ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleSaveClick(user.id)}
                          disabled={loading}
                          style={{
                            padding: '6px 12px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'default' : 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          ✓ {t('users.save')}
                        </button>
                        <button
                          onClick={handleCancelClick}
                          disabled={loading}
                          style={{
                            padding: '6px 12px',
                            background: '#f5f5f5',
                            color: '#666',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            cursor: loading ? 'default' : 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          ✕ {t('users.cancel')}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm(t('users.confirmDelete'))) {
                            onDelete(user.id)
                          }
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        🗑️ {t('users.delete')}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || loading}
          style={{
            padding: '8px 16px',
            background: page === 1 ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page === 1 || loading ? 'default' : 'pointer',
            fontWeight: 600,
          }}
        >
          {t('users.previous')}
        </button>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>
          {t('users.page', { current: page, total: totalPages })}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || loading}
          style={{
            padding: '8px 16px',
            background: page === totalPages ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page === totalPages || loading ? 'default' : 'pointer',
            fontWeight: 600,
          }}
        >
          {t('users.next')}
        </button>
      </div>
    </div>
  )
}
