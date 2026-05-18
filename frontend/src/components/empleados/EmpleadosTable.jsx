export default function EmpleadosTable({ loading, items, onEdit, onDelete }) {
  if (loading) return <div className="spinner" />

  if (items.length === 0) {
    return <div className="empty-state"><p>No hay empleados.</p></div>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr><th>Nombre</th><th>Username</th><th>Cargo</th><th>Estado</th><th>Contratación</th><th></th></tr>
        </thead>
        <tbody>
          {items.map(e => (
            <tr key={e.id_empleado}>
              <td>{e.nombre_empleado}</td>
              <td style={{ color: 'var(--text-muted)' }}>{e.username || '—'}</td>
              <td>{e.cargo || '—'}</td>
              <td>
                <span className={`badge ${e.estado === 'activo' ? 'badge-green' : 'badge-red'}`}>
                  {e.estado}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                {e.fecha_contratacion ? e.fecha_contratacion.slice(0, 10) : '—'}
              </td>
              <td className="actions">
                <button className="btn-secondary btn-sm" onClick={() => onEdit(e)}>Editar</button>
                <button className="btn-danger btn-sm" onClick={() => onDelete(e.id_empleado)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}