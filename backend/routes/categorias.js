const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_categoria, nombre_categoria, descripcion_categoria FROM categoria ORDER BY nombre_categoria"
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM categoria WHERE id_categoria = ?", [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  const { nombre_categoria, descripcion_categoria } = req.body;
  if (!nombre_categoria) return res.status(400).json({ error: "nombre_categoria es obligatorio" });
  try {
    const [result] = await pool.query(
      "INSERT INTO categoria (nombre_categoria, descripcion_categoria) VALUES (?, ?)",
      [nombre_categoria, descripcion_categoria ?? null]
    );
    res.status(201).json({ id_categoria: result.insertId, message: "Categoría creada" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Esa categoría ya existe" });
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { nombre_categoria, descripcion_categoria } = req.body;
  if (!nombre_categoria) return res.status(400).json({ error: "nombre_categoria es obligatorio" });
  try {
    const [result] = await pool.query(
      "UPDATE categoria SET nombre_categoria = ?, descripcion_categoria = ? WHERE id_categoria = ?",
      [nombre_categoria, descripcion_categoria ?? null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ message: "Categoría actualizada" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Esa categoría ya existe" });
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM categoria WHERE id_categoria = ?", [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ message: "Categoría eliminada" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2")
      return res.status(409).json({ error: "No se puede eliminar: tiene productos asociados" });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;