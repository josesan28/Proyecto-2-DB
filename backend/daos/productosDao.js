const pool = require("../db/pool");

exports.findAll = async () => {
  const [rows] = await pool.query(`
    SELECT
      p.id_producto, p.nombre_producto, p.descripcion_producto,
      p.precio_compra, p.precio_venta, p.stock_actual,
      p.id_categoria, p.id_proveedor,
      c.nombre_categoria, pr.nombre_proveedor
    FROM producto p
    JOIN categoria c  ON p.id_categoria = c.id_categoria
    JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
    ORDER BY p.id_producto
  `);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.query(`
    SELECT p.*, c.nombre_categoria, pr.nombre_proveedor
    FROM producto p
    JOIN categoria c  ON p.id_categoria = c.id_categoria
    JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
    WHERE p.id_producto = ?
  `, [id]);
  return rows[0] ?? null;
};

exports.insert = async ({
  id_categoria, id_proveedor, nombre_producto, descripcion_producto,
  precio_compra, precio_venta, stock_actual = 0,
}) => {
  const [result] = await pool.query(`
    INSERT INTO producto
      (id_categoria, id_proveedor, nombre_producto, descripcion_producto,
       precio_compra, precio_venta, stock_actual)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id_categoria, id_proveedor, nombre_producto, descripcion_producto,
      precio_compra, precio_venta, stock_actual]);
  return { id_producto: result.insertId };
};

exports.update = async (id, {
  id_categoria, id_proveedor, nombre_producto, descripcion_producto,
  precio_compra, precio_venta, stock_actual = 0,
}) => {
  const [result] = await pool.query(`
    UPDATE producto SET
      id_categoria = ?, id_proveedor = ?, nombre_producto = ?,
      descripcion_producto = ?, precio_compra = ?, precio_venta = ?, stock_actual = ?
    WHERE id_producto = ?
  `, [id_categoria, id_proveedor, nombre_producto, descripcion_producto,
      precio_compra, precio_venta, stock_actual, id]);
  return result.affectedRows;
};

exports.remove = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM producto WHERE id_producto = ?", [id]
  );
  return result.affectedRows;
};