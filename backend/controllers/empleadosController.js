const service = require("../services/empleadosService");

const DB_ERRORS = {
  ER_DUP_ENTRY: [409, "El username o correo ya está en uso"],
  ER_ROW_IS_REFERENCED_2: [409, "No se puede eliminar: el empleado tiene ventas registradas"],
};

const handle = (err, res) => {
  const mapped = DB_ERRORS[err.code];
  if (mapped) return res.status(mapped[0]).json({ error: mapped[1] });
  res.status(err.status ?? 500).json({ error: err.message });
};

exports.getAll = async (req, res) => {
  try { res.json(await service.getAll()); }
  catch (err) { handle(err, res); }
};

exports.getOne = async (req, res) => {
  try { res.json(await service.getOne(req.params.id)); }
  catch (err) { handle(err, res); }
};

exports.create = async (req, res) => {
  if (!req.body.nombre_empleado)
    return res.status(400).json({ error: "nombre_empleado es obligatorio" });
  try { res.status(201).json(await service.create(req.body)); }
  catch (err) { handle(err, res); }
};

exports.update = async (req, res) => {
  if (!req.body.nombre_empleado)
    return res.status(400).json({ error: "nombre_empleado es obligatorio" });
  try { res.json(await service.update(req.params.id, req.body)); }
  catch (err) { handle(err, res); }
};

exports.updatePassword = async (req, res) => {
  const { contrasena } = req.body;
  if (!contrasena || contrasena.length < 4)
    return res.status(400).json({ error: "La contraseña debe tener al menos 4 caracteres" });
  try { res.json(await service.updatePassword(req.params.id, contrasena)); }
  catch (err) { handle(err, res); }
};

exports.remove = async (req, res) => {
  try { res.json(await service.remove(req.params.id)); }
  catch (err) { handle(err, res); }
};