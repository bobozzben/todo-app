import { useState } from 'react'
import { register, login, getCurrentUser, setAuthToken, getAuthToken, initAuthToken } from '../api/auth'

type User = {
  id: number
  email: string
  name: string
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function initAuth() {
    initAuthToken()
    const token = getAuthToken()
    if (token) {
      await checkAuth()
    }
  }

  async function checkAuth() {
    try {
      const res = await getCurrentUser()
      setUser(res.data)
      setAuthenticated(true)
    } catch (err) {
      setAuthToken(null)
      setAuthenticated(false)
    }
  }

  async function handleRegister(email: string, name: string, password: string) {
    setError('')
    setLoading(true)
    try {
      const res = await register(email, name, password)
      setAuthToken(res.data.token)
      await checkAuth()
      return res.data
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Registration failed'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(email: string, password: string) {
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      console.log('[useAuth] Login response:', res.data)
      console.log('[useAuth] Setting token:', res.data.token.substring(0, 20) + '...')
      setAuthToken(res.data.token)
      console.log('[useAuth] localStorage token:', localStorage.getItem('token')?.substring(0, 20) + '...')
      await checkAuth()
      return res.data
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Login failed'
      setError(errMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setAuthToken(null)
    setAuthenticated(false)
    setUser(null)
  }

  return {
    authenticated,
    user,
    loading,
    error,
    setError,
    initAuth,
    checkAuth,
    handleRegister,
    handleLogin,
    handleLogout,
  }
}
