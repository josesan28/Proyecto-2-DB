const ALL_ROLES = ["admin", "gerente", "vendedor", "bodeguero", "auditor"];

export const PAGE_ROLES = {
  home: ALL_ROLES,
  productos: ALL_ROLES,
  categorias: ["admin", "gerente", "bodeguero", "auditor"],
  proveedores: ["admin", "gerente", "bodeguero", "auditor"],
  clientes: ["admin", "gerente", "vendedor", "auditor"],
  empleados: ["admin", "gerente", "auditor"],
  ventas: ["admin", "gerente", "vendedor", "auditor"],
  reportes: ["admin", "gerente", "auditor"],
};
