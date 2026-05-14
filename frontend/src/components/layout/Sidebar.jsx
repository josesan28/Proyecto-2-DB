import { NavLink, useNavigate } from "react-router-dom"
import { BarChart3, Home, LogOut, Package2, ShoppingCart, Tags, Truck, UserRound, Users, Store } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { api } from "../../api"
import "./Sidebar.css"

const links = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/productos", label: "Productos", icon: Package2 },
  { to: "/categorias", label: "Categorías", icon: Tags },
  { to: "/proveedores", label: "Proveedores", icon: Truck },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/empleados", label: "Empleados", icon: UserRound },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
]

export default function Sidebar() {
  const { empleado, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await api.post("/api/auth/logout", {}).catch(() => {})
    logout()
    navigate("/login")
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon"><Store /></span>
        <span className="brand-name">Eka</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <l.icon className="nav-icon" size={18} strokeWidth={2.1} />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {empleado && (
          <div className="sidebar-user">
            <span className="user-name">{empleado.nombre_empleado}</span>
            <span className="user-cargo">{empleado.cargo || "Empleado"}</span>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}