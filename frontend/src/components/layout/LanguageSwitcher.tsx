import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'zh-CN', label: '简体中文' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ]

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>🌐</label>
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '2px solid #667eea',
          background: 'white',
          color: '#333',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(102, 126, 234, 0.1)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#764ba2'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#667eea'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.1)'
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}

