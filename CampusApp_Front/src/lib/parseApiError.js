export function parseApiError(err, fallback = 'Error inesperado') {
  return err?.response?.data?.error ?? err?.response?.data?.message ?? fallback
}
