const service = require("../services/clientesService");

const DB_ERRORS = {
  ER_DUP_ENTRY: [409, "Un correo ingresado ya está en uso"],
};

const handle = (err, res) => {
  const mapped = DB_ERRORS[err.code];
  if (mapped) return res.status(mapped[0]).json({ error: mapped[1] });
  res.status(err.status ?? 500).json({ error: err.message });
};

const hasRequiredName = (value) => typeof value === "string" && value.trim();

exports.getAll = async (req, res) => {
  try { res.json(await service.getAll()); }
  catch (err) { handle(err, res); }
};

exports.getOne = async (req, res) => {
  try { res.json(await service.getOne(req.params.id)); }
  catch (err) { handle(err, res); }
};

exports.create = async (req, res) => {
  if (!hasRequiredName(req.body.nombre_cliente))
    return res.status(400).json({ error: "nombre_cliente es obligatorio" });
  try { res.status(201).json(await service.create(req.body)); }
  catch (err) { handle(err, res); }
};

exports.update = async (req, res) => {
  if (!hasRequiredName(req.body.nombre_cliente))
    return res.status(400).json({ error: "nombre_cliente es obligatorio" });
  try { res.json(await service.update(req.params.id, req.body)); }
  catch (err) { handle(err, res); }
};

exports.remove = async (req, res) => {
  try { res.json(await service.remove(req.params.id)); }
  catch (err) { handle(err, res); }
};

exports.upsertPorProcedimiento = async (req, res) => {
  if (!hasRequiredName(req.body.nombre_cliente))
    return res.status(400).json({ error: "nombre_cliente es obligatorio" });
  try {
    const result = await service.upsertPorProcedimiento(req.body);
    res.status(req.body.id_cliente ? 200 : 201).json(result);
  }
  catch (err) { handle(err, res); }
};
