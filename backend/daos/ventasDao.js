const pool = require("../db/pool");

exports.findAll = async () => {
  const [rows] = await pool.query(`
    SELECT
      v.id_venta, v.fecha_hora_venta, v.total,
      e.nombre_empleado,
      COALESCE(c.nombre_cliente, 'Consumidor final') AS nombre_cliente
    FROM venta v
    JOIN empleado e     ON v.id_empleado = e.id_empleado
    LEFT JOIN cliente c ON v.id_cliente  = c.id_cliente
    ORDER BY v.fecha_hora_venta DESC
  `);
  return rows;
};

exports.findById = async (id) => {
  const [ventas] = await pool.query(`
    SELECT
      v.id_venta, v.fecha_hora_venta, v.total,
      v.id_empleado, e.nombre_empleado,
      v.id_cliente,
      COALESCE(c.nombre_cliente, 'Consumidor final') AS nombre_cliente
    FROM venta v
    JOIN empleado e     ON v.id_empleado = e.id_empleado
    LEFT JOIN cliente c ON v.id_cliente  = c.id_cliente
    WHERE v.id_venta = ?
  `, [id]);
  if (!ventas[0]) return null;

  const [detalle] = await pool.query(`
    SELECT
      dv.id_detalle_venta, dv.cantidad, dv.precio_unitario, dv.subtotal,
      p.id_producto, p.nombre_producto
    FROM detalle_venta dv
    JOIN producto p ON dv.id_producto = p.id_producto
    WHERE dv.id_venta = ?
  `, [id]);

  return { ...ventas[0], detalle };
};

exports.findProductoForSale = async (conn, id_producto) => {
  const [rows] = await conn.query(
    "SELECT id_producto, nombre_producto, precio_venta, stock_actual FROM producto WHERE id_producto = ?",
    [id_producto]
  );
  return rows[0] ?? null;
};

exports.findEmpleadoActivo = async (conn, id_empleado) => {
  const [rows] = await conn.query(
    "SELECT id_empleado FROM empleado WHERE id_empleado = ? AND estado = 'activo'",
    [id_empleado]
  );
  return rows[0] ?? null;
};

exports.insertVenta = async (conn, { id_empleado, id_cliente, total }) => {
  const [result] = await conn.query(
    "INSERT INTO venta (id_empleado, id_cliente, total) VALUES (?, ?, ?)",
    [id_empleado, id_cliente ?? null, total]
  );
  return result.insertId;
};

exports.insertDetalle = async (conn, { id_venta, id_producto, cantidad, precio_unitario, subtotal }) => {
  await conn.query(
    "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
    [id_venta, id_producto, cantidad, precio_unitario, subtotal]
  );
};

exports.decrementStock = async (conn, id_producto, cantidad) => {
  await conn.query(
    "UPDATE producto SET stock_actual = stock_actual - ? WHERE id_producto = ?",
    [cantidad, id_producto]
  );
};

exports.findDetalleByVenta = async (conn, id_venta) => {
  const [rows] = await conn.query(
    "SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = ?",
    [id_venta]
  );
  return rows;
};

exports.deleteVenta = async (conn, id_venta) => {
  await conn.query("DELETE FROM venta WHERE id_venta = ?", [id_venta]);
};

exports.incrementStock = async (conn, id_producto, cantidad) => {
  await conn.query(
    "UPDATE producto SET stock_actual = stock_actual + ? WHERE id_producto = ?",
    [cantidad, id_producto]
  );
};

exports.getPool = () => pool;