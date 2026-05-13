const dao = require("../daos/productosDao");

exports.getAll = () => dao.findAll();

exports.getOne = async (id) => {
  const producto = await dao.findById(id);
  if (!producto) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });
  return producto;
};

exports.create = async (data) => {
  const { id_producto } = await dao.insert(data);
  return { id_producto, message: "Producto creado" };
};

exports.update = async (id, data) => {
  const affected = await dao.update(id, data);
  if (!affected) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });
  return { message: "Producto actualizado" };
};

exports.remove = async (id) => {
  const affected = await dao.remove(id);
  if (!affected) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });
  return { message: "Producto eliminado" };
};