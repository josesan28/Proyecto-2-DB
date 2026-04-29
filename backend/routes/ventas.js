const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/ventas - Listar todas las ventas con información del cliente y empleado
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_hora_venta,
        v.total,
        e.nombre_empleado,
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

// GET /api/ventas/:id - Detalle de una venta con información del cliente, empleado y productos vendidos
router.get("/:id", async (req, res) => {
  try {
    const [ventas] = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_hora_venta,
        v.total,
        v.id_empleado,
        e.nombre_empleado,
        v.id_cliente,
        COALESCE(c.nombre_cliente, 'Consumidor final') AS nombre_cliente
      FROM venta v
      JOIN empleado e     ON v.id_empleado = e.id_empleado
      LEFT JOIN cliente c ON v.id_cliente  = c.id_cliente
      WHERE v.id_venta = ?
    `, [req.params.id]);

    if (ventas.length === 0) return res.status(404).json({ error: "Venta no encontrada" });

    const [detalle] = await pool.query(`
      SELECT
        dv.id_detalle_venta,
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal,
        p.id_producto,
        p.nombre_producto
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `, [req.params.id]);

    res.json({ ...ventas[0], detalle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ventas - Crear venta
router.post("/", async (req, res) => {
  const { id_empleado, id_cliente, items } = req.body;

  if (!id_empleado) {
    return res.status(400).json({ error: "id_empleado es obligatorio" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "La venta debe incluir al menos un producto" });
  }
  for (const item of items) {
    if (!item.id_producto || !item.cantidad || item.cantidad <= 0) {
      return res.status(400).json({ error: "Cada item debe tener id_producto y cantidad > 0" });
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Verificar que el empleado existe y está activo
    const [emp] = await conn.query(
      "SELECT id_empleado FROM empleado WHERE id_empleado = ? AND estado = 'activo'",
      [id_empleado]
    );
    if (emp.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: "Empleado no encontrado o inactivo" });
    }

    // Verificar stock y calcular totales para cada item
    const lineas = [];
    let total = 0;

    for (const item of items) {
      const [productos] = await conn.query(
        "SELECT id_producto, nombre_producto, precio_venta, stock_actual FROM producto WHERE id_producto = ?",
        [item.id_producto]
      );

      if (productos.length === 0) {
        await conn.rollback();
        return res.status(404).json({ error: `Producto ${item.id_producto} no encontrado` });
      }

      const prod = productos[0];

      if (prod.stock_actual < item.cantidad) {
        await conn.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para "${prod.nombre_producto}". Disponible: ${prod.stock_actual}`
        });
      }

      const subtotal = parseFloat((prod.precio_venta * item.cantidad).toFixed(2));
      total += subtotal;
      lineas.push({ ...prod, cantidad: item.cantidad, subtotal });
    }

    total = parseFloat(total.toFixed(2));

    // Insertar venta
    const [ventaResult] = await conn.query(
      "INSERT INTO venta (id_empleado, id_cliente, total) VALUES (?, ?, ?)",
      [id_empleado, id_cliente ?? null, total]
    );
    const id_venta = ventaResult.insertId;

    // Insertar detalle y restar stock
    for (const linea of lineas) {
      await conn.query(`
        INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `, [id_venta, linea.id_producto, linea.cantidad, linea.precio_venta, linea.subtotal]);

      await conn.query(
        "UPDATE producto SET stock_actual = stock_actual - ? WHERE id_producto = ?",
        [linea.cantidad, linea.id_producto]
      );
    }

    await conn.commit();
    res.status(201).json({ id_venta, total, message: "Venta registrada correctamente" });

  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: "Error al registrar la venta: " + err.message });
  } finally {
    conn.release();
  }
});

// DELETE /api/ventas/:id - Borrar venta y restaurar stock
router.delete("/:id", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Verificar que existe
    const [ventas] = await conn.query(
      "SELECT id_venta FROM venta WHERE id_venta = ?",
      [req.params.id]
    );
    if (ventas.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    // Obtener líneas para restaurar stock
    const [detalle] = await conn.query(
      "SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = ?",
      [req.params.id]
    );

    // Restaurar stock de cada producto
    for (const linea of detalle) {
      await conn.query(
        "UPDATE producto SET stock_actual = stock_actual + ? WHERE id_producto = ?",
        [linea.cantidad, linea.id_producto]
      );
    }

    // Eliminar venta, los detalles también se eliminan
    await conn.query("DELETE FROM venta WHERE id_venta = ?", [req.params.id]);

    await conn.commit();
    res.json({ message: "Venta anulada y stock restaurado" });

  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: "Error al anular la venta: " + err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;