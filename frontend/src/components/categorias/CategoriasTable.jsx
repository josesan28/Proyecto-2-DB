export default function CategoriasTable({ loading, items, onEdit, onDelete }) {
  if (loading) {
    return <div className="spinner" />
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay categorías.</p>
      </div>
    )
  }

  return (
    <table>
      <thead>
        <tr><th>Nombre</th><th>Descripción</th><th></th></tr>
      </thead>
      <tbody>
        {items.map(c => (
          <tr key={c.id_categoria}>
            <td>{c.nombre_categoria}</td>
            <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.descripcion_categoria || '—'}</td>
            <td className="actions">
              <button className="btn-secondary btn-sm" onClick={() => onEdit(c)}>Editar</button>
              <button className="btn-danger btn-sm" onClick={() => onDelete(c.id_categoria)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
