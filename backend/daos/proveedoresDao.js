const pool = require("../db/pool");

const _fetchContactos = async (conn, id) => {
  const [telefonos] = await conn.query(
    "SELECT telefono FROM telefono_proveedor WHERE id_proveedor = ?", [id]
  );
  const [correos] = await conn.query(
    "SELECT correo FROM correo_proveedor WHERE id_proveedor = ?", [id]
  );
  return {
    telefonos: telefonos.map((t) => t.telefono),
    correos: correos.map((c) => c.correo),
  };
};

exports.findAll = async () => {
  const [proveedores] = await pool.query(
    "SELECT id_proveedor, nombre_proveedor, direccion_proveedor FROM proveedor ORDER BY id_proveedor"
  );
  for (const p of proveedores) {
    Object.assign(p, await _fetchContactos(pool, p.id_proveedor));
  }
  return proveedores;
};

exports.findById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM proveedor WHERE id_proveedor = ?", [id]
  );
  if (!rows[0]) return null;
  Object.assign(rows[0], await _fetchContactos(pool, id));
  return rows[0];
};

exports.insert = async ({ nombre_proveedor, direccion_proveedor, telefonos = [], correos = [] }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      "INSERT INTO proveedor (nombre_proveedor, direccion_proveedor) VALUES (?, ?)",
      [nombre_proveedor, direccion_proveedor ?? null]
    );
    const id = result.insertId;
    for (const telefono of telefonos)
      await conn.query("INSERT INTO telefono_proveedor (id_proveedor, telefono) VALUES (?, ?)", [id, telefono]);
    for (const correo of correos)
      await conn.query("INSERT INTO correo_proveedor (id_proveedor, correo) VALUES (?, ?)", [id, correo]);
    await conn.commit();
    return { id_proveedor: id };
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
};

exports.update = async (id, { nombre_proveedor, direccion_proveedor, telefonos = [], correos = [] }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      "UPDATE proveedor SET nombre_proveedor = ?, direccion_proveedor = ? WHERE id_proveedor = ?",
      [nombre_proveedor, direccion_proveedor ?? null, id]
    );
    if (!result.affectedRows) { await conn.rollback(); return 0; }
    await conn.query("DELETE FROM telefono_proveedor WHERE id_proveedor = ?", [id]);
    await conn.query("DELETE FROM correo_proveedor   WHERE id_proveedor = ?", [id]);
    for (const telefono of telefonos)
      await conn.query("INSERT INTO telefono_proveedor (id_proveedor, telefono) VALUES (?, ?)", [id, telefono]);
    for (const correo of correos)
      await conn.query("INSERT INTO correo_proveedor (id_proveedor, correo) VALUES (?, ?)", [id, correo]);
    await conn.commit();
    return result.affectedRows;
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
};

exports.remove = async (id) => {
  const [result] = await pool.query("DELETE FROM proveedor WHERE id_proveedor = ?", [id]);
  return result.affectedRows;
};