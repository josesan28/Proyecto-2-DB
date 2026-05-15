import Modal from '../ui/Modal'

export default function VentaFormModal({
  form,
  empleados,
  clientes,
  productos,
  total,
  dispatch,
  onClose,
  onSubmit,
}) {
  return (
    <Modal
      title="Nueva venta"
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSubmit}>Registrar venta</button>
        </>
      }
    >
      <div className="form-row">
        <div className="form-group">
          <label>Empleado *</label>
          <select
            value={form.id_empleado}
            onChange={e => dispatch({ type: 'SET_FIELD', field: 'id_empleado', value: e.target.value })}
          >
            <option value="">Seleccionar…</option>
            {empleados.filter(e => e.estado === 'activo').map(e => (
              <option key={e.id_empleado} value={e.id_empleado}>{e.nombre_empleado}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Cliente (opcional)</label>
          <select
            value={form.id_cliente}
            onChange={e => dispatch({ type: 'SET_FIELD', field: 'id_cliente', value: e.target.value })}
          >
            <option value="">Consumidor final</option>
            {clientes.map(c => (
              <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Productos</label>
        {form.items.map((it, i) => {
          const prod = productos.find(p => p.id_producto === parseInt(it.id_producto))
          return (
            <div key={i} className="item-row">
              <select
                value={it.id_producto}
                onChange={e => dispatch({ type: 'SET_ITEM', index: i, field: 'id_producto', value: e.target.value })}
              >
                <option value="">Seleccionar producto…</option>
                {productos.map(p => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre_producto} (stock: {p.stock_actual})
                  </option>
                ))}
              </select>
              <input
                type="number" min="1"
                value={it.cantidad}
                onChange={e => dispatch({ type: 'SET_ITEM', index: i, field: 'cantidad', value: e.target.value })}
                style={{ width: 70 }}
              />
              <span className="item-subtotal">
                {prod ? `Q ${(prod.precio_venta * (parseInt(it.cantidad) || 0)).toFixed(2)}` : '—'}
              </span>
              {form.items.length > 1 && (
                <button className="btn-danger btn-sm" onClick={() => dispatch({ type: 'REMOVE_ITEM', index: i })}>×</button>
              )}
            </div>
          )
        })}
        <button className="btn-secondary btn-sm" style={{ marginTop: 6 }} onClick={() => dispatch({ type: 'ADD_ITEM' })}>
          + Agregar producto
        </button>
      </div>

      <div className="venta-total">
        Total estimado: <strong>Q {total.toFixed(2)}</strong>
      </div>
    </Modal>
  )
}