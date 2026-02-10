import { useEffect } from 'react'

export function GlobalStyles() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        color: #333;
      }

      button {
        font-family: inherit;
        cursor: pointer;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      button:active {
        transform: translateY(0);
      }

      input {
        font-family: inherit;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      input[type="checkbox"] {
        cursor: pointer;
        width: 20px;
        height: 20px;
      }
    `
    document.head.appendChild(style)
  }, [])

  return null
}
