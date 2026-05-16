export default function ConfirmModal({ title, message, onConfirm, onCancel, danger = true }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}