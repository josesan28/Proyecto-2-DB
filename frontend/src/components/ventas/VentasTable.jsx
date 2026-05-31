import { useRole } from "../../hooks/useRole"

export default function VentasTable({ loading, ventas, onView, onDelete }) {
  const { can } = useRole()

  if (loading) return <div className="spinner" />
  if (ventas.length === 0)
    return <div className="empty-state"><p>No hay ventas registradas.</p></div>

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr><th>#</th><th>Fecha</th><th>Empleado</th><th>Cliente</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id_venta}>
              <td style={{ color: "var(--text-muted)" }}>#{v.id_venta}</td>
              <td>{new Date(v.fecha_hora_venta).toLocaleString("es-GT")}</td>
              <td>{v.nombre_empleado}</td>
              <td>{v.nombre_cliente}</td>
              <td><strong>Q {parseFloat(v.total).toFixed(2)}</strong></td>
              <td className="actions">
                <button className="btn-secondary btn-sm" onClick={() => onView(v.id_venta)}>Ver</button>
                {can("gerente") && (
                  <button className="btn-danger btn-sm" onClick={() => onDelete(v.id_venta)}>Anular</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}