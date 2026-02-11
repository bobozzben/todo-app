import React, { useEffect, useState } from 'react'
import AuthPage from './AuthPage'
import UsersPage from './UsersPage'
import TasksPage from './TasksPage'
import AppHeader from './components/layout/AppHeader'
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
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <AppHeader
          currentPage={currentPage}
          userName={user?.name}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
        />
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px 40px' }}>
          <UsersPage />
        </div>
      </div>
    )
  }

  // Display tasks page
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <AppHeader
          currentPage={currentPage}
          userName={user?.name}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
        />
        <TasksPage />
      </div>
    </div>
  )
}

