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

// JOIN 3: Líneas de detalle con su venta, producto y empleado
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

// VIEW: Resumen de ventas por categoria
// GET /api/reportes/ventas-por-categoria
router.get("/ventas-por-categoria", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM vista_ventas_por_categoria
      ORDER BY ingresos_totales DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Consulta con GROUP BY, HAVING y agregación: Ventas por empleado
// GET /api/reportes/ventas-por-empleado
router.get("/ventas-por-empleado", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        e.id_empleado,
        e.nombre_empleado,
        e.cargo,
        COUNT(v.id_venta) AS total_ventas,
        COALESCE(SUM(v.total), 0) AS monto_total,
        COALESCE(AVG(v.total), 0) AS monto_promedio,
        COALESCE(MAX(v.total), 0) AS venta_maxima
      FROM empleado e
      LEFT JOIN venta v ON e.id_empleado = v.id_empleado
      GROUP BY e.id_empleado, e.nombre_empleado, e.cargo
      ORDER BY monto_total DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Consulta con GROUP BY: Productos más vendidos
// GET /api/reportes/productos-mas-vendidos
router.get("/productos-mas-vendidos", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre_producto,
        c.nombre_categoria,
        SUM(dv.cantidad) AS unidades_vendidas,
        SUM(dv.subtotal) AS ingresos_totales
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto  = p.id_producto
      JOIN categoria c ON p.id_categoria  = c.id_categoria
      GROUP BY p.id_producto, p.nombre_producto, c.nombre_categoria
      HAVING SUM(dv.cantidad) > 0
      ORDER BY unidades_vendidas DESC
      LIMIT 20
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CTE: Ranking de clientes con estadisticas comparativas
// GET /api/reportes/ranking-clientes
router.get("/ranking-clientes", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      WITH resumen_clientes AS (
        SELECT
          c.id_cliente,
          c.nombre_cliente,
          COUNT(v.id_venta) AS total_compras,
          SUM(v.total) AS monto_total
        FROM cliente c
        JOIN venta v ON c.id_cliente = v.id_cliente
        GROUP BY c.id_cliente, c.nombre_cliente
      )
      SELECT
        id_cliente,
        nombre_cliente,
        total_compras,
        monto_total,
        (SELECT AVG(monto_total) FROM resumen_clientes) AS promedio_general,
        (SELECT MAX(monto_total) FROM resumen_clientes) AS maximo_general,
        (SELECT COUNT(*) FROM resumen_clientes WHERE monto_total > rc.monto_total) + 1 AS ranking,
        ROUND(monto_total / (SELECT AVG(monto_total) FROM resumen_clientes) * 100, 1) AS porcentaje_del_promedio
      FROM resumen_clientes rc
      ORDER BY monto_total DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;