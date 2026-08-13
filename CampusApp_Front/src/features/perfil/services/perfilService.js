import api from '@/lib/axios'

const perfilService = {
  updatePerfil: (data) => api.put('/usuarios/perfil', data).then((r) => r.data),
  updatePassword: (data) => api.put('/usuarios/password', data).then((r) => r.data),
}

export default perfilService
