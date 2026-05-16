export function buildDashboardCards(stats) {
  return [
    { label: 'Productos', value: stats.productos, note: `${stats.stockBajo} con stock bajo` },
    { label: 'Clientes', value: stats.clientes, note: 'registrados' },
    { label: 'Ventas', value: stats.ventas, note: 'realizadas' },
    { label: 'Total vendido', value: `Q ${stats.totalVentas.toFixed(2)}`, note: 'acumulado' },
    { label: 'Empleados', value: stats.empleados, note: 'activos' },
  ]
}
