interface AuthFormProps {
  isRegister: boolean
  email: string
  name: string
  password: string
  error: string | null
  loading: boolean
  onEmailChange: (value: string) => void
  onNameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onToggleMode: () => void
  onSubmit: () => void
}

export default function AuthForm({
  isRegister,
  email,
  name,
  password,
  error,
  loading,
  onEmailChange,
  onNameChange,
  onPasswordChange,
  onToggleMode,
  onSubmit,
}: AuthFormProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 24,
            color: '#333',
          }}
        >
          {isRegister ? '创建账户' : '登录'}
        </h1>

        {error && (
          <div
            style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: 16,
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#666' }}>
            邮箱
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            disabled={loading}
          />
        </div>

        {isRegister && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#666' }}>
              姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Your Name"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              disabled={loading}
            />
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#666' }}>
            密码
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
            }}
            disabled={loading}
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 600,
            background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: 16,
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {loading ? '处理中...' : isRegister ? '注册' : '登录'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onToggleMode}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: loading ? 'default' : 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'underline',
            }}
          >
            {isRegister ? '已有账户？登录' : '没有账户？注册'}
          </button>
        </div>
      </div>
    </div>
  )
}
