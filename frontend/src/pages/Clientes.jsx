// src/pages/Clientes.jsx
import { useEffect, useState } from 'react'
import { api } from '../api'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import './CrudPage.css'

const empty = { nombre_cliente: '', observaciones: '', telefonos: [''], correos: [''] }

export default function Clientes() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/api/clientes')
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(empty); setEditId(null); setModal('form') }
  const openEdit = item => {
    setForm({
      nombre_cliente: item.nombre_cliente,
      observaciones: item.observaciones || '',
      telefonos: item.telefonos.length ? item.telefonos : [''],
      correos: item.correos.length ? item.correos : [''],
    })
    setEditId(item.id_cliente)
    setModal('form')
  }

  const handleSubmit = async () => {
    if (!form.nombre_cliente) { toast('El nombre es obligatorio', 'warning'); return }
    const payload = {
      ...form,
      telefonos: form.telefonos.filter(t => t.trim()),
      correos: form.correos.filter(c => c.trim()),
    }
    try {
      if (editId) {
        await api.put(`/api/clientes/${editId}`, payload)
        toast('Cliente actualizado')
      } else {
        await api.post('/api/clientes', payload)
        toast('Cliente creado')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async id => {
    if (!confirm('¿Eliminar este cliente?')) return
    try {
      await api.delete(`/api/clientes/${id}`)
      toast('Cliente eliminado'); load()
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
    i.nombre_cliente.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div><h1>Clientes</h1><p>{items.length} clientes registrados</p></div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo cliente</button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input placeholder="Buscar cliente…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        </div>
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div className="empty-state"><p>No hay clientes.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Teléfonos</th><th>Correos</th><th>Observaciones</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id_cliente}>
                  <td>{c.nombre_cliente}</td>
                  <td>{c.telefonos.join(', ') || '—'}</td>
                  <td>{c.correos.join(', ')   || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.observaciones || '—'}</td>
                  <td className="actions">
                    <button className="btn-secondary btn-sm" onClick={() => openEdit(c)}>Editar</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(c.id_cliente)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal === 'form' && (
        <Modal
          title={editId ? 'Editar cliente' : 'Nuevo cliente'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>
              {editId ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </>}
        >
          <div className="form-group">
            <label>Nombre *</label>
            <input value={form.nombre_cliente}
              onChange={e => setForm(p => ({ ...p, nombre_cliente: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Observaciones</label>
            <textarea rows={2} value={form.observaciones}
              onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
              style={{ resize: 'vertical' }} />
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