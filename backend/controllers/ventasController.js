const service = require("../services/ventasService");

const handle = (err, res) =>
  res.status(err.status ?? 500).json({ error: err.message });

exports.getAll = async (req, res) => {
  try { res.json(await service.getAll()); }
  catch (err) { handle(err, res); }
};

exports.getOne = async (req, res) => {
  try { res.json(await service.getOne(req.params.id)); }
  catch (err) { handle(err, res); }
};

exports.create = async (req, res) => {
  const { id_empleado, id_cliente, items } = req.body;

  if (!id_empleado)
    return res.status(400).json({ error: "id_empleado es obligatorio" });
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: "La venta debe incluir al menos un producto" });
  if (items.some((i) => !i.id_producto || !i.cantidad || i.cantidad <= 0))
    return res.status(400).json({ error: "Cada item debe tener id_producto y cantidad > 0" });

  try { res.status(201).json(await service.create({ id_empleado, id_cliente, items })); }
  catch (err) { handle(err, res); }
};

exports.remove = async (req, res) => {
  try { res.json(await service.remove(req.params.id)); }
  catch (err) { handle(err, res); }
};