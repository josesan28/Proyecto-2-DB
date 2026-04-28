const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/proveedores - Obtener la lista de proveedores con sus teléfonos y correos
router.get("/", async (req, res) => {
  try {
    const [proveedores] = await pool.query(`
      SELECT id_proveedor, nombre_proveedor, direccion_proveedor
      FROM proveedor
      ORDER BY id_proveedor
    `);

    for (const p of proveedores) {
      const [telefonos] = await pool.query(
        "SELECT telefono FROM telefono_proveedor WHERE id_proveedor = ?",
        [p.id_proveedor]
      );
      const [correos] = await pool.query(
        "SELECT correo FROM correo_proveedor WHERE id_proveedor = ?",
        [p.id_proveedor]
      );
      p.telefonos = telefonos.map(t => t.telefono);
      p.correos   = correos.map(c => c.correo);
    }

    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/proveedores/:id - Obtener un proveedor específico con sus teléfonos y correos
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM proveedor WHERE id_proveedor = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Proveedor no encontrado" });

    const proveedor = rows[0];
    const [telefonos] = await pool.query(
      "SELECT telefono FROM telefono_proveedor WHERE id_proveedor = ?",
      [proveedor.id_proveedor]
    );
    const [correos] = await pool.query(
      "SELECT correo FROM correo_proveedor WHERE id_proveedor = ?",
      [proveedor.id_proveedor]
    );
    proveedor.telefonos = telefonos.map(t => t.telefono);
    proveedor.correos   = correos.map(c => c.correo);

    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/proveedores - Crear un nuevo proveedor con sus teléfonos y correos
router.post("/", async (req, res) => {
  const { nombre_proveedor, direccion_proveedor, telefonos = [], correos = [] } = req.body;

  if (!nombre_proveedor) return res.status(400).json({ error: "nombre_proveedor es obligatorio" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO proveedor (nombre_proveedor, direccion_proveedor) VALUES (?, ?)",
      [nombre_proveedor, direccion_proveedor ?? null]
    );
    const id_proveedor = result.insertId;

    for (const telefono of telefonos) {
      await conn.query(
        "INSERT INTO telefono_proveedor (id_proveedor, telefono) VALUES (?, ?)",
        [id_proveedor, telefono]
      );
    }
    for (const correo of correos) {
      await conn.query(
        "INSERT INTO correo_proveedor (id_proveedor, correo) VALUES (?, ?)",
        [id_proveedor, correo]
      );
    }

    await conn.commit();
    res.status(201).json({ id_proveedor, message: "Proveedor creado" });
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Un correo ingresado ya está en uso" });
    }
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// PUT /api/proveedores/:id - Actualizar un proveedor existente con sus teléfonos y correos
router.put("/:id", async (req, res) => {
  const { nombre_proveedor, direccion_proveedor, telefonos = [], correos = [] } = req.body;

  if (!nombre_proveedor) return res.status(400).json({ error: "nombre_proveedor es obligatorio" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "UPDATE proveedor SET nombre_proveedor = ?, direccion_proveedor = ? WHERE id_proveedor = ?",
      [nombre_proveedor, direccion_proveedor ?? null, req.params.id]
    );
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    await conn.query("DELETE FROM telefono_proveedor WHERE id_proveedor = ?", [req.params.id]);
    await conn.query("DELETE FROM correo_proveedor   WHERE id_proveedor = ?", [req.params.id]);

    for (const telefono of telefonos) {
      await conn.query(
        "INSERT INTO telefono_proveedor (id_proveedor, telefono) VALUES (?, ?)",
        [req.params.id, telefono]
      );
    }
    for (const correo of correos) {
      await conn.query(
        "INSERT INTO correo_proveedor (id_proveedor, correo) VALUES (?, ?)",
        [req.params.id, correo]
      );
    }

    await conn.commit();
    res.json({ message: "Proveedor actualizado" });
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Un correo ingresado ya está en uso" });
    }
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// DELETE /api/proveedores/:id - Eliminar un proveedor, solo si no tiene productos asociados
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM proveedor WHERE id_proveedor = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json({ message: "Proveedor eliminado" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ error: "No se puede eliminar: el proveedor tiene productos asociados" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;