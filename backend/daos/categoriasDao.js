const { Categoria } = require("../models");

exports.findAll = () =>
  Categoria.findAll({ order: [["nombre_categoria", "ASC"]] });

exports.findById = (id) =>
  Categoria.findByPk(id).then((r) => r ?? null);

exports.insert = async ({ nombre_categoria, descripcion_categoria }) => {
  const cat = await Categoria.create({ nombre_categoria, descripcion_categoria: descripcion_categoria ?? null });
  return { id_categoria: cat.id_categoria };
};

exports.update = async (id, { nombre_categoria, descripcion_categoria }) => {
  const [affected] = await Categoria.update(
    { nombre_categoria, descripcion_categoria: descripcion_categoria ?? null },
    { where: { id_categoria: id } }
  );
  return affected;
};

exports.remove = async (id) => {
  const affected = await Categoria.destroy({ where: { id_categoria: id } });
  return affected;
};