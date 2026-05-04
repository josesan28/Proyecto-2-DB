import { useEffect, useState } from 'react'
import { api } from '../api'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import './Ventas.css'
import './CrudPage.css'

export default function Ventas() {
  const toast = useToast()
  const [ventas, setVentas] = useState([])
  const [productos, setProductos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [detalle, setDetalle] = useState(null)

  const [form, setForm] = useState({ id_empleado: '', id_cliente: '' })
  const [items, setItems] = useState([{ id_producto: '', cantidad: 1 }])

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/api/ventas'),
      api.get('/api/productos'),
      api.get('/api/empleados'),
      api.get('/api/clientes'),
    ]).then(([v, p, e, c]) => {
      setVentas(v); setProductos(p); setEmpleados(e); setClientes(c)
    }).catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const addItem = () => setItems(i => [...i, { id_producto: '', cantidad: 1 }])
  const delItem = idx => setItems(i => i.filter((_, j) => j !== idx))
  const setItem = (idx, k, v) => setItems(i => {
    const arr = [...i]; arr[idx] = { ...arr[idx], [k]: v }; return arr
  })

  const calcTotal = () => items.reduce((sum, it) => {
    const prod = productos.find(p => p.id_producto === parseInt(it.id_producto))
    return sum + (prod ? prod.precio_venta * (parseInt(it.cantidad) || 0) : 0)
  }, 0)

  const handleSubmit = async () => {
    if (!form.id_empleado) { toast('Selecciona un empleado', 'warning'); return }
    if (items.some(i => !i.id_producto || !i.cantidad || i.cantidad < 1)) {
      toast('Completa todos los productos de la venta', 'warning'); return
    }
    try {
      await api.post('/api/ventas', {
        id_empleado: parseInt(form.id_empleado),
        id_cliente:  form.id_cliente ? parseInt(form.id_cliente) : null,
        items: items.map(i => ({ id_producto: parseInt(i.id_producto), cantidad: parseInt(i.cantidad) })),
      })
      toast('Venta registrada correctamente')
      setModal(null)
      setForm({ id_empleado: '', id_cliente: '' })
      setItems([{ id_producto: '', cantidad: 1 }])
      load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async id => {
    if (!confirm('¿Anular esta venta? Se restaurará el stock.')) return
    try {
      await api.delete(`/api/ventas/${id}`)
      toast('Venta anulada y stock restaurado'); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const verDetalle = async id => {
    try {
      const d = await api.get(`/api/ventas/${id}`)
      setDetalle(d)
    } catch (e) { toast(e.message, 'error') }
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Ventas</h1><p>{ventas.length} ventas registradas</p></div>
        <button className="btn-primary" onClick={() => setModal('form')}>+ Nueva venta</button>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : ventas.length === 0 ? (
          <div className="empty-state"><p>No hay ventas registradas.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>#</th><th>Fecha</th><th>Empleado</th><th>Cliente</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id_venta}>
                  <td style={{ color: 'var(--text-muted)' }}>#{v.id_venta}</td>
                  <td>{new Date(v.fecha_hora_venta).toLocaleString('es-GT')}</td>
                  <td>{v.nombre_empleado}</td>
                  <td>{v.nombre_cliente}</td>
                  <td><strong>Q {parseFloat(v.total).toFixed(2)}</strong></td>
                  <td className="actions">
                    <button className="btn-secondary btn-sm" onClick={() => verDetalle(v.id_venta)}>Ver</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(v.id_venta)}>Anular</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal nueva venta */}
      {modal === 'form' && (
        <Modal
          title="Nueva venta"
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>Registrar venta</button>
          </>}
        >
          <div className="form-row">
            <div className="form-group">
              <label>Empleado *</label>
              <select value={form.id_empleado} onChange={e => setForm(p => ({ ...p, id_empleado: e.target.value }))}>
                <option value="">Seleccionar…</option>
                {empleados.filter(e => e.estado === 'activo').map(e => (
                  <option key={e.id_empleado} value={e.id_empleado}>{e.nombre_empleado}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cliente (opcional)</label>
              <select value={form.id_cliente} onChange={e => setForm(p => ({ ...p, id_cliente: e.target.value }))}>
                <option value="">Consumidor final</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>{c.nombre_cliente}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Productos</label>
            {items.map((it, i) => {
              const prod = productos.find(p => p.id_producto === parseInt(it.id_producto))
              return (
                <div key={i} className="item-row">
                  <select value={it.id_producto} onChange={e => setItem(i, 'id_producto', e.target.value)}
                    style={{ flex: 2 }}>
                    <option value="">Seleccionar producto…</option>
                    {productos.map(p => (
                      <option key={p.id_producto} value={p.id_producto}>
                        {p.nombre_producto} (stock: {p.stock_actual})
                      </option>
                    ))}
                  </select>
                  <input type="number" min="1" value={it.cantidad}
                    onChange={e => setItem(i, 'cantidad', e.target.value)}
                    style={{ width: 70 }} />
                  <span className="item-subtotal">
                    {prod ? `Q ${(prod.precio_venta * (parseInt(it.cantidad) || 0)).toFixed(2)}` : '—'}
                  </span>
                  {items.length > 1 &&
                    <button className="btn-danger btn-sm" onClick={() => delItem(i)}>×</button>}
                </div>
              )
            })}
            <button className="btn-secondary btn-sm" onClick={addItem} style={{ marginTop: 6 }}>
              + Agregar producto
            </button>
          </div>

          <div className="venta-total">
            Total estimado: <strong>Q {calcTotal().toFixed(2)}</strong>
          </div>
        </Modal>
      )}

      {/* Modal detalle de venta */}
      {detalle && (
        <Modal title={`Detalle de venta #${detalle.id_venta}`} onClose={() => setDetalle(null)}>
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
      )}
    </div>
  )
}