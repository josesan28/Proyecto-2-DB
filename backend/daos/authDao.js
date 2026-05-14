const pool = require("../db/pool");

exports.findByUsername = async (username) => {
  const [rows] = await pool.query(
    `SELECT id_empleado, nombre_empleado, username, hash_contrasena, cargo, estado
     FROM empleado WHERE username = ?`,
    [username]
  );
  return rows[0] ?? null;
};