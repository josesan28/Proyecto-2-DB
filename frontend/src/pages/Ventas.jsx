import { useEffect, useState, useReducer, useCallback } from 'react'
import { api } from '../api'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import './Ventas.css'
import './CrudPage.css'

// Reducer para el formulario de nueva venta
const initialForm = {
  id_empleado: '',
  id_cliente: '',
  items: [{ id_producto: '', cantidad: 1 }],
}

function ventaReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_ITEM':
      return {
        ...state,
        items: state.items.map((it, i) =>
          i === action.index ? { ...it, [action.field]: action.value } : it
        ),
      }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, { id_producto: '', cantidad: 1 }] }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, i) => i !== action.index) }
    case 'RESET':
      return initialForm
    default:
      return state
  }
}


export default function Ventas() {
  const toast = useToast()
  const [ventas, setVentas] = useState([])
  const [productos, setProductos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [detalle, setDetalle] = useState(null)

  const [form, dispatch] = useReducer(ventaReducer, initialForm)

  const load = useCallback(() => {
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
  }, [])

  useEffect(() => { load() }, [load])

  const calcTotal = () =>
    form.items.reduce((sum, it) => {
      const prod = productos.find(p => p.id_producto === parseInt(it.id_producto))
      return sum + (prod ? prod.precio_venta * (parseInt(it.cantidad) || 0) : 0)
    }, 0)

  const handleSubmit = async () => {
    if (!form.id_empleado) { toast('Selecciona un empleado', 'warning'); return }
    if (form.items.some(i => !i.id_producto || !i.cantidad || i.cantidad < 1)) {
      toast('Completa todos los productos de la venta', 'warning'); return
    }
    try {
      await api.post('/api/ventas', {
        id_empleado: parseInt(form.id_empleado),
        id_cliente: form.id_cliente ? parseInt(form.id_cliente) : null,
        items: form.items.map(i => ({
          id_producto: parseInt(i.id_producto),
          cantidad: parseInt(i.cantidad),
        })),
      })
      toast('Venta registrada correctamente')
      setModal(null)
      dispatch({ type: 'RESET' })
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
      setDetalle(await api.get(`/api/ventas/${id}`))
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

      {modal === 'form' && (
        <Modal
          title="Nueva venta"
          onClose={() => { setModal(null); dispatch({ type: 'RESET' }) }}
          footer={<>
            <button className="btn-secondary" onClick={() => { setModal(null); dispatch({ type: 'RESET' }) }}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>Registrar venta</button>
          </>}
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
            Total estimado: <strong>Q {calcTotal().toFixed(2)}</strong>
          </div>
        </Modal>
      )}

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