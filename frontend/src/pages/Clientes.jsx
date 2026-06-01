import { useEffect, useState, useCallback } from 'react'
import { api } from '../api'
import ClienteFormModal from '../components/clientes/ClienteFormModal'
import ClientesTable from '../components/clientes/ClientesTable'
import { emptyClienteForm } from '../components/clientes/clienteForm'
import { useToast } from '../components/ui/Toast'
import { useConfirm } from '../hooks/useConfirm'
import './CrudPage.css'
import {useRole} from "../hooks/useRole";

export default function Clientes() {
  const toast = useToast()
  const [confirm, ConfirmUI] = useConfirm()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyClienteForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const { can } = useRole()

  const load = useCallback(() => {
    setLoading(true)
    api.get('/api/clientes')
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(emptyClienteForm); setEditId(null); setModal('form') }
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
    if (!form.nombre_cliente.trim()) { toast('El nombre es obligatorio', 'warning'); return }

    const isEdit = !!editId
    const ok = await confirm({
      title: isEdit ? 'Guardar cambios' : 'Crear cliente',
      message: isEdit
        ? `¿Guardar los cambios en "${form.nombre_cliente}"?`
        : `¿Crear el cliente "${form.nombre_cliente}"?`,
      danger: false,
    })
    if (!ok) return

    const payload = {
      ...form,
      nombre_cliente: form.nombre_cliente.trim(),
      telefonos: form.telefonos.filter(t => t.trim()),
      correos: form.correos.filter(c => c.trim()),
    }
    try {
      if (isEdit) {
        await api.put(`/api/clientes/${editId}`, payload)
        toast('Cliente actualizado')
      } else {
        await api.post('/api/clientes', payload)
        toast('Cliente creado')
      }
      setModal(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async (id) => {
    const item = items.find(c => c.id_cliente === id)
    const ok = await confirm({
      title: 'Eliminar cliente',
      message: `¿Eliminar a "${item?.nombre_cliente}"? Esta acción no se puede deshacer.`,
    })
    if (!ok) return
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
        {can('vendedor') && (
          <button className="btn-primary" onClick={openCreate}>+ Nuevo cliente</button>
        )}
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input placeholder="Buscar cliente…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        </div>
        <ClientesTable loading={loading} items={filtered} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      {modal === 'form' && (
        <ClienteFormModal
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
