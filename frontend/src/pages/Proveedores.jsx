import { useEffect, useState, useCallback } from 'react'
import { api } from '../api'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import './CrudPage.css'

const empty = { nombre_proveedor: '', direccion_proveedor: '', telefonos: [''], correos: [''] }

export default function Proveedores() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    api.get('/api/proveedores')
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setEditId(null); setModal('form') }
  const openEdit = item => {
    setForm({
      nombre_proveedor: item.nombre_proveedor,
      direccion_proveedor: item.direccion_proveedor || '',
      telefonos: item.telefonos.length ? item.telefonos : [''],
      correos: item.correos.length ? item.correos : [''],
    })
    setEditId(item.id_proveedor)
    setModal('form')
  }

  const handleSubmit = async () => {
    if (!form.nombre_proveedor) { toast('El nombre es obligatorio', 'warning'); return }
    const payload = {
      ...form,
      telefonos: form.telefonos.filter(t => t.trim()),
      correos: form.correos.filter(c => c.trim()),
    }
    try {
      if (editId) {
        await api.put(`/api/proveedores/${editId}`, payload)
        toast('Proveedor actualizado')
      } else {
        await api.post('/api/proveedores', payload)
        toast('Proveedor creado')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async id => {
    if (!confirm('¿Eliminar este proveedor?')) return
    try {
      await api.delete(`/api/proveedores/${id}`)
      toast('Proveedor eliminado'); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const setArr = (field, idx, val) => setForm(p => {
    const arr = [...p[field]]; arr[idx] = val; return { ...p, [field]: arr }
  })
  const addArr = field => setForm(p => ({ ...p, [field]: [...p[field], ''] }))
  const delArr = (field, idx) => setForm(p => ({
    ...p, [field]: p[field].filter((_, i) => i !== idx)
  }))

  const filtered = items.filter(i =>
    i.nombre_proveedor.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div><h1>Proveedores</h1><p>{items.length} proveedores registrados</p></div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo proveedor</button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input placeholder="Buscar proveedor…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        </div>
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div className="empty-state"><p>No hay proveedores.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Dirección</th><th>Teléfonos</th><th>Correos</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id_proveedor}>
                  <td>{p.nombre_proveedor}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.direccion_proveedor || '—'}</td>
                  <td>{p.telefonos.join(', ') || '—'}</td>
                  <td>{p.correos.join(', ') || '—'}</td>
                  <td className="actions">
                    <button className="btn-secondary btn-sm" onClick={() => openEdit(p)}>Editar</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(p.id_proveedor)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal === 'form' && (
        <Modal
          title={editId ? 'Editar proveedor' : 'Nuevo proveedor'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>
              {editId ? 'Guardar cambios' : 'Crear proveedor'}
            </button>
          </>}
        >
          <div className="form-group">
            <label>Nombre *</label>
            <input value={form.nombre_proveedor}
              onChange={e => setForm(p => ({ ...p, nombre_proveedor: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input value={form.direccion_proveedor}
              onChange={e => setForm(p => ({ ...p, direccion_proveedor: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Teléfonos</label>
            {form.telefonos.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input value={t} onChange={e => setArr('telefonos', i, e.target.value)} />
                {form.telefonos.length > 1 &&
                  <button className="btn-danger btn-sm" onClick={() => delArr('telefonos', i)}>×</button>}
              </div>
            ))}
            <button className="btn-secondary btn-sm" onClick={() => addArr('telefonos')}>+ Teléfono</button>
          </div>
          <div className="form-group">
            <label>Correos</label>
            {form.correos.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input type="email" value={c} onChange={e => setArr('correos', i, e.target.value)} />
                {form.correos.length > 1 &&
                  <button className="btn-danger btn-sm" onClick={() => delArr('correos', i)}>×</button>}
              </div>
            ))}
            <button className="btn-secondary btn-sm" onClick={() => addArr('correos')}>+ Correo</button>
          </div>
        </Modal>
      )}
    </div>
  )
}