import { createContext, useContext, useEffect, useState } from "react"
import { authStorage } from "../auth"
import { AUTH_UNAUTHORIZED_EVENT } from "../api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [empleado, setEmpleado] = useState(() => authStorage.getEmpleado())

  const login = (token, datos) => {
    authStorage.save(token, datos)
    setEmpleado(datos)
  }

  const logout = () => {
    authStorage.clear()
    setEmpleado(null)
  }

  useEffect(() => {
    const handleUnauthorized = () => {
      setEmpleado(null)
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  return (
    <AuthContext.Provider value={{ empleado, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)