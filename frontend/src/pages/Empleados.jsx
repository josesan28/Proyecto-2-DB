import { useEffect, useState } from 'react'
import { api } from '../api'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import './CrudPage.css'

const empty = {
  nombre_empleado: '', username: '', cargo: '',
  fecha_contratacion: '', estado: 'activo', telefonos: [''], correos: [''],
  contrasena: '',
}

export default function Empleados() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/api/empleados')
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(empty); setEditId(null); setModal('form') }
  const openEdit = item => {
    setForm({
      nombre_empleado: item.nombre_empleado,
      username: item.username || '',
      cargo: item.cargo || '',
      fecha_contratacion: item.fecha_contratacion ? item.fecha_contratacion.slice(0, 10) : '',
      estado: item.estado,
      telefonos: item.telefonos.length ? item.telefonos : [''],
      correos: item.correos.length ? item.correos : [''],
      contrasena: '',
    })
    setEditId(item.id_empleado)
    setModal('form')
  }

  const handleSubmit = async () => {
    if (!form.nombre_empleado) { toast('El nombre es obligatorio', 'warning'); return }
    const payload = {
      ...form,
      telefonos: form.telefonos.filter(t => t.trim()),
      correos: form.correos.filter(c => c.trim()),
      fecha_contratacion: form.fecha_contratacion || null,
      username: form.username || null,
      contrasena: form.contrasena || null,
    }
    try {
      if (editId) {
        await api.put(`/api/empleados/${editId}`, payload)
        toast('Empleado actualizado')
      } else {
        await api.post('/api/empleados', payload)
        toast('Empleado creado')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async id => {
    if (!confirm('¿Eliminar este empleado?')) return
    try {
      await api.delete(`/api/empleados/${id}`)
      toast('Empleado eliminado'); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setArr = (field, idx, val) => setForm(p => {
    const arr = [...p[field]]; arr[idx] = val; return { ...p, [field]: arr }
  })
  const addArr = field => setForm(p => ({ ...p, [field]: [...p[field], ''] }))
  const delArr = (field, idx) => setForm(p => ({
    ...p, [field]: p[field].filter((_, i) => i !== idx)
  }))

  const filtered = items.filter(i =>
    i.nombre_empleado.toLowerCase().includes(search.toLowerCase()) ||
    (i.cargo || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div><h1>Empleados</h1><p>{items.length} empleados registrados</p></div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo empleado</button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input placeholder="Buscar empleado o cargo…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        </div>
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div className="empty-state"><p>No hay empleados.</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Username</th><th>Cargo</th><th>Estado</th><th>Contratación</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id_empleado}>
                  <td>{e.nombre_empleado}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{e.username || '—'}</td>
                  <td>{e.cargo || '—'}</td>
                  <td>
                    <span className={`badge ${e.estado === 'activo' ? 'badge-green' : 'badge-red'}`}>
                      {e.estado}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {e.fecha_contratacion ? e.fecha_contratacion.slice(0, 10) : '—'}
                  </td>
                  <td className="actions">
                    <button className="btn-secondary btn-sm" onClick={() => openEdit(e)}>Editar</button>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(e.id_empleado)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal === 'form' && (
        <Modal
          title={editId ? 'Editar empleado' : 'Nuevo empleado'}
          onClose={() => setModal(null)}
          footer={<>
            <button className="btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>
              {editId ? 'Guardar cambios' : 'Crear empleado'}
            </button>
          </>}
        >
          <div className="form-group">
            <label>Nombre *</label>
            <input value={form.nombre_empleado} onChange={e => f('nombre_empleado', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input value={form.username} onChange={e => f('username', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cargo</label>
              <input value={form.cargo} onChange={e => f('cargo', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha contratación</label>
              <input type="date" value={form.fecha_contratacion}
                onChange={e => f('fecha_contratacion', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{editId ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
              <input
                type="password"
                value={form.contrasena}
                onChange={e => f('contrasena', e.target.value)}
                placeholder={editId ? 'Sin cambios' : 'Mínimo 4 caracteres'}
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select value={form.estado} onChange={e => f('estado', e.target.value)}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
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