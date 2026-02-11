import axios from 'axios'

const base = import.meta.env.VITE_API_URL || '/api'

const instance = axios.create({
  baseURL: `${base}`,
  headers: { 'Content-Type': 'application/json' }
})

// 拦截器：为每个请求添加授权令牌
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('[axios] Token from localStorage:', !!token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[axios] Set Authorization header:', `Bearer ${token.substring(0, 20)}...`)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应错误拦截器：处理blob错误响应
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('[axios] Response error:', error.response?.status, error.message)
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text()
        const parsed = JSON.parse(text)
        error.response.data = parsed
      } catch (e) {
        console.error('[axios] Failed to parse blob error:', e)
      }
    }
    return Promise.reject(error)
  }
)

export default instance

