import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import LoginCard from '../components/login/LoginCard'
import { emptyLoginForm } from '../components/login/loginForm'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState(emptyLoginForm)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.username || !form.contrasena) {
      toast('Completa todos los campos', 'warning')
      return
    }
    setLoading(true)
    try {
      const data = await api.post('/api/auth/login', form)
      login(data.token, { nombre_empleado: data.nombre_empleado, cargo: data.cargo })
      navigate('/')
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <LoginCard form={form} loading={loading} setForm={setForm} onSubmit={handleSubmit} />
    </div>
  )
}
