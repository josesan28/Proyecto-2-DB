import { useEffect, useState, useCallback } from 'react'
import { api } from '../api'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import './CrudPage.css'

const empty = {
  nombre_producto: '', descripcion_producto: '', precio_compra: '',
  precio_venta: '', stock_actual: 0, id_categoria: '', id_proveedor: '',
}

export default function Productos() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get('/api/productos'),
      api.get('/api/categorias'),
      api.get('/api/proveedores'),
    ]).then(([p, c, pr]) => {
      setItems(p); setCategorias(c); setProveedores(pr)
    }).catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setEditId(null); setModal('form') }
  const openEdit = item => {
    setForm({
      nombre_producto: item.nombre_producto,
      descripcion_producto: item.descripcion_producto || '',
      precio_compra: item.precio_compra ?? '',
      precio_venta: item.precio_venta ?? '',
      stock_actual: item.stock_actual,
      id_categoria: item.id_categoria ?? '',
      id_proveedor: item.id_proveedor ?? '',
    })
    setEditId(item.id_producto)
    setModal('form')
  }

  const handleSubmit = async () => {
    if (!form.nombre_producto || !form.precio_compra || !form.precio_venta
        || !form.id_categoria || !form.id_proveedor || !form.descripcion_producto) {
      toast('Completa todos los campos obligatorios', 'warning'); return
    }
    try {
      if (editId) {
        await api.put(`/api/productos/${editId}`, form)
        toast('Producto actualizado')
      } else {
        await api.post('/api/productos', form)
        toast('Producto creado')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async id => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await api.delete(`/api/productos/${id}`)
      toast('Producto eliminado'); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const filtered = items.filter(i =>
    i.nombre_producto.toLowerCase().includes(search.toLowerCase()) ||
    i.nombre_categoria?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div><h1>Productos</h1><p>{items.length} productos registrados</p></div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo producto</button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input placeholder="Buscar producto o categoría…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        </div>
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div className="empty-state"><p>No hay productos.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Categoría</th><th>Proveedor</th><th>P. venta</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
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
                    <button className="btn-secondary btn-sm" onClick={() => openEdit(p)}>Editar</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(p.id_producto)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal === 'form' && (
        <Modal
          title={editId ? 'Editar producto' : 'Nuevo producto'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>
              {editId ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </>}
        >
          <div className="form-group">
            <label>Nombre *</label>
            <input value={form.nombre_producto} onChange={e => f('nombre_producto', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Descripción *</label>
            <textarea rows={2} value={form.descripcion_producto}
              onChange={e => f('descripcion_producto', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Categoría *</label>
              <select value={form.id_categoria} onChange={e => f('id_categoria', e.target.value)}>
                <option value="">Seleccionar…</option>
                {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Proveedor *</label>
              <select value={form.id_proveedor} onChange={e => f('id_proveedor', e.target.value)}>
                <option value="">Seleccionar…</option>
                {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_proveedor}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Precio compra *</label>
              <input type="number" min="0" step="0.01" value={form.precio_compra}
                onChange={e => f('precio_compra', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Precio venta *</label>
              <input type="number" min="0" step="0.01" value={form.precio_venta}
                onChange={e => f('precio_venta', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Stock inicial</label>
            <input type="number" min="0" value={form.stock_actual}
              onChange={e => f('stock_actual', parseInt(e.target.value) || 0)} />
          </div>
        </Modal>
      )}
    </div>
  )
}