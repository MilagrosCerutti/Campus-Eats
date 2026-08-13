import menuService from '../services/menuService'

export const MENUS_UPDATED_EVENT = 'menus:updated'

export async function refreshMenuAvailability() {
  const menus = await menuService.getMenus()
  window.dispatchEvent(new CustomEvent(MENUS_UPDATED_EVENT, { detail: menus }))
  return menus
}
