import api from '@/lib/axios'

const pedidoService = {
  getPedidos:  (params) => api.get('/pedidos', { params }).then((r) => r.data),
  getPedido:   (id)     => api.get(`/pedidos/${id}`).then((r) => r.data),
  getHistorial:(id)     => api.get(`/pedidos/${id}/historial`).then((r) => r.data),
  createPedido:(data)   => api.post('/pedidos', data).then((r) => r.data),
  updatePedido:(id, data) => api.put(`/pedidos/${id}`, data).then((r) => r.data),
  cancelar:    (id)     => api.patch(`/pedidos/${id}/cancelar`).then((r) => r.data),
  confirmar:   (id)     => api.patch(`/pedidos/${id}/confirmar`).then((r) => r.data),
  entregar:    (id)     => api.patch(`/pedidos/${id}/entregar`).then((r) => r.data),
}

export default pedidoService
