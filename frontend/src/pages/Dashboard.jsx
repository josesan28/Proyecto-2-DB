import { useEffect, useState } from 'react'
import { api } from '../api'
import DashboardStats from '../components/dashboard/DashboardStats'
import { buildDashboardCards } from '../components/dashboard/dashboardCards'
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

  const cards = buildDashboardCards(stats)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inicio</h1>
          <p>Resumen general de la tienda</p>
        </div>
      </div>
      <DashboardStats cards={cards} />
    </div>
  )
}
