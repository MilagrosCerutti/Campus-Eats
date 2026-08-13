import api from '@/lib/axios'

const menuService = {
  getMenus: (params = {}) => api.get('/menus', { params }).then((r) => r.data),
  getMenu:  (id, config)  => api.get(`/menus/${id}`, config).then((r) => r.data),
  createMenu: (data)       => api.post('/menus', data).then((r) => r.data),
  updateMenu: (id, data)   => api.put(`/menus/${id}`, data).then((r) => r.data),
  activar: (id)            => api.patch(`/menus/${id}/activar`).then((r) => r.data),
  desactivar: (id)         => api.patch(`/menus/${id}/desactivar`).then((r) => r.data),
}

export default menuService
