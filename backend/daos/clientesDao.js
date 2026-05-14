const pool = require("../db/pool");

const _fetchContactos = async (conn, id) => {
  const [telefonos] = await conn.query(
    "SELECT numero FROM telefono_cliente WHERE id_cliente = ?", [id]
  );
  const [correos] = await conn.query(
    "SELECT correo FROM correo_cliente WHERE id_cliente = ?", [id]
  );
  return {
    telefonos: telefonos.map((t) => t.numero),
    correos: correos.map((c) => c.correo),
  };
};

exports.findAll = async () => {
  const [clientes] = await pool.query(
    "SELECT id_cliente, nombre_cliente, observaciones FROM cliente ORDER BY nombre_cliente"
  );
  for (const c of clientes) {
    Object.assign(c, await _fetchContactos(pool, c.id_cliente));
  }
  return clientes;
};

exports.findById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM cliente WHERE id_cliente = ?", [id]
  );
  if (!rows[0]) return null;
  Object.assign(rows[0], await _fetchContactos(pool, id));
  return rows[0];
};

exports.insert = async ({ nombre_cliente, observaciones, telefonos = [], correos = [] }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      "INSERT INTO cliente (nombre_cliente, observaciones) VALUES (?, ?)",
      [nombre_cliente, observaciones ?? null]
    );
    const id = result.insertId;
    for (const numero of telefonos)
      await conn.query("INSERT INTO telefono_cliente (id_cliente, numero) VALUES (?, ?)", [id, numero]);
    for (const correo of correos)
      await conn.query("INSERT INTO correo_cliente (id_cliente, correo) VALUES (?, ?)", [id, correo]);
    await conn.commit();
    return { id_cliente: id };
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
};

exports.update = async (id, { nombre_cliente, observaciones, telefonos = [], correos = [] }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      "UPDATE cliente SET nombre_cliente = ?, observaciones = ? WHERE id_cliente = ?",
      [nombre_cliente, observaciones ?? null, id]
    );
    if (!result.affectedRows) { await conn.rollback(); return 0; }
    await conn.query("DELETE FROM telefono_cliente WHERE id_cliente = ?", [id]);
    await conn.query("DELETE FROM correo_cliente   WHERE id_cliente = ?", [id]);
    for (const numero of telefonos)
      await conn.query("INSERT INTO telefono_cliente (id_cliente, numero) VALUES (?, ?)", [id, numero]);
    for (const correo of correos)
      await conn.query("INSERT INTO correo_cliente (id_cliente, correo) VALUES (?, ?)", [id, correo]);
    await conn.commit();
    return result.affectedRows;
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
};

exports.remove = async (id) => {
  const [result] = await pool.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);
  return result.affectedRows;
};