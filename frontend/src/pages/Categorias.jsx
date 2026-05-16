import { useEffect, useState, useCallback } from 'react'
import { api } from '../api'
import CategoriaFormModal from '../components/categorias/CategoriaFormModal'
import CategoriasTable from '../components/categorias/CategoriasTable'
import { emptyCategoriaForm } from '../components/categorias/categoriaForm'
import { useToast } from '../components/ui/Toast'
import './CrudPage.css'

export default function Categorias() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyCategoriaForm)
  const [editId, setEditId] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    api.get('/api/categorias')
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(emptyCategoriaForm); setEditId(null); setModal('form') }
  const openEdit = item => {
    setForm({ nombre_categoria: item.nombre_categoria, descripcion_categoria: item.descripcion_categoria || '' })
    setEditId(item.id_categoria)
    setModal('form')
  }

  const handleSubmit = async () => {
    if (!form.nombre_categoria) { toast('El nombre es obligatorio', 'warning'); return }
    try {
      if (editId) {
        await api.put(`/api/categorias/${editId}`, form)
        toast('Categoría actualizada')
      } else {
        await api.post('/api/categorias', form)
        toast('Categoría creada')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async id => {
    if (!confirm('¿Eliminar esta categoría?')) return
    try {
      await api.delete(`/api/categorias/${id}`)
      toast('Categoría eliminada'); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div>
      <div className="page-header">
        <div><h1>Categorías</h1><p>{items.length} categorías registradas</p></div>
        <button className="btn-primary" onClick={openCreate}>+ Nueva categoría</button>
      </div>

      <div className="card">
        <CategoriasTable loading={loading} items={items} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      {modal === 'form' && (
        <CategoriaFormModal
          editId={editId}
          form={form}
          onFieldChange={f}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
