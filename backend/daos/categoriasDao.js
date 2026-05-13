const pool = require("../db/pool");

exports.findAll = async () => {
  const [rows] = await pool.query(
    "SELECT id_categoria, nombre_categoria, descripcion_categoria FROM categoria ORDER BY nombre_categoria"
  );
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM categoria WHERE id_categoria = ?",
    [id]
  );
  return rows[0] ?? null;
};

exports.insert = async ({ nombre_categoria, descripcion_categoria }) => {
  const [result] = await pool.query(
    "INSERT INTO categoria (nombre_categoria, descripcion_categoria) VALUES (?, ?)",
    [nombre_categoria, descripcion_categoria ?? null]
  );
  return { id_categoria: result.insertId };
};

exports.update = async (id, { nombre_categoria, descripcion_categoria }) => {
  const [result] = await pool.query(
    "UPDATE categoria SET nombre_categoria = ?, descripcion_categoria = ? WHERE id_categoria = ?",
    [nombre_categoria, descripcion_categoria ?? null, id]
  );
  return result.affectedRows;
};

exports.remove = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM categoria WHERE id_categoria = ?",
    [id]
  );
  return result.affectedRows;
};