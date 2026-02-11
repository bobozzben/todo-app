import axiosInstance from './axios';

export interface AuthResponse {
  token: string;
  user: { id: number; email: string; name: string };
}

export function register(email: string, name: string, password: string) {
  return axiosInstance.post<AuthResponse>('/auth/register', { email, name, password });
}

export function login(email: string, password: string) {
  return axiosInstance.post<AuthResponse>('/auth/login', { email, password });
}

export function getCurrentUser() {
  return axiosInstance.get('/auth/me');
}

export function updateUser(data: { name?: string; password?: string }) {
  return axiosInstance.put('/auth/me', data);
}

export function setAuthToken(token: string | null) {
  if (token) {
    // 更新自定义axios实例的headers
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // 也保存到localStorage供拦截器使用
    localStorage.setItem('token', token);
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

// Initialize token from localStorage on app load
export function initAuthToken() {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
}
