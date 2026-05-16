export default function DashboardStats({ cards }) {
  return (
    <div className="stat-grid">
      {cards.map(c => (
        <div key={c.label} className="card stat-card">
          <div className="stat-value">{c.value}</div>
          <div className="stat-label">{c.label}</div>
          <div className="stat-note">{c.note}</div>
        </div>
      ))}
    </div>
  )
}
