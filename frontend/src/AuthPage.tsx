import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'

type AuthPageProps = {
  onAuth: (token: string) => void
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  
  const { loading, error, setError, handleRegister, handleLogin } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const res = isRegister
        ? await handleRegister(email, name, password)
        : await handleLogin(email, password)
      
      onAuth(res.token)
    } catch (err) {
      // Error is already set by the hook
    }
  }

  const handleToggleMode = () => {
    setIsRegister(!isRegister)
    setError('')
    setEmail('')
    setName('')
    setPassword('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 8, color: '#333' }}>
            {isRegister ? '建立帳戶' : '登入'}
          </h1>
          <p style={{ color: '#999', fontSize: '14px' }}>
            {isRegister ? '加入我們的待辦事項應用' : '歡迎回來'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
                姓名
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
                placeholder="輸入你的名字"
                required
              />
            </div>
          )}
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
              電子郵件
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', fontSize: '14px' }}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, color: '#333' }}>
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', fontSize: '14px' }}
              placeholder="至少 6 位字元"
              required
            />
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: 16,
              fontSize: '14px',
              border: '1px solid #fcc',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: 16,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '16px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '處理中...' : isRegister ? '建立帳戶' : '登入'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleToggleMode}
          style={{
            width: '100%',
            padding: '12px',
            background: '#f5f5f5',
            border: '1px solid #e0e0e0',
            color: '#667eea',
            fontWeight: 500,
          }}
        >
          {isRegister ? '已有帳戶？登入' : '沒有帳戶？建立一個'}
        </button>
      </div>
    </div>
  )
}
