import { useState } from 'react'
import AuthForm from './components/auth/AuthForm'
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

  async function handleSubmit() {
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
      <AuthForm
        email={email}
        name={name}
        password={password}
        isRegister={isRegister}
        loading={loading}
        error={error}
        onEmailChange={(val) => setEmail(val)}
        onNameChange={(val) => setName(val)}
        onPasswordChange={(val) => setPassword(val)}
        onToggleMode={handleToggleMode}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
