import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../components/ui/Toast"
import "./Login.css"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ username: "", contrasena: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.username || !form.contrasena) {
      toast("Completa todos los campos", "warning")
      return
    }
    setLoading(true)
    try {
      const data = await api.post("/api/auth/login", form)
      login(data.token, { nombre_empleado: data.nombre_empleado, cargo: data.cargo })
      navigate("/")
    } catch (e) {
      toast(e.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Eka</h1>
        <p className="login-sub">Inicia sesión para continuar</p>

        <div className="form-group">
          <label>Usuario</label>
          <input
            value={form.username}
            onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={form.contrasena}
            onChange={e => setForm(p => ({ ...p, contrasena: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", marginTop: 8 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </div>
    </div>
  )
}