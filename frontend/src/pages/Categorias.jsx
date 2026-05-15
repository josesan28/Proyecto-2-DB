import { useEffect, useState, useCallback } from 'react'
import { api } from '../api'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import './CrudPage.css'

const empty = { nombre_categoria: '', descripcion_categoria: '' }

export default function Categorias() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    api.get('/api/categorias')
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setEditId(null); setModal('form') }
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
        {loading ? <div className="spinner" /> : items.length === 0 ? (
          <div className="empty-state"><p>No hay categorías.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Descripción</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id_categoria}>
                  <td>{c.nombre_categoria}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.descripcion_categoria || '—'}</td>
                  <td className="actions">
                    <button className="btn-secondary btn-sm" onClick={() => openEdit(c)}>Editar</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(c.id_categoria)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal === 'form' && (
        <Modal
          title={editId ? 'Editar categoría' : 'Nueva categoría'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>
              {editId ? 'Guardar cambios' : 'Crear categoría'}
            </button>
          </>}
        >
          <div className="form-group">
            <label>Nombre *</label>
            <input value={form.nombre_categoria} onChange={e => f('nombre_categoria', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea rows={3} value={form.descripcion_categoria}
              onChange={e => f('descripcion_categoria', e.target.value)} style={{ resize: 'vertical' }} />
          </div>
        </Modal>
      )}
    </div>
  )
}