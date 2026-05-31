import { useEffect, useState } from 'react'
import { api } from '../api'
import DashboardStats from '../components/dashboard/DashboardStats'
import { buildDashboardCards } from '../components/dashboard/dashboardCards'
import { useToast } from '../components/ui/Toast'
import { useRole } from '../hooks/useRole'
import './Dashboard.css'

export default function Dashboard() {
  const toast = useToast()
  const [stats, setStats] = useState(null)
  const { cargo } = useRole()

  useEffect(() => {
    const load = async () => {
      try {
        const productos = await api.get('/api/productos')

        if (cargo === 'bodeguero') {
          setStats({
            productos: productos.length,
            stockBajo: productos.filter(p => p.stock_actual < 5).length,
          })
          return
        }

        const [clientes, ventas, empleados] = await Promise.all([
          api.get('/api/clientes'),
          api.get('/api/ventas'),
          api.get('/api/empleados'),
        ])

        const totalVentas = ventas.reduce((s, v) => s + parseFloat(v.total), 0)
        setStats({
          productos: productos.length,
          clientes: clientes.length,
          ventas: ventas.length,
          empleados: empleados.length,
          totalVentas,
          stockBajo: productos.filter(p => p.stock_actual < 5).length,
        })
      } catch (e) {
        toast(e.message, 'error')
      }
    }

    load()
  }, [cargo, toast])

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
