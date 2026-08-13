import api from '@/lib/axios'

const sedeService = {
  getSedes: (params = {}) => api.get('/sedes', { params }).then((r) => r.data),
  getSede: (id) => api.get(`/sedes/${id}`).then((r) => r.data),
  createSede: (data) => api.post('/sedes', data).then((r) => r.data),
  updateSede: (id, data) => api.put(`/sedes/${id}`, data).then((r) => r.data),
  activar: (id) => api.patch(`/sedes/${id}/activar`).then((r) => r.data),
  desactivar: (id) => api.patch(`/sedes/${id}/desactivar`).then((r) => r.data),
}

export default sedeService
