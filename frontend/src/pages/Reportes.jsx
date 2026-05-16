import { useState } from 'react'
import { api } from '../api'
import BarChart from '../components/ui/BarChart'
import ReportesMenu from '../components/reportes/ReportesMenu'
import ReportesResult from '../components/reportes/ReportesResult'
import { REPORTES } from '../components/reportes/reportesConfig'
import { useToast } from '../components/ui/Toast'
import './Reportes.css'

// Reportes con gráficas
const CHART_CONFIG = {
  'ventas-por-categoria': {
    title: 'Ingresos por categoría (Q)',
    getLabel: row => row.nombre_categoria,
    getValue: row => parseFloat(row.ingresos_totales),
    unit: 'Q ',
  },
  'ventas-por-empleado': {
    title: 'Monto total vendido por empleado (Q)',
    getLabel: row => row.nombre_empleado,
    getValue: row => parseFloat(row.monto_total),
    unit: 'Q ',
  },
  'productos-mas-vendidos': {
    title: 'Unidades vendidas por producto (top 10)',
    getLabel: row => row.nombre_producto,
    getValue: row => parseInt(row.unidades_vendidas),
    unit: '',
    limit: 10,
  },
}

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

  const current = REPORTES.find(r => r.id === active)
  const chartCfg = active ? CHART_CONFIG[active] : null

  const chartData = chartCfg && data.length
    ? (chartCfg.limit ? data.slice(0, chartCfg.limit) : data).map(row => ({
        label: chartCfg.getLabel(row),
        value: chartCfg.getValue(row),
      }))
    : null

  return (
    <div>
      <div className="page-header">
        <div><h1>Reportes</h1><p>Consultas SQL sobre la base de datos</p></div>
        {data.length > 0 && (
          <button className="btn-secondary" onClick={exportCSV}>↓ Exportar CSV</button>
        )}
      </div>

      <div className="reportes-layout">
        <ReportesMenu reportes={REPORTES} active={active} onSelect={cargar} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!loading && chartData && chartData.length > 0 && (
            <div className="card" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
                {chartCfg.title}
              </p>
              <BarChart
                data={chartData}
                unit={chartCfg.unit}
              />
            </div>
          )}

          <ReportesResult active={active} current={current} data={data} loading={loading} />
        </div>
      </div>
    </div>
  )
}