import { describe, it, expect } from 'vitest'
import { buildDashboardCards } from './dashboardCards'

describe('buildDashboardCards', () => {
  const baseStats = {
    productos: 42,
    clientes: 15,
    ventas: 100,
    empleados: 8,
    totalVentas: 12345.6,
    stockBajo: 3,
  }

  it('genera exactamente 5 tarjetas', () => {
    const cards = buildDashboardCards(baseStats)
    expect(cards).toHaveLength(5)
  })

  it('la tarjeta de Productos muestra el conteo y los de stock bajo', () => {
    const cards = buildDashboardCards(baseStats)
    const card = cards.find(c => c.label === 'Productos')
    expect(card).toBeDefined()
    expect(card.value).toBe(42)
    expect(card.note).toContain('3')
  })

  it('la tarjeta de Total vendido formatea el monto con 2 decimales', () => {
    const cards = buildDashboardCards(baseStats)
    const card = cards.find(c => c.label === 'Total vendido')
    expect(card).toBeDefined()
    expect(card.value).toBe('Q 12345.60')
  })

  it('la tarjeta de Empleados refleja el total de activos', () => {
    const cards = buildDashboardCards({ ...baseStats, empleados: 5 })
    const card = cards.find(c => c.label === 'Empleados')
    expect(card.value).toBe(5)
  })
})