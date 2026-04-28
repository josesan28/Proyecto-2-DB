const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET /api/empleados
router.get("/", async (req, res) => {
  try {
    const [empleados] = await pool.query(`
      SELECT id_empleado, nombre_empleado, username, cargo, fecha_contratacion, estado
      FROM empleado
      ORDER BY nombre_empleado
    `);

    for (const e of empleados) {
      const [telefonos] = await pool.query(
        "SELECT telefono FROM telefono_empleado WHERE id_empleado = ?",
        [e.id_empleado]
      );
      const [correos] = await pool.query(
        "SELECT correo FROM correo_empleado WHERE id_empleado = ?",
        [e.id_empleado]
      );
      e.telefonos = telefonos.map(t => t.telefono);
      e.correos = correos.map(c => c.correo);
    }

    res.json(empleados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/empleados/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_empleado, nombre_empleado, username, cargo, fecha_contratacion, estado FROM empleado WHERE id_empleado = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Empleado no encontrado" });

    const empleado = rows[0];
    const [telefonos] = await pool.query(
      "SELECT telefono FROM telefono_empleado WHERE id_empleado = ?",
      [empleado.id_empleado]
    );
    const [correos] = await pool.query(
      "SELECT correo FROM correo_empleado WHERE id_empleado = ?",
      [empleado.id_empleado]
    );
    empleado.telefonos = telefonos.map(t => t.telefono);
    empleado.correos = correos.map(c => c.correo);

    res.json(empleado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/empleados
router.post("/", async (req, res) => {
  const { nombre_empleado, username, cargo, fecha_contratacion,
          estado = "activo", telefonos = [], correos = [] } = req.body;

  if (!nombre_empleado) return res.status(400).json({ error: "nombre_empleado es obligatorio" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(`
      INSERT INTO empleado (nombre_empleado, username, cargo, fecha_contratacion, estado)
      VALUES (?, ?, ?, ?, ?)
    `, [nombre_empleado, username ?? null, cargo ?? null,
        fecha_contratacion ?? null, estado]);

    const id_empleado = result.insertId;

    for (const telefono of telefonos) {
      await conn.query(
        "INSERT INTO telefono_empleado (id_empleado, telefono) VALUES (?, ?)",
        [id_empleado, telefono]
      );
    }
    for (const correo of correos) {
      await conn.query(
        "INSERT INTO correo_empleado (id_empleado, correo) VALUES (?, ?)",
        [id_empleado, correo]
      );
    }

    await conn.commit();
    res.status(201).json({ id_empleado, message: "Empleado creado" });
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El username o correo ya está en uso" });
    }
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// PUT /api/empleados/:id
router.put("/:id", async (req, res) => {
  const { nombre_empleado, username, cargo, fecha_contratacion,
          estado = "activo", telefonos = [], correos = [] } = req.body;

  if (!nombre_empleado) return res.status(400).json({ error: "nombre_empleado es obligatorio" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(`
      UPDATE empleado
      SET nombre_empleado   = ?,
          username          = ?,
          cargo             = ?,
          fecha_contratacion = ?,
          estado            = ?
      WHERE id_empleado = ?
    `, [nombre_empleado, username ?? null, cargo ?? null,
        fecha_contratacion ?? null, estado, req.params.id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    await conn.query("DELETE FROM telefono_empleado WHERE id_empleado = ?", [req.params.id]);
    await conn.query("DELETE FROM correo_empleado   WHERE id_empleado = ?", [req.params.id]);

    for (const telefono of telefonos) {
      await conn.query(
        "INSERT INTO telefono_empleado (id_empleado, telefono) VALUES (?, ?)",
        [req.params.id, telefono]
      );
    }
    for (const correo of correos) {
      await conn.query(
        "INSERT INTO correo_empleado (id_empleado, correo) VALUES (?, ?)",
        [req.params.id, correo]
      );
    }

    await conn.commit();
    res.json({ message: "Empleado actualizado" });
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El username o correo ya está en uso" });
    }
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// DELETE /api/empleados/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM empleado WHERE id_empleado = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Empleado no encontrado" });
    res.json({ message: "Empleado eliminado" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ error: "No se puede eliminar: el empleado tiene ventas registradas" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;