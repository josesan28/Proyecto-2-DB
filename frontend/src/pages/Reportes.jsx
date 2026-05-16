import { useState } from 'react'
import { api } from '../api'
import ReportesMenu from '../components/reportes/ReportesMenu'
import ReportesResult from '../components/reportes/ReportesResult'
import { REPORTES } from '../components/reportes/reportesConfig'
import { useToast } from '../components/ui/Toast'
import './Reportes.css'

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
        <ReportesResult active={active} current={current} data={data} loading={loading} />
      </div>
    </div>
  )
}
