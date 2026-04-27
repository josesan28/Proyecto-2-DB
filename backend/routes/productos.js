const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/productos - Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_compra,
        p.precio_venta,
        p.stock_actual,
        c.nombre_categoria,
        pr.nombre_proveedor
      FROM producto p
      JOIN categoria c  ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
      ORDER BY p.id_producto
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/productos/:id - Obtener solo un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.*,
        c.nombre_categoria,
        pr.nombre_proveedor
      FROM producto p
      JOIN categoria c  ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
      WHERE p.id_producto = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/productos - Crear un nuevo producto
router.post("/", async (req, res) => {
  const { id_categoria, id_proveedor, nombre_producto, descripcion_producto,
          precio_compra, precio_venta, stock_actual } = req.body;

  if (!id_categoria || !id_proveedor || !nombre_producto || !descripcion_producto
      || !precio_compra || !precio_venta) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO producto
        (id_categoria, id_proveedor, nombre_producto, descripcion_producto,
         precio_compra, precio_venta, stock_actual)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id_categoria, id_proveedor, nombre_producto, descripcion_producto,
        precio_compra, precio_venta, stock_actual ?? 0]);

    res.status(201).json({ id_producto: result.insertId, message: "Producto creado" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Ya existe un producto con esa descripción" });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/productos/:id - Actualizar un producto existente
router.put("/:id", async (req, res) => {
  const { id_categoria, id_proveedor, nombre_producto, descripcion_producto,
          precio_compra, precio_venta, stock_actual } = req.body;

  if (!id_categoria || !id_proveedor || !nombre_producto || !descripcion_producto
      || !precio_compra || !precio_venta) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const [result] = await pool.query(`
      UPDATE producto
      SET id_categoria       = ?,
          id_proveedor       = ?,
          nombre_producto    = ?,
          descripcion_producto = ?,
          precio_compra      = ?,
          precio_venta       = ?,
          stock_actual       = ?
      WHERE id_producto = ?
    `, [id_categoria, id_proveedor, nombre_producto, descripcion_producto,
        precio_compra, precio_venta, stock_actual ?? 0, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto actualizado" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Ya existe un producto con esa descripción" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/productos/:id - Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM producto WHERE id_producto = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ error: "No se puede eliminar: el producto tiene ventas asociadas" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;