import { useRole } from "../../hooks/useRole"

export default function ClientesTable({ loading, items, onEdit, onDelete }) {
  const { can } = useRole()

  if (loading) return <div className="spinner" />
  if (items.length === 0)
    return <div className="empty-state"><p>No hay clientes.</p></div>

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th><th>Teléfonos</th><th>Correos</th><th>Observaciones</th>
            {can("vendedor") && <th></th>}
          </tr>
        </thead>
        <tbody>
          {items.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.nombre_cliente}</td>
              <td>{c.telefonos.join(", ") || "—"}</td>
              <td>{c.correos.join(", ") || "—"}</td>
              <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{c.observaciones || "—"}</td>
              {can("vendedor") && (
                <td className="actions">
                  <button className="btn-secondary btn-sm" onClick={() => onEdit(c)}>Editar</button>
                  {can("vendedor") && (
                    <button className="btn-danger btn-sm" onClick={() => onDelete(c.id_cliente)}>Eliminar</button>
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
