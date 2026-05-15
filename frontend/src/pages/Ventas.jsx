import { useEffect, useState, useReducer, useCallback } from 'react'
import { api } from '../api'
import { useToast } from '../components/ui/Toast'
import VentaDetalleModal from '../components/ventas/VentaDetalleModal'
import VentaFormModal from '../components/ventas/VentaFormModal'
import VentasTable from '../components/ventas/VentasTable'
import { initialForm, ventaReducer } from '../components/ventas/ventaFormReducer'
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

  const closeFormModal = () => {
    setModal(null)
    dispatch({ type: 'RESET' })
  }

  return (
    <div>
      <div className="page-header">
        <div><h1>Ventas</h1><p>{ventas.length} ventas registradas</p></div>
        <button className="btn-primary" onClick={() => setModal('form')}>+ Nueva venta</button>
      </div>

      <div className="card">
        <VentasTable loading={loading} ventas={ventas} onView={verDetalle} onDelete={handleDelete} />
      </div>

      {modal === 'form' && (
        <VentaFormModal
          form={form}
          empleados={empleados}
          clientes={clientes}
          productos={productos}
          total={calcTotal()}
          dispatch={dispatch}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
      )}

      {detalle && (
        <VentaDetalleModal detalle={detalle} onClose={() => setDetalle(null)} />
      )}
    </div>
  )
}