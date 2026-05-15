import Modal from '../ui/Modal'

export default function ClienteFormModal({
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
      title={editId ? 'Editar cliente' : 'Nuevo cliente'}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSubmit}>
            {editId ? 'Guardar cambios' : 'Crear cliente'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre *</label>
        <input
          value={form.nombre_cliente}
          onChange={e => setForm(p => ({ ...p, nombre_cliente: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label>Observaciones</label>
        <textarea
          rows={2}
          value={form.observaciones}
          onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
          style={{ resize: 'vertical' }}
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