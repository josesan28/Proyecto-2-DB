const service = require("../services/productosService");

const DB_ERRORS = {
  ER_DUP_ENTRY: [409, "Ya existe un producto con esa descripción"],
  ER_ROW_IS_REFERENCED_2: [409, "No se puede eliminar: el producto tiene ventas asociadas"],
};

const handle = (err, res) => {
  const mapped = DB_ERRORS[err.code];
  if (mapped) return res.status(mapped[0]).json({ error: mapped[1] });
  res.status(err.status ?? 500).json({ error: err.message });
};

const REQUIRED = ["id_categoria", "id_proveedor", "nombre_producto",
                  "descripcion_producto", "precio_compra", "precio_venta"];
const hasMissingRequired = (body) =>
  REQUIRED.some((field) => {
    const value = body[field];
    if (value === undefined || value === null) return true;
    return typeof value === "string" ? !value.trim() : false;
  });

exports.getAll = async (req, res) => {
  try { res.json(await service.getAll()); }
  catch (err) { handle(err, res); }
};

exports.getOne = async (req, res) => {
  try { res.json(await service.getOne(req.params.id)); }
  catch (err) { handle(err, res); }
};

exports.create = async (req, res) => {
  if (hasMissingRequired(req.body))
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  try { res.status(201).json(await service.create(req.body)); }
  catch (err) { handle(err, res); }
};

exports.update = async (req, res) => {
  if (hasMissingRequired(req.body))
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  try { res.json(await service.update(req.params.id, req.body)); }
  catch (err) { handle(err, res); }
};

exports.remove = async (req, res) => {
  try { res.json(await service.remove(req.params.id)); }
  catch (err) { handle(err, res); }
};
