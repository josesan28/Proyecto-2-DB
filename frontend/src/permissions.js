export const EMPLOYEE_CARGOS = ["admin", "gerente", "vendedor", "bodeguero", "auditor"];
const ALL_ROLES = [...EMPLOYEE_CARGOS];

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
