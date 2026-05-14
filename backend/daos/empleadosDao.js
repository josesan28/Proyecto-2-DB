const pool = require("../db/pool");

const _fetchContactos = async (conn, id) => {
  const [telefonos] = await conn.query(
    "SELECT telefono FROM telefono_empleado WHERE id_empleado = ?", [id]
  );
  const [correos] = await conn.query(
    "SELECT correo FROM correo_empleado WHERE id_empleado = ?", [id]
  );
  return {
    telefonos: telefonos.map((t) => t.telefono),
    correos: correos.map((c) => c.correo),
  };
};

exports.findAll = async () => {
  const [empleados] = await pool.query(`
    SELECT id_empleado, nombre_empleado, username, cargo, fecha_contratacion, estado
    FROM empleado ORDER BY nombre_empleado
  `);
  for (const e of empleados) {
    Object.assign(e, await _fetchContactos(pool, e.id_empleado));
  }
  return empleados;
};

exports.findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id_empleado, nombre_empleado, username, cargo, fecha_contratacion, estado
     FROM empleado WHERE id_empleado = ?`,
    [id]
  );
  if (!rows[0]) return null;
  Object.assign(rows[0], await _fetchContactos(pool, id));
  return rows[0];
};

exports.findByUsername = async (username) => {
  const [rows] = await pool.query(
    `SELECT id_empleado, nombre_empleado, username, hash_contrasena, cargo, estado
     FROM empleado WHERE username = ?`,
    [username]
  );
  return rows[0] ?? null;
};

exports.insert = async ({
  nombre_empleado, username, cargo, fecha_contratacion,
  estado = "activo", telefonos = [], correos = [], hashContrasena = null,
}) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO empleado
         (nombre_empleado, username, cargo, fecha_contratacion, estado, hash_contrasena)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_empleado, username ?? null, cargo ?? null,
       fecha_contratacion ?? null, estado, hashContrasena]
    );
    const id = result.insertId;
    for (const telefono of telefonos)
      await conn.query("INSERT INTO telefono_empleado (id_empleado, telefono) VALUES (?, ?)", [id, telefono]);
    for (const correo of correos)
      await conn.query("INSERT INTO correo_empleado (id_empleado, correo) VALUES (?, ?)", [id, correo]);
    await conn.commit();
    return { id_empleado: id };
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
};

exports.update = async (id, {
  nombre_empleado, username, cargo, fecha_contratacion,
  estado = "activo", telefonos = [], correos = [], hashContrasena,
}) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const setParts = [
      "nombre_empleado = ?", "username = ?", "cargo = ?",
      "fecha_contratacion = ?", "estado = ?",
    ];
    const values = [nombre_empleado, username ?? null, cargo ?? null,
                    fecha_contratacion ?? null, estado];
    if (hashContrasena) { setParts.push("hash_contrasena = ?"); values.push(hashContrasena); }
    values.push(id);

    const [result] = await conn.query(
      `UPDATE empleado SET ${setParts.join(", ")} WHERE id_empleado = ?`, values
    );
    if (!result.affectedRows) { await conn.rollback(); return 0; }
    await conn.query("DELETE FROM telefono_empleado WHERE id_empleado = ?", [id]);
    await conn.query("DELETE FROM correo_empleado   WHERE id_empleado = ?", [id]);
    for (const telefono of telefonos)
      await conn.query("INSERT INTO telefono_empleado (id_empleado, telefono) VALUES (?, ?)", [id, telefono]);
    for (const correo of correos)
      await conn.query("INSERT INTO correo_empleado (id_empleado, correo) VALUES (?, ?)", [id, correo]);
    await conn.commit();
    return result.affectedRows;
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
};

exports.updatePassword = async (id, hashContrasena) => {
  const [result] = await pool.query(
    "UPDATE empleado SET hash_contrasena = ? WHERE id_empleado = ?",
    [hashContrasena, id]
  );
  return result.affectedRows;
};

exports.remove = async (id) => {
  const [result] = await pool.query("DELETE FROM empleado WHERE id_empleado = ?", [id]);
  return result.affectedRows;
};