import { useEffect, useState, useCallback } from 'react'
import { api } from '../api'
import EmpleadoFormModal from '../components/empleados/EmpleadoFormModal'
import EmpleadosTable from '../components/empleados/EmpleadosTable'
import { emptyEmpleadoForm } from '../components/empleados/empleadoForm'
import { useToast } from '../components/ui/Toast'
import { useConfirm } from '../hooks/useConfirm'
import './CrudPage.css'

export default function Empleados() {
  const toast = useToast()
  const [confirm, ConfirmUI] = useConfirm()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyEmpleadoForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    api.get('/api/empleados')
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(emptyEmpleadoForm); setEditId(null); setModal('form') }
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

    const isEdit = !!editId
    const ok = await confirm({
      title: isEdit ? 'Guardar cambios' : 'Crear empleado',
      message: isEdit
        ? `¿Guardar los cambios en "${form.nombre_empleado}"?`
        : `¿Crear el empleado "${form.nombre_empleado}"?`,
      danger: false,
    })
    if (!ok) return

    const payload = {
      ...form,
      telefonos: form.telefonos.filter(t => t.trim()),
      correos: form.correos.filter(c => c.trim()),
      fecha_contratacion: form.fecha_contratacion || null,
      username: form.username || null,
      contrasena: form.contrasena || null,
    }
    try {
      if (isEdit) {
        await api.put(`/api/empleados/${editId}`, payload)
        toast('Empleado actualizado')
      } else {
        await api.post('/api/empleados', payload)
        toast('Empleado creado')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async (id) => {
    const item = items.find(e => e.id_empleado === id)
    const ok = await confirm({
      title: 'Eliminar empleado',
      message: `¿Eliminar a "${item?.nombre_empleado}"? Esta acción no se puede deshacer.`,
    })
    if (!ok) return
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
        <EmpleadosTable loading={loading} items={filtered} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      {modal === 'form' && (
        <EmpleadoFormModal
          editId={editId}
          form={form}
          onFieldChange={f}
          setArr={setArr}
          addArr={addArr}
          delArr={delArr}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}

      {ConfirmUI}
    </div>
  )
}