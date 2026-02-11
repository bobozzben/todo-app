import React from 'react'

interface AppHeaderProps {
  currentPage: 'tasks' | 'users'
  userName: string | undefined
  onPageChange: (page: 'tasks' | 'users') => void
  onLogout: () => void
}

export default function AppHeader({
  currentPage,
  userName,
  onPageChange,
  onLogout,
}: AppHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div>
        <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
          <button
            onClick={() => onPageChange('tasks')}
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: currentPage === 'tasks' ? '#667eea' : '#999',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            📋 待辦事項
          </button>
          <button
            onClick={() => onPageChange('users')}
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: currentPage === 'users' ? '#667eea' : '#999',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            👥 用戶管理
          </button>
        </div>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 4px 0',
          }}
        >
          {currentPage === 'tasks' ? '待辦事項' : '用戶管理'}
        </h1>
        <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>歡迎，{userName}</p>
      </div>
      <button
        onClick={onLogout}
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
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#efefef'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#f5f5f5'
        }}
      >
        登出
      </button>
    </div>
  )
}
