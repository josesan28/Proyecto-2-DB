const service = require("../services/categoriasService");

const DB_ERRORS = {
  ER_DUP_ENTRY: [409, "Esa categoría ya existe"],
  ER_ROW_IS_REFERENCED_2: [409, "No se puede eliminar: tiene productos asociados"],
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
  const { nombre_categoria, descripcion_categoria } = req.body;
  if (!nombre_categoria)
    return res.status(400).json({ error: "nombre_categoria es obligatorio" });
  try { res.status(201).json(await service.create({ nombre_categoria, descripcion_categoria })); }
  catch (err) { handle(err, res); }
};

exports.update = async (req, res) => {
  const { nombre_categoria, descripcion_categoria } = req.body;
  if (!nombre_categoria)
    return res.status(400).json({ error: "nombre_categoria es obligatorio" });
  try { res.json(await service.update(req.params.id, { nombre_categoria, descripcion_categoria })); }
  catch (err) { handle(err, res); }
};

exports.remove = async (req, res) => {
  try { res.json(await service.remove(req.params.id)); }
  catch (err) { handle(err, res); }
};