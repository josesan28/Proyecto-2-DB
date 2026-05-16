export default function LoginCard({ form, loading, setForm, onSubmit }) {
  return (
    <div className="login-card">
      <h1 className="login-title">Eka</h1>
      <p className="login-sub">Inicia sesión para continuar</p>

      <div className="form-group">
        <label>Usuario</label>
        <input
          value={form.username}
          onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
        />
      </div>
      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          value={form.contrasena}
          onChange={e => setForm(p => ({ ...p, contrasena: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
        />
      </div>

      <button
        className="btn-primary"
        style={{ width: '100%', marginTop: 8 }}
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>
    </div>
  )
}
