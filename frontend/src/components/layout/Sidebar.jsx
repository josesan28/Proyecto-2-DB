import { NavLink, useNavigate } from "react-router-dom"
import { BarChart3, Home, LogOut, Package2, ShoppingCart, Tags, Truck, UserRound, Users, Store } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useRole } from "../../hooks/useRole"
import { PAGE_ROLES } from "../../permissions"
import { api } from "../../api"
import "./Sidebar.css"

const ALL_LINKS = [
  { to: "/", label: "Inicio", icon: Home, allowed: PAGE_ROLES.home },
  { to: "/productos", label: "Productos", icon: Package2, allowed: PAGE_ROLES.productos },
  { to: "/categorias", label: "Categorías", icon: Tags, allowed: PAGE_ROLES.categorias },
  { to: "/proveedores", label: "Proveedores", icon: Truck, allowed: PAGE_ROLES.proveedores },
  { to: "/clientes", label: "Clientes", icon: Users, allowed: PAGE_ROLES.clientes },
  { to: "/empleados", label: "Empleados", icon: UserRound, allowed: PAGE_ROLES.empleados },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart, allowed: PAGE_ROLES.ventas },
  { to: "/reportes", label: "Reportes", icon: BarChart3, allowed: PAGE_ROLES.reportes },
]

export default function Sidebar() {
  const { empleado, logout } = useAuth()
  const { can } = useRole()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await api.post("/api/auth/logout", {}).catch(() => {})
    logout()
    navigate("/login")
  }

  const links = ALL_LINKS.filter((l) => can(...l.allowed))

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon"><Store /></span>
        <span className="brand-name">Eka</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((l) => (
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
