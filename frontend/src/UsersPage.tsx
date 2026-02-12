import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import UserDetailForm from './components/users/UserDetailForm'
import UserGridEditor from './components/users/UserGridEditor'
import { useUsers } from './hooks/useUsers'
import { User } from './types'

export default function UsersPage() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const {
    users,
    loading,
    page,
    total,
    limit,
    editingId,
    editData,
    handleUpdate,
    handleDelete,
    handlePagination,
    setEditingId,
    setEditData,
    handleCreate,
  } = useUsers()

  const handleDetailSave = async (data: Partial<User>) => {
    if (selectedUser?.id) {
      // Update existing user
      await handleUpdate(selectedUser.id)
      setViewMode('grid')
      setSelectedUser(null)
    } else {
      // Create new user
      await handleCreate(data)
      setViewMode('grid')
      setSelectedUser(null)
    }
  }

  const handleDetailDelete = async (id: number) => {
    if (window.confirm(t('users.confirmDelete'))) {
      await handleDelete(id)
      setViewMode('grid')
      setSelectedUser(null)
    }
  }

  const handleAddNewUser = () => {
    setSelectedUser(null)
    setEditData({})
    setViewMode('detail')
  }

  const handleCancelDetailEdit = () => {
    setViewMode('grid')
    setSelectedUser(null)
    setEditData({})
    setEditingId(null)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* View Mode Toggle Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'grid' ? '#667eea' : '#f0f0f0',
              color: viewMode === 'grid' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: viewMode === 'grid' ? 'bold' : 'normal',
              transition: 'all 0.3s'
            }}
          >
            📊 {t('users.gridView')}
          </button>
          <button
            onClick={() => setViewMode('detail')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'detail' ? '#667eea' : '#f0f0f0',
              color: viewMode === 'detail' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: viewMode === 'detail' ? 'bold' : 'normal',
              transition: 'all 0.3s'
            }}
          >
            📋 {t('users.detailView')}
          </button>
        </div>

        {/* Grid View Mode */}
        {viewMode === 'grid' && (
          <UserGridEditor
            users={users}
            loading={loading}
            editingId={editingId}
            editData={editData}
            onEditStart={(user) => {
              setEditingId(user.id)
              setEditData({
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone || '',
                address: user.address || '',
                company: user.company || '',
                position: user.position || '',
                notes: user.notes || '',
              })
            }}
            onEditChange={setEditData}
            onEditSave={(id) => handleUpdate(id, true)}
            onEditCancel={() => {
              setEditingId(null)
              setEditData({})
            }}
            onDelete={(id) => handleDelete(id, true)}
            onAddNew={handleAddNewUser}
            page={page}
            total={total}
            limit={limit}
            onPageChange={handlePagination}
          />
        )}

        {/* Detail View Mode */}
        {viewMode === 'detail' && (
          <UserDetailForm
            user={selectedUser}
            loading={loading}
            onSave={handleDetailSave}
            onCancel={handleCancelDetailEdit}
            onDelete={selectedUser ? () => handleDetailDelete(selectedUser.id) : undefined}
            isNew={!selectedUser}
          />
        )}
      </div>
    </div>
  )
}
