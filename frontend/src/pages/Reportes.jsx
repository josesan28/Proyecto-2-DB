import { useState } from 'react'
import { api } from '../api'
import { useToast } from '../components/ui/Toast'
import './Reportes.css'

const REPORTES = [
  { id: 'productos-detalle', label: 'Productos con categoría y proveedor' },
  { id: 'ventas-completas', label: 'Ventas con empleado y cliente' },
  { id: 'detalle-ventas', label: 'Información de detalles de ventas' },
  { id: 'ventas-por-categoria', label: 'Ventas por categoría' },
  { id: 'clientes-con-ventas', label: 'Clientes con compras registradas' },
  { id: 'empleados-sobre-promedio-cargo', label: 'Empleados sobre promedio de su cargo' },
  { id: 'ventas-por-empleado', label: 'Resumen de ventas por empleado' },
  { id: 'productos-mas-vendidos', label: 'Productos más vendidos' },
  { id: 'ranking-clientes', label: 'Ranking de clientes' },
]

export default function Reportes() {
  const toast = useToast()
  const [active, setActive] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const cargar = async (reporte) => {
    setActive(reporte.id)
    setData([])
    setLoading(true)
    try {
      const rows = await api.get(`/api/reportes/${reporte.id}`)
      setData(rows)
    } catch (e) { toast(e.message, 'error') }
    finally { setLoading(false) }
  }

  const exportCSV = () => {
    if (!data.length) return
    const keys = Object.keys(data[0])
    const csv = [keys.join(','), ...data.map(row =>
      keys.map(k => JSON.stringify(row[k] ?? '')).join(',')
    )].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `reporte-${active}.csv`; a.click()
    URL.revokeObjectURL(url)
    toast('CSV exportado')
  }

  const cols = data.length ? Object.keys(data[0]) : []
  const current = REPORTES.find(r => r.id === active)

  return (
    <div>
      <div className="page-header">
        <div><h1>Reportes</h1><p>Consultas SQL sobre la base de datos</p></div>
        {data.length > 0 && (
          <button className="btn-secondary" onClick={exportCSV}>↓ Exportar CSV</button>
        )}
      </div>

      <div className="reportes-layout">
        <div className="reportes-menu card">
          {REPORTES.map(r => (
            <button
              key={r.id}
              className={`reporte-btn ${active === r.id ? 'active' : ''}`}
              onClick={() => cargar(r)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="reportes-result card">
          {!active && (
            <div className="empty-state">
              <p>Selecciona un reporte del panel izquierdo.</p>
            </div>
          )}

          {active && (
            <div className="result-header">
              <strong>{current?.label}</strong>
              {data.length > 0 && (
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{data.length} filas</span>
              )}
            </div>
          )}

          {loading && <div className="spinner" />}

          {!loading && data.length === 0 && active && (
            <div className="empty-state"><p>Sin resultados.</p></div>
          )}

          {!loading && data.length > 0 && (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      {cols.map(c => (
                        <td key={c}>
                          {row[c] === null ? <span style={{ color: 'var(--text-muted)' }}>null</span>
                            : String(row[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}