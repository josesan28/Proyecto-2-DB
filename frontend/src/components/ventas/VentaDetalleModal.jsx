import Modal from '../ui/Modal'

export default function VentaDetalleModal({ detalle, onClose }) {
  return (
    <Modal title={`Detalle de venta #${detalle.id_venta}`} onClose={onClose}>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
        {new Date(detalle.fecha_hora_venta).toLocaleString('es-GT')} —{' '}
        {detalle.nombre_empleado} — Cliente: {detalle.nombre_cliente}
      </p>
      <table>
        <thead>
          <tr><th>Producto</th><th>Cantidad</th><th>P. Unitario</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          {detalle.detalle.map(d => (
            <tr key={d.id_detalle_venta}>
              <td>{d.nombre_producto}</td>
              <td>{d.cantidad}</td>
              <td>Q {parseFloat(d.precio_unitario).toFixed(2)}</td>
              <td>Q {parseFloat(d.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="venta-total" style={{ marginTop: 12 }}>
        Total: <strong>Q {parseFloat(detalle.total).toFixed(2)}</strong>
      </div>
    </Modal>
  )
}