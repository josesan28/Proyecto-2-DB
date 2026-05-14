const pool = require("../db/pool");

exports.productosDetalle = async () => {
  const [rows] = await pool.query(`
    SELECT
      p.id_producto, p.nombre_producto, p.precio_venta, p.stock_actual,
      c.nombre_categoria, pr.nombre_proveedor, pr.direccion_proveedor
    FROM producto p
    JOIN categoria c  ON p.id_categoria = c.id_categoria
    JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
    ORDER BY c.nombre_categoria, p.nombre_producto
  `);
  return rows;
};

exports.ventasCompletas = async () => {
  const [rows] = await pool.query(`
    SELECT
      v.id_venta, v.fecha_hora_venta, v.total,
      e.nombre_empleado, e.cargo,
      COALESCE(c.nombre_cliente, 'Consumidor final') AS nombre_cliente
    FROM venta v
    JOIN empleado e     ON v.id_empleado = e.id_empleado
    LEFT JOIN cliente c ON v.id_cliente  = c.id_cliente
    ORDER BY v.fecha_hora_venta DESC
  `);
  return rows;
};

exports.detalleVentas = async () => {
  const [rows] = await pool.query(`
    SELECT
      v.id_venta, v.fecha_hora_venta, e.nombre_empleado,
      p.nombre_producto, c.nombre_categoria,
      dv.cantidad, dv.precio_unitario, dv.subtotal
    FROM detalle_venta dv
    JOIN venta v     ON dv.id_venta    = v.id_venta
    JOIN producto p  ON dv.id_producto = p.id_producto
    JOIN empleado e  ON v.id_empleado  = e.id_empleado
    JOIN categoria c ON p.id_categoria = c.id_categoria
    ORDER BY v.fecha_hora_venta DESC, v.id_venta, p.nombre_producto
  `);
  return rows;
};

exports.clientesConVentas = async () => {
  const [rows] = await pool.query(`
    SELECT id_cliente, nombre_cliente,
           COALESCE(observaciones, 'Sin observaciones') AS observaciones
    FROM cliente
    WHERE id_cliente IN (
      SELECT DISTINCT id_cliente FROM venta WHERE id_cliente IS NOT NULL
    )
    ORDER BY nombre_cliente
  `);
  return rows;
};

exports.empleadosSobrePromedioCargo = async () => {
  const [rows] = await pool.query(`
    SELECT e.nombre_empleado, e.cargo, COUNT(v.id_venta) AS total_ventas
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
      ) AS sub
    )
    ORDER BY total_ventas DESC
  `);
  return rows;
};

exports.ventasPorCategoria = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM vista_ventas_por_categoria ORDER BY ingresos_totales DESC"
  );
  return rows;
};

exports.ventasPorEmpleado = async () => {
  const [rows] = await pool.query(`
    SELECT
      e.id_empleado, e.nombre_empleado, e.cargo,
      COUNT(v.id_venta)                          AS total_ventas,
      ROUND(COALESCE(SUM(v.total),  0), 2)       AS monto_total,
      ROUND(COALESCE(AVG(v.total),  0), 2)       AS monto_promedio,
      ROUND(COALESCE(MAX(v.total),  0), 2)       AS venta_maxima
    FROM empleado e
    LEFT JOIN venta v ON e.id_empleado = v.id_empleado
    GROUP BY e.id_empleado, e.nombre_empleado, e.cargo
    ORDER BY monto_total DESC
  `);
  return rows;
};

exports.productosMasVendidos = async () => {
  const [rows] = await pool.query(`
    SELECT
      p.id_producto, p.nombre_producto, c.nombre_categoria,
      SUM(dv.cantidad)  AS unidades_vendidas,
      SUM(dv.subtotal)  AS ingresos_totales
    FROM detalle_venta dv
    JOIN producto p  ON dv.id_producto  = p.id_producto
    JOIN categoria c ON p.id_categoria  = c.id_categoria
    GROUP BY p.id_producto, p.nombre_producto, c.nombre_categoria
    HAVING SUM(dv.cantidad) > 0
    ORDER BY unidades_vendidas DESC
    LIMIT 20
  `);
  return rows;
};

exports.rankingClientes = async () => {
  const [rows] = await pool.query(`
    WITH resumen_clientes AS (
      SELECT
        c.id_cliente, c.nombre_cliente,
        COUNT(v.id_venta)  AS total_compras,
        SUM(v.total)       AS monto_total
      FROM cliente c
      JOIN venta v ON c.id_cliente = v.id_cliente
      GROUP BY c.id_cliente, c.nombre_cliente
    )
    SELECT
      id_cliente, nombre_cliente, total_compras, monto_total,
      (SELECT COUNT(*) FROM resumen_clientes rc2 WHERE rc2.monto_total > rc.monto_total) + 1 AS ranking
    FROM resumen_clientes rc
    ORDER BY ranking
  `);
  return rows;
};