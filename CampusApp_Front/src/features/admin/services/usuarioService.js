import api from '@/lib/axios'

const usuarioService = {
  getUsuarios: (params = {}) => api.get('/usuarios', { params }).then((r) => r.data),
  getUsuario: (id) => api.get(`/usuarios/${id}`).then((r) => r.data),
  createUsuario: (data) => api.post('/usuarios', data).then((r) => r.data),
  updateUsuario: (id, data) => api.put(`/usuarios/${id}`, data).then((r) => r.data),
  activar: (id) => api.patch(`/usuarios/${id}/activar`).then((r) => r.data),
  desactivar: (id) => api.patch(`/usuarios/${id}/desactivar`).then((r) => r.data),
}

export default usuarioService
