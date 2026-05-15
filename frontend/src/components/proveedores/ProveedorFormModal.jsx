import Modal from '../ui/Modal'

export default function ProveedorFormModal({
  editId,
  form,
  setForm,
  setArr,
  addArr,
  delArr,
  onClose,
  onSubmit,
}) {
  return (
    <Modal
      title={editId ? 'Editar proveedor' : 'Nuevo proveedor'}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSubmit}>
            {editId ? 'Guardar cambios' : 'Crear proveedor'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre *</label>
        <input
          value={form.nombre_proveedor}
          onChange={e => setForm(p => ({ ...p, nombre_proveedor: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label>Dirección</label>
        <input
          value={form.direccion_proveedor}
          onChange={e => setForm(p => ({ ...p, direccion_proveedor: e.target.value }))}
        />
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
  )
}