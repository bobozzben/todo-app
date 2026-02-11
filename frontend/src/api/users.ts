import axios from './axios'

// 获取用户列表
export const fetchUsers = (page: number = 1, limit: number = 10, search: string = '') => {
  return axios.get('/users', {
    params: { page, limit, search },
  })
}

// 获取单个用户
export const getUser = (id: number) => {
  return axios.get(`/users/${id}`)
}

// 更新用户
export const updateUser = (id: number, data: any) => {
  return axios.put(`/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id: number) => {
  return axios.delete(`/users/${id}`)
}

// 导入 Excel
export const importUsers = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/users/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 导出 Excel
export const exportUsersExcel = (search: string = '') => {
  return axios.get('/users/export/excel', {
    params: { search },
    responseType: 'blob',
  })
}

// 导出 PDF
export const exportUsersPDF = (search: string = '') => {
  return axios.get('/users/export/pdf', {
    params: { search },
    responseType: 'blob',
  })
}
