const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// JOIN 1: Productos con categoría y proveedor
// GET /api/reportes/productos-detalle
router.get("/productos-detalle", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre_producto,
        p.precio_venta,
        p.stock_actual,
        c.nombre_categoria,
        pr.nombre_proveedor,
        pr.direccion_proveedor
      FROM producto p
      JOIN categoria c ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
      ORDER BY c.nombre_categoria, p.nombre_producto
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// JOIN 2: Ventas con empleado, cliente y total
// GET /api/reportes/ventas-completas
router.get("/ventas-completas", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_hora_venta,
        v.total,
        e.nombre_empleado,
        e.cargo,
        COALESCE(c.nombre_cliente, 'Consumidor final') AS nombre_cliente
      FROM venta v
      JOIN empleado e        ON v.id_empleado = e.id_empleado
      LEFT JOIN cliente c    ON v.id_cliente  = c.id_cliente
      ORDER BY v.fecha_hora_venta DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── JOIN 3: Líneas de detalle con su venta, producto y empleado
// GET /api/reportes/detalle-ventas
router.get("/detalle-ventas", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_hora_venta,
        e.nombre_empleado,
        p.nombre_producto,
        c.nombre_categoria,
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal
      FROM detalle_venta dv
      JOIN venta v ON dv.id_venta = v.id_venta
      JOIN producto p ON dv.id_producto = p.id_producto
      JOIN empleado  e ON v.id_empleado  = e.id_empleado
      JOIN categoria c ON p.id_categoria = c.id_categoria
      ORDER BY v.fecha_hora_venta DESC, v.id_venta, p.nombre_producto
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subconsulta 1: Clientes con al menos 1 venta
// GET /api/reportes/clientes-con-ventas
router.get("/clientes-con-ventas", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id_cliente, nombre_cliente, observaciones
      FROM cliente
      WHERE id_cliente IN (
        SELECT DISTINCT id_cliente
        FROM venta
        WHERE id_cliente IS NOT NULL
      )
      ORDER BY nombre_cliente
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subconsulta 2 correlacionada: Empleados con mas ventas que el promedio de su cargo
// GET /api/reportes/empleados-sobre-promedio-cargo
router.get("/empleados-sobre-promedio-cargo", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        e.nombre_empleado,
        e.cargo,
        COUNT(v.id_venta) AS total_ventas
      FROM empleado e
      LEFT JOIN venta v ON e.id_empleado = v.id_empleado
      GROUP BY e.id_empleado, e.nombre_empleado, e.cargo
      HAVING COUNT(v.id_venta) > (
        SELECT AVG(ventas_por_empleado)
        FROM (
          SELECT COUNT(*) AS ventas_por_empleado
          FROM venta v2
          JOIN empleado e2 ON v2.id_empleado = e2.id_empleado
          WHERE e2.cargo = e.cargo
          GROUP BY e2.id_empleado
        ) AS subconsulta
      )
      ORDER BY total_ventas DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;