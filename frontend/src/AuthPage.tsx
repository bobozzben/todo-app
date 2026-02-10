import React, { useState } from 'react'
import { register, login } from './api/auth'

type AuthPageProps = {
  onAuth: (token: string) => void
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = isRegister
        ? await register(formData.email, formData.name, formData.password)
        : await login(formData.email, formData.password)
      
      onAuth(res.data.token)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div style={{ marginBottom: 12 }}>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </div>
        )}
        
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: 12, marginBottom: 12 }}
        >
          {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsRegister(!isRegister)
          setError('')
          setFormData({ email: '', name: '', password: '' })
        }}
        style={{
          width: '100%',
          padding: 12,
          background: 'transparent',
          border: '1px solid #ccc',
          cursor: 'pointer',
        }}
      >
        {isRegister ? 'Already have account? Login' : 'No account? Register'}
      </button>
    </div>
  )
}
