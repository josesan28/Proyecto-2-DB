import { formatReportDate, isDateLikeKey } from "./reportDate"

export default function ReportesResult({ active, current, data, loading }) {
  const cols = data.length ? Object.keys(data[0]) : []

  return (
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
        <div className="table-wrapper reportes-table-wrapper">
          <table>
            <thead>
              <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {cols.map(c => (
                    <td key={c}>
                      {row[c] === null
                        ? <span style={{ color: 'var(--text-muted)' }}>null</span>
                        : isDateLikeKey(c)
                          ? formatReportDate(row[c])
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
  )
}
