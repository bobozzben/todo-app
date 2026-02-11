import React, { useEffect, useState } from 'react'
import AuthPage from './AuthPage'
import UsersPage from './UsersPage'
import TasksPage from './TasksPage'
import { useAuth } from './hooks/useAuth'
import { setAuthToken } from './api/auth'

export default function App() {
  const [currentPage, setCurrentPage] = useState<'tasks' | 'users'>('tasks')
  const { authenticated, user, handleLogout, initAuth } = useAuth()

  useEffect(() => {
    initAuth()
  }, [])

  if (!authenticated) {
    return (
      <AuthPage
        onAuth={(token) => {
          setAuthToken(token)
          initAuth()
        }}
      />
    )
  }

  // Display users page
  if (currentPage === 'users') {
    return (
      <div>
        <div
          style={{
            background: 'white',
            padding: '16px 40px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 20 }}>
            <button
              onClick={() => setCurrentPage('tasks')}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#999',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              📋 待辦事項
            </button>
            <button
              onClick={() => setCurrentPage('users')}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#667eea',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              👥 用戶管理
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ color: '#666' }}>{user?.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                color: '#666',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              登出
            </button>
          </div>
        </div>
        <UsersPage />
      </div>
    )
  }

  // Display tasks page
  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
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
                onClick={() => setCurrentPage('tasks')}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#667eea',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                📋 待辦事項
              </button>
              <button
                onClick={() => setCurrentPage('users')}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#999',
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
              待辦事項
            </h1>
            <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>歡迎，{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
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

        <TasksPage />
      </div>
    </div>
  )
}

