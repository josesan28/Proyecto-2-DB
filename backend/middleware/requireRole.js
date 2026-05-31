const normalizeCargo = (cargo = "") =>
  cargo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

module.exports = function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.empleado)
      return res.status(401).json({ error: "Token requerido" });

    const cargo = normalizeCargo(req.empleado.cargo);

    const ok = allowed.includes(cargo);

    if (!ok)
      return res.status(403).json({ error: "No tienes permiso para esta acción" });

    next();
  };
};
