import { useRole } from "../../hooks/useRole"

export default function CategoriasTable({ loading, items, onEdit, onDelete }) {
  const { can } = useRole()

  if (loading) return <div className="spinner" />
  if (items.length === 0)
    return <div className="empty-state"><p>No hay categorías.</p></div>

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr><th>Nombre</th><th>Descripción</th>{can("bodeguero") && <th></th>}</tr>
        </thead>
        <tbody>
          {items.map(c => (
            <tr key={c.id_categoria}>
              <td>{c.nombre_categoria}</td>
              <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{c.descripcion_categoria || "—"}</td>
              {can("bodeguero") && (
                <td className="actions">
                  <button className="btn-secondary btn-sm" onClick={() => onEdit(c)}>Editar</button>
                  {can("bodeguero") && (
                    <button className="btn-danger btn-sm" onClick={() => onDelete(c.id_categoria)}>Eliminar</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
