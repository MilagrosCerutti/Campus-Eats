import { describe, expect, it, vi } from 'vitest'

const { getMenus } = vi.hoisted(() => ({ getMenus: vi.fn() }))

vi.mock('../services/menuService', () => ({
  default: { getMenus },
}))

import { MENUS_UPDATED_EVENT, refreshMenuAvailability } from './menuAvailability'

describe('refreshMenuAvailability', () => {
  it('vuelve a consultar menus y anuncia la actualizacion', async () => {
    const menus = [{ id: 1, cupoDisponible: 8 }]
    getMenus.mockResolvedValue(menus)
    const listener = vi.fn()
    window.addEventListener(MENUS_UPDATED_EVENT, listener)

    await expect(refreshMenuAvailability()).resolves.toEqual(menus)

    expect(getMenus).toHaveBeenCalledOnce()
    expect(listener).toHaveBeenCalledOnce()
    expect(listener.mock.calls[0][0].detail).toEqual(menus)
    window.removeEventListener(MENUS_UPDATED_EVENT, listener)
  })
})
