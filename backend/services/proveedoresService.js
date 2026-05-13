const dao = require("../daos/proveedoresDao");

exports.getAll = () => dao.findAll();

exports.getOne = async (id) => {
  const proveedor = await dao.findById(id);
  if (!proveedor) throw Object.assign(new Error("Proveedor no encontrado"), { status: 404 });
  return proveedor;
};

exports.create = async (data) => {
  const { id_proveedor } = await dao.insert(data);
  return { id_proveedor, message: "Proveedor creado" };
};

exports.update = async (id, data) => {
  const affected = await dao.update(id, data);
  if (!affected) throw Object.assign(new Error("Proveedor no encontrado"), { status: 404 });
  return { message: "Proveedor actualizado" };
};

exports.remove = async (id) => {
  const affected = await dao.remove(id);
  if (!affected) throw Object.assign(new Error("Proveedor no encontrado"), { status: 404 });
  return { message: "Proveedor eliminado" };
};