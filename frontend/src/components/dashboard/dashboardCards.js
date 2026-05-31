export function buildDashboardCards(stats) {
  const cards = []

  const addCard = (card) => {
    if (card.value !== null && card.value !== undefined) cards.push(card)
  }

  addCard({ label: 'Productos', value: stats.productos, note: `${stats.stockBajo ?? 0} con stock bajo` })
  addCard({ label: 'Clientes', value: stats.clientes, note: 'registrados' })
  addCard({ label: 'Ventas', value: stats.ventas, note: 'realizadas' })
  if (stats.totalVentas !== null && stats.totalVentas !== undefined) {
    addCard({ label: 'Total vendido', value: `Q ${stats.totalVentas.toFixed(2)}`, note: 'acumulado' })
  }
  addCard({ label: 'Empleados', value: stats.empleados, note: 'activos' })

  return cards
}
