import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const links = [
  { to: '/',             label: 'Inicio',       icon: '⊞' },
  { to: '/productos',    label: 'Productos',    icon: '▣' },
  { to: '/categorias',   label: 'Categorías',   icon: '◈' },
  { to: '/proveedores',  label: 'Proveedores',  icon: '◎' },
  { to: '/clientes',     label: 'Clientes',     icon: '◉' },
  { to: '/empleados',    label: 'Empleados',    icon: '◐' },
  { to: '/ventas',       label: 'Ventas',       icon: '◆' },
  { to: '/reportes',     label: 'Reportes',     icon: '◇' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">Tienda</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            <span className="nav-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}