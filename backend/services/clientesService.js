const dao = require("../daos/clientesDao");

exports.getAll = () => dao.findAll();

exports.getOne = async (id) => {
  const cliente = await dao.findById(id);
  if (!cliente) throw Object.assign(new Error("Cliente no encontrado"), { status: 404 });
  return cliente;
};

exports.create = async (data) => {
  const { id_cliente } = await dao.insert(data);
  return { id_cliente, message: "Cliente creado" };
};

exports.update = async (id, data) => {
  const affected = await dao.update(id, data);
  if (!affected) throw Object.assign(new Error("Cliente no encontrado"), { status: 404 });
  return { message: "Cliente actualizado" };
};

exports.remove = async (id) => {
  const affected = await dao.remove(id);
  if (!affected) throw Object.assign(new Error("Cliente no encontrado"), { status: 404 });
  return { message: "Cliente eliminado" };
};