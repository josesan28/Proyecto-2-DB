const ROLES = {
  admin:     ["admin"],
  gerente:   ["admin", "gerente"],
  vendedor:  ["admin", "gerente", "vendedor"],
  bodeguero: ["admin", "gerente", "bodeguero"],
  auditor:   ["admin", "gerente", "auditor"],
};

const normalizeCargo = (cargo = "") =>
  cargo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

module.exports = function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.empleado)
      return res.status(401).json({ error: "Token requerido" });

    const cargo = normalizeCargo(req.empleado.cargo);

    const ok = allowed.some((role) => {
      const group = ROLES[role];
      return group ? group.includes(cargo) : cargo === role;
    });

    if (!ok)
      return res.status(403).json({ error: "No tienes permiso para esta acción" });

    next();
  };
};