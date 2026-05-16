export default function ReportesMenu({ reportes, active, onSelect }) {
  return (
    <div className="reportes-menu card">
      {reportes.map(r => (
        <button
          key={r.id}
          className={`reporte-btn ${active === r.id ? 'active' : ''}`}
          onClick={() => onSelect(r)}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
