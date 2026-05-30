const { Producto, Categoria, Proveedor } = require("../models");

const _include = [
  { model: Categoria, attributes: ["nombre_categoria"] },
  { model: Proveedor, attributes: ["nombre_proveedor"] },
];

exports.findAll = () =>
  Producto.findAll({ include: _include, order: [["id_producto", "ASC"]] });

exports.findById = (id) =>
  Producto.findByPk(id, { include: _include }).then((r) => r ?? null);

exports.insert = async ({
  id_categoria, id_proveedor, nombre_producto, descripcion_producto,
  precio_compra, precio_venta, stock_actual = 0,
}) => {
  const prod = await Producto.create({
    id_categoria, id_proveedor, nombre_producto, descripcion_producto,
    precio_compra, precio_venta, stock_actual,
  });
  return { id_producto: prod.id_producto };
};

exports.update = async (id, {
  id_categoria, id_proveedor, nombre_producto, descripcion_producto,
  precio_compra, precio_venta, stock_actual = 0,
}) => {
  const [affected] = await Producto.update(
    { id_categoria, id_proveedor, nombre_producto, descripcion_producto,
      precio_compra, precio_venta, stock_actual },
    { where: { id_producto: id } }
  );
  return affected;
};

exports.remove = async (id) =>
  Producto.destroy({ where: { id_producto: id } });