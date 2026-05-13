const dao = require("../daos/categoriasDao");

exports.getAll = () => dao.findAll();

exports.getOne = async (id) => {
  const categoria = await dao.findById(id);
  if (!categoria) throw Object.assign(new Error("Categoría no encontrada"), { status: 404 });
  return categoria;
};

exports.create = async (data) => {
  const { id_categoria } = await dao.insert(data);
  return { id_categoria, message: "Categoría creada" };
};

exports.update = async (id, data) => {
  const affected = await dao.update(id, data);
  if (!affected) throw Object.assign(new Error("Categoría no encontrada"), { status: 404 });
  return { message: "Categoría actualizada" };
};

exports.remove = async (id) => {
  const affected = await dao.remove(id);
  if (!affected) throw Object.assign(new Error("Categoría no encontrada"), { status: 404 });
  return { message: "Categoría eliminada" };
};