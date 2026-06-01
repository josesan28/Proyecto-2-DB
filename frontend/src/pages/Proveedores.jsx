import { useEffect, useState, useCallback } from 'react'
import { api } from '../api'
import ProveedorFormModal from '../components/proveedores/ProveedorFormModal'
import ProveedoresTable from '../components/proveedores/ProveedoresTable'
import { emptyProveedorForm } from '../components/proveedores/proveedorForm'
import { useToast } from '../components/ui/Toast'
import { useConfirm } from '../hooks/useConfirm'
import './CrudPage.css'
import {useRole} from "../hooks/useRole";

export default function Proveedores() {
  const toast = useToast()
  const [confirm, ConfirmUI] = useConfirm()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyProveedorForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const { can } = useRole()

  const load = useCallback(() => {
    setLoading(true)
    api.get('/api/proveedores')
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(emptyProveedorForm); setEditId(null); setModal('form') }
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
    if (!form.nombre_proveedor.trim()) { toast('El nombre es obligatorio', 'warning'); return }

    const isEdit = !!editId
    const ok = await confirm({
      title: isEdit ? 'Guardar cambios' : 'Crear proveedor',
      message: isEdit
        ? `¿Guardar los cambios en "${form.nombre_proveedor}"?`
        : `¿Crear el proveedor "${form.nombre_proveedor}"?`,
      danger: false,
    })
    if (!ok) return

    const payload = {
      ...form,
      nombre_proveedor: form.nombre_proveedor.trim(),
      telefonos: form.telefonos.filter(t => t.trim()),
      correos: form.correos.filter(c => c.trim()),
    }
    try {
      if (isEdit) {
        await api.put(`/api/proveedores/${editId}`, payload)
        toast('Proveedor actualizado')
      } else {
        await api.post('/api/proveedores', payload)
        toast('Proveedor creado')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async (id) => {
    const item = items.find(p => p.id_proveedor === id)
    const ok = await confirm({
      title: 'Eliminar proveedor',
      message: `¿Eliminar a "${item?.nombre_proveedor}"? Esta acción no se puede deshacer.`,
    })
    if (!ok) return
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
        {can('bodeguero') && (
          <button className="btn-primary" onClick={openCreate}>+ Nuevo proveedor</button>
        )}
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input placeholder="Buscar proveedor…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        </div>
        <ProveedoresTable loading={loading} items={filtered} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      {modal === 'form' && (
        <ProveedorFormModal
          editId={editId}
          form={form}
          setForm={setForm}
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
