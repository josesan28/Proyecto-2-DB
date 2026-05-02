import { useEffect, useState } from 'react'
import { api } from '../api'
import { useToast } from '../components/ui/Toast'
import './Dashboard.css'

export default function Dashboard() {
  const toast = useToast()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/api/productos'),
      api.get('/api/clientes'),
      api.get('/api/ventas'),
      api.get('/api/empleados'),
    ]).then(([productos, clientes, ventas, empleados]) => {
      const totalVentas = ventas.reduce((s, v) => s + parseFloat(v.total), 0)
      setStats({
        productos: productos.length,
        clientes: clientes.length,
        ventas: ventas.length,
        empleados: empleados.length,
        totalVentas,
        stockBajo: productos.filter(p => p.stock_actual < 5).length,
      })
    }).catch(e => toast(e.message, 'error'))
  }, [])

  if (!stats) return <div className="spinner" />

  const cards = [
    { label: 'Productos', value: stats.productos, note: `${stats.stockBajo} con stock bajo` },
    { label: 'Clientes', value: stats.clientes, note: 'registrados' },
    { label: 'Ventas', value: stats.ventas, note: 'realizadas' },
    { label: 'Total vendido', value: `Q ${stats.totalVentas.toFixed(2)}`, note: 'acumulado' },
    { label: 'Empleados', value: stats.empleados, note: 'activos' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inicio</h1>
          <p>Resumen general de la tienda</p>
        </div>
      </div>
      <div className="stat-grid">
        {cards.map(c => (
          <div key={c.label} className="card stat-card">
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-note">{c.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}