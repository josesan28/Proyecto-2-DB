export default function ProductosTable({ loading, items, onEdit, onDelete }) {
  if (loading) {
    return <div className="spinner" />
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay productos.</p>
      </div>
    )
  }

  return (
    <table>
      <thead>
        <tr><th>Nombre</th><th>Categoría</th><th>Proveedor</th><th>P. venta</th><th>Stock</th><th></th></tr>
      </thead>
      <tbody>
        {items.map(p => (
          <tr key={p.id_producto}>
            <td>{p.nombre_producto}</td>
            <td>{p.nombre_categoria}</td>
            <td>{p.nombre_proveedor}</td>
            <td>Q {parseFloat(p.precio_venta).toFixed(2)}</td>
            <td>
              <span className={`badge ${p.stock_actual < 5 ? 'badge-red' : p.stock_actual < 15 ? 'badge-yellow' : 'badge-green'}`}>
                {p.stock_actual}
              </span>
            </td>
            <td className="actions">
              <button className="btn-secondary btn-sm" onClick={() => onEdit(p)}>Editar</button>
              <button className="btn-danger btn-sm" onClick={() => onDelete(p.id_producto)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}