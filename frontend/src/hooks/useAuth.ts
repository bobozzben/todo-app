import { useState } from 'react'
import { register, login, setAuthToken, getAuthToken, initAuthToken } from '../api/auth'

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
      const res = await login('', '')
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
      setAuthToken(res.data.token)
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
