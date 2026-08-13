import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const ITEMS = [
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'cena', label: 'Cena' },
]

function TestSelect() {
  const [value, setValue] = useState('')

  return (
    <Select value={value} onValueChange={setValue} items={ITEMS}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar turno..." />
      </SelectTrigger>
      <SelectContent>
        {ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

describe('Select', () => {
  it('mantiene visible la etiqueta elegida al cerrar las opciones', async () => {
    const user = userEvent.setup()
    render(<TestSelect />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Cena' }))

    expect(screen.getByRole('combobox')).toHaveTextContent('Cena')
    expect(screen.getByRole('combobox')).toHaveClass('text-foreground')
  })
})
