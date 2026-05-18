export default function ProveedoresTable({ loading, items, onEdit, onDelete }) {
  if (loading) return <div className="spinner" />

  if (items.length === 0) {
    return <div className="empty-state"><p>No hay proveedores.</p></div>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr><th>Nombre</th><th>Dirección</th><th>Teléfonos</th><th>Correos</th><th></th></tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id_proveedor}>
              <td>{p.nombre_proveedor}</td>
              <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.direccion_proveedor || '—'}</td>
              <td>{p.telefonos.join(', ') || '—'}</td>
              <td>{p.correos.join(', ') || '—'}</td>
              <td className="actions">
                <button className="btn-secondary btn-sm" onClick={() => onEdit(p)}>Editar</button>
                <button className="btn-danger btn-sm" onClick={() => onDelete(p.id_proveedor)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}