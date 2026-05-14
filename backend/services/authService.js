const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dao = require("../daos/authDao");

exports.login = async ({ username, contrasena }) => {
  const empleado = await dao.findByUsername(username);
  if (!empleado)
    throw Object.assign(new Error("Credenciales incorrectas"), { status: 401 });

  if (empleado.estado === "inactivo")
    throw Object.assign(new Error("Empleado inactivo, acceso denegado"), { status: 403 });

  const match = await bcrypt.compare(contrasena, empleado.hash_contrasena);
  if (!match)
    throw Object.assign(new Error("Credenciales incorrectas"), { status: 401 });

  const token = jwt.sign(
    {
      id_empleado: empleado.id_empleado,
      username: empleado.username,
      nombre_empleado: empleado.nombre_empleado,
      cargo: empleado.cargo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { token, nombre_empleado: empleado.nombre_empleado, cargo: empleado.cargo };
};