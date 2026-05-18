import Modal from '../ui/Modal'

export default function ProductoFormModal({
  editId,
  form,
  categorias,
  proveedores,
  onFieldChange,
  onClose,
  onSubmit,
}) {
  const selectInputValue = (event) => {
    event.target.select()
  }

  return (
    <Modal
      title={editId ? 'Editar producto' : 'Nuevo producto'}
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSubmit}>
            {editId ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre *</label>
        <input value={form.nombre_producto} onChange={e => onFieldChange('nombre_producto', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Descripción *</label>
        <textarea
          rows={2}
          value={form.descripcion_producto}
          onChange={e => onFieldChange('descripcion_producto', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Categoría *</label>
          <select value={form.id_categoria} onChange={e => onFieldChange('id_categoria', e.target.value)}>
            <option value="">Seleccionar…</option>
            {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Proveedor *</label>
          <select value={form.id_proveedor} onChange={e => onFieldChange('id_proveedor', e.target.value)}>
            <option value="">Seleccionar…</option>
            {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre_proveedor}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Precio compra *</label>
          <input
            type="number" min="0" step="0.01" value={form.precio_compra}
            onChange={e => onFieldChange('precio_compra', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Precio venta *</label>
          <input
            type="number" min="0" step="0.01" value={form.precio_venta}
            onChange={e => onFieldChange('precio_venta', e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Stock inicial</label>
        <input
          type="number" min="0" value={form.stock_actual}
          onFocus={selectInputValue}
          onClick={selectInputValue}
          onChange={e => onFieldChange('stock_actual', parseInt(e.target.value) || 0)}
        />
      </div>
    </Modal>
  )
}
