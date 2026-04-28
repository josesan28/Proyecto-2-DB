const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/clientes - Listar todos los clientes con sus teléfonos y correos
router.get("/", async (req, res) => {
  try {
    const [clientes] = await pool.query(`
      SELECT id_cliente, nombre_cliente, observaciones
      FROM cliente
      ORDER BY nombre_cliente
    `);

    for (const c of clientes) {
      const [telefonos] = await pool.query(
        "SELECT numero FROM telefono_cliente WHERE id_cliente = ?",
        [c.id_cliente]
      );
      const [correos] = await pool.query(
        "SELECT correo FROM correo_cliente WHERE id_cliente = ?",
        [c.id_cliente]
      );
      c.telefonos = telefonos.map(t => t.numero);
      c.correos = correos.map(c => c.correo);
    }

    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clientes/:id - Obtener un cliente por ID con sus teléfonos y correos
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM cliente WHERE id_cliente = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Cliente no encontrado" });

    const cliente = rows[0];
    const [telefonos] = await pool.query(
      "SELECT numero FROM telefono_cliente WHERE id_cliente = ?",
      [cliente.id_cliente]
    );
    const [correos] = await pool.query(
      "SELECT correo FROM correo_cliente WHERE id_cliente = ?",
      [cliente.id_cliente]
    );
    cliente.telefonos = telefonos.map(t => t.numero);
    cliente.correos = correos.map(c => c.correo);

    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clientes - Crear un nuevo cliente con teléfonos y correos opcionales
router.post("/", async (req, res) => {
  const { nombre_cliente, observaciones, telefonos = [], correos = [] } = req.body;

  if (!nombre_cliente) return res.status(400).json({ error: "nombre_cliente es obligatorio" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO cliente (nombre_cliente, observaciones) VALUES (?, ?)",
      [nombre_cliente, observaciones ?? null]
    );
    const id_cliente = result.insertId;

    for (const numero of telefonos) {
      await conn.query(
        "INSERT INTO telefono_cliente (id_cliente, numero) VALUES (?, ?)",
        [id_cliente, numero]
      );
    }
    for (const correo of correos) {
      await conn.query(
        "INSERT INTO correo_cliente (id_cliente, correo) VALUES (?, ?)",
        [id_cliente, correo]
      );
    }

    await conn.commit();
    res.status(201).json({ id_cliente, message: "Cliente creado" });
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

// PUT /api/clientes/:id - Actualizar un cliente existente y reemplazar sus teléfonos y correos
router.put("/:id", async (req, res) => {
  const { nombre_cliente, observaciones, telefonos = [], correos = [] } = req.body;

  if (!nombre_cliente) return res.status(400).json({ error: "nombre_cliente es obligatorio" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "UPDATE cliente SET nombre_cliente = ?, observaciones = ? WHERE id_cliente = ?",
      [nombre_cliente, observaciones ?? null, req.params.id]
    );
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await conn.query("DELETE FROM telefono_cliente WHERE id_cliente = ?", [req.params.id]);
    await conn.query("DELETE FROM correo_cliente   WHERE id_cliente = ?", [req.params.id]);

    for (const numero of telefonos) {
      await conn.query(
        "INSERT INTO telefono_cliente (id_cliente, numero) VALUES (?, ?)",
        [req.params.id, numero]
      );
    }
    for (const correo of correos) {
      await conn.query(
        "INSERT INTO correo_cliente (id_cliente, correo) VALUES (?, ?)",
        [req.params.id, correo]
      );
    }

    await conn.commit();
    res.json({ message: "Cliente actualizado" });
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

// DELETE /api/clientes/:id - Eliminar un cliente por ID
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM cliente WHERE id_cliente = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;