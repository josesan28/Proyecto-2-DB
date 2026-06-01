import { useEffect, useState, useCallback } from 'react'
import { api } from '../api'
import ProductoFormModal from '../components/productos/ProductoFormModal'
import ProductosTable from '../components/productos/ProductosTable'
import { emptyProductoForm } from '../components/productos/productoForm'
import { useToast } from '../components/ui/Toast'
import { useConfirm } from '../hooks/useConfirm'
import './CrudPage.css'
import {useRole} from "../hooks/useRole";

export default function Productos() {
  const toast = useToast()
  const [confirm, ConfirmUI] = useConfirm()
  const [items, setItems] = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyProductoForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const { can } = useRole()

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

  const openCreate = () => { setForm(emptyProductoForm); setEditId(null); setModal('form') }
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
    if (!form.nombre_producto.trim() || !form.descripcion_producto.trim()
        || form.precio_compra === '' || form.precio_venta === ''
        || !form.id_categoria || !form.id_proveedor) {
      toast('Completa todos los campos obligatorios', 'warning'); return
    }

    const isEdit = !!editId
    const ok = await confirm({
      title: isEdit ? 'Guardar cambios' : 'Crear producto',
      message: isEdit
        ? `¿Guardar los cambios en "${form.nombre_producto}"?`
        : `¿Crear el producto "${form.nombre_producto}"?`,
      danger: false,
    })
    if (!ok) return

    try {
      if (isEdit) {
        await api.put(`/api/productos/${editId}`, {
          ...form,
          nombre_producto: form.nombre_producto.trim(),
          descripcion_producto: form.descripcion_producto.trim(),
        })
        toast('Producto actualizado')
      } else {
        await api.post('/api/productos', {
          ...form,
          nombre_producto: form.nombre_producto.trim(),
          descripcion_producto: form.descripcion_producto.trim(),
        })
        toast('Producto creado')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async (id) => {
    const item = items.find(p => p.id_producto === id)
    const ok = await confirm({
      title: 'Eliminar producto',
      message: `¿Eliminar "${item?.nombre_producto}"? Esta acción no se puede deshacer.`,
    })
    if (!ok) return
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
        {can('bodeguero') && (
          <button className="btn-primary" onClick={openCreate}>+ Nuevo producto</button>
        )}
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input placeholder="Buscar producto o categoría…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        </div>
        <ProductosTable loading={loading} items={filtered} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      {modal === 'form' && (
        <ProductoFormModal
          editId={editId}
          form={form}
          categorias={categorias}
          proveedores={proveedores}
          onFieldChange={f}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}

      {ConfirmUI}
    </div>
  )
}
