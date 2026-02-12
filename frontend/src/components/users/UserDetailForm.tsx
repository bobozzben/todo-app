import React from 'react'
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

interface UserDetailFormProps {
  user?: User | null
  loading: boolean
  onSave: (user: Partial<User>) => void
  onCancel: () => void
  onDelete?: (id: number) => void
  isNew?: boolean
}

export default function UserDetailForm({
  user,
  loading,
  onSave,
  onCancel,
  onDelete,
  isNew = false,
}: UserDetailFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = React.useState<Partial<User>>({
    email: user?.email || '',
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    company: user?.company || '',
    position: user?.position || '',
    notes: user?.notes || '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div
      style={{
        maxWidth: 600,
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: 30, color: '#333' }}>
        {isNew ? `➕ ${t('users.title')}` : `✏️ ${t('users.edit')}`}
      </h1>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
          {t('users.email')} *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={!isNew}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
            background: !isNew ? '#f5f5f5' : 'white',
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
          {t('users.name')} *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
          {t('users.phone')}
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
          {t('users.address')}
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
          {t('users.company')}
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
          {t('users.position')}
        </label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
          {t('users.notes')}
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
            minHeight: 100,
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => onSave(formData)}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            background: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? `${t('users.save')}...` : t('users.save')}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            background: '#f5f5f5',
            color: '#666',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {t('users.cancel')}
        </button>
        {user && onDelete && (
          <button
            onClick={() => {
              if (confirm(t('users.confirmDelete'))) {
                onDelete(user.id)
              }
            }}
            disabled={loading}
            style={{
              padding: '12px 20px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {t('users.delete')}
          </button>
        )}
      </div>
    </div>
  )
}

