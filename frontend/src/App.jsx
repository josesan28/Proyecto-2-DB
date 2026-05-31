import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastProvider } from "./components/ui/Toast"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { useRole } from "./hooks/useRole"
import Layout from "./components/layout/Layout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Productos from "./pages/Productos"
import Categorias from "./pages/Categorias"
import Proveedores from "./pages/Proveedores"
import Clientes from "./pages/Clientes"
import Empleados from "./pages/Empleados"
import Ventas from "./pages/Ventas"
import Reportes from "./pages/Reportes"
import { PAGE_ROLES } from "./permissions"
import "./index.css"
import "./components/ui/ui.css"

function RequireAuth({ children }) {
  const { empleado } = useAuth()
  return empleado ? children : <Navigate to="/login" replace />
}

function RequireRole({ allowed, children }) {
  const { can } = useRole()
  return can(...allowed) ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />

                <Route path="/productos" element={
                  <RequireRole allowed={PAGE_ROLES.productos}>
                    <Productos />
                  </RequireRole>
                } />

                <Route path="/categorias" element={
                  <RequireRole allowed={PAGE_ROLES.categorias}>
                    <Categorias />
                  </RequireRole>
                } />

                <Route path="/proveedores" element={
                  <RequireRole allowed={PAGE_ROLES.proveedores}>
                    <Proveedores />
                  </RequireRole>
                } />

                <Route path="/clientes" element={
                  <RequireRole allowed={PAGE_ROLES.clientes}>
                    <Clientes />
                  </RequireRole>
                } />

                <Route path="/empleados" element={
                  <RequireRole allowed={PAGE_ROLES.empleados}>
                    <Empleados />
                  </RequireRole>
                } />

                <Route path="/ventas" element={
                  <RequireRole allowed={PAGE_ROLES.ventas}>
                    <Ventas />
                  </RequireRole>
                } />

                <Route path="/reportes" element={
                  <RequireRole allowed={PAGE_ROLES.reportes}>
                    <Reportes />
                  </RequireRole>
                } />
              </Routes>
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
