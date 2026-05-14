import { createContext, useContext, useState } from "react"
import { authStorage } from "../auth"

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

  return (
    <AuthContext.Provider value={{ empleado, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)