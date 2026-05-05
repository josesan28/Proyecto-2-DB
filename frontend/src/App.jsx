import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { authStorage } from "./auth";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Proveedores from "./pages/Proveedores";
import Clientes from "./pages/Clientes";
import Empleados from "./pages/Empleados";
import Ventas from "./pages/Ventas";
import Reportes from "./pages/Reportes";
import "./index.css";
import "./components/ui/ui.css";

function RequireAuth({ children }) {
  return authStorage.isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <Layout>
                  <Routes>
                    <Route path="/"           element={<Dashboard />} />
                    <Route path="/productos"  element={<Productos />} />
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/proveedores" element={<Proveedores />} />
                    <Route path="/clientes"   element={<Clientes />} />
                    <Route path="/empleados"  element={<Empleados />} />
                    <Route path="/ventas"     element={<Ventas />} />
                    <Route path="/reportes"   element={<Reportes />} />
                  </Routes>
                </Layout>
              </RequireAuth>
            }
          />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}