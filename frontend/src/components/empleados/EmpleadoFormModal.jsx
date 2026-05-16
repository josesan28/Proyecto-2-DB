import Modal from '../ui/Modal'

export default function EmpleadoFormModal({
  editId,
  form,
  onFieldChange,
  setArr,
  addArr,
  delArr,
  onClose,
  onSubmit,
}) {
  return (
    <Modal
      title={editId ? 'Editar empleado' : 'Nuevo empleado'}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSubmit}>
            {editId ? 'Guardar cambios' : 'Crear empleado'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre *</label>
        <input value={form.nombre_empleado} onChange={e => onFieldChange('nombre_empleado', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Username</label>
          <input value={form.username} onChange={e => onFieldChange('username', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Cargo</label>
          <input value={form.cargo} onChange={e => onFieldChange('cargo', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Fecha contratación</label>
          <input
            type="date"
            value={form.fecha_contratacion}
            onChange={e => onFieldChange('fecha_contratacion', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{editId ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
          <input
            type="password"
            value={form.contrasena}
            onChange={e => onFieldChange('contrasena', e.target.value)}
            placeholder={editId ? 'Sin cambios' : 'Mínimo 4 caracteres'}
          />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <select value={form.estado} onChange={e => onFieldChange('estado', e.target.value)}>
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
  )
}
