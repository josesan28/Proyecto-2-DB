const EMPLOYEE_CARGOS = ["admin", "gerente", "vendedor", "bodeguero", "auditor"];
const ALL_ROLES = [...EMPLOYEE_CARGOS];

module.exports = {
  EMPLOYEE_CARGOS,
  VIEW_PRODUCTS: ALL_ROLES,
  VIEW_CATALOGS: ALL_ROLES,
  VIEW_CLIENTS: ["admin", "gerente", "vendedor", "auditor"],
  VIEW_EMPLOYEES: ["admin", "gerente", "vendedor", "auditor"],
  VIEW_SALES: ["admin", "gerente", "vendedor", "auditor"],
  VIEW_REPORTS: ["admin", "gerente", "auditor"],

  MANAGE_CATALOGS: ["admin", "gerente", "bodeguero"],
  MANAGE_CLIENTS: ["admin", "gerente", "vendedor"],
  MANAGE_SALES: ["admin", "gerente", "vendedor"],
  MANAGE_SALES_DELETE: ["admin", "gerente"],

  EMPLOYEES_ADMIN: ["admin"],
  EMPLOYEES_DELETE: ["admin"],
};