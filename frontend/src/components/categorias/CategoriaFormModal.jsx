import Modal from '../ui/Modal'

export default function CategoriaFormModal({ editId, form, onFieldChange, onClose, onSubmit }) {
  return (
    <Modal
      title={editId ? 'Editar categoría' : 'Nueva categoría'}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSubmit}>
            {editId ? 'Guardar cambios' : 'Crear categoría'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre *</label>
        <input value={form.nombre_categoria} onChange={e => onFieldChange('nombre_categoria', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          rows={3}
          value={form.descripcion_categoria}
          onChange={e => onFieldChange('descripcion_categoria', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>
    </Modal>
  )
}
