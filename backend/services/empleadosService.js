const bcrypt = require("bcrypt");
const dao = require("../daos/empleadosDao");

const _hashIfPresent = async (plain) =>
  plain ? bcrypt.hash(plain, 10) : null;

exports.getAll = () => dao.findAll();

exports.getOne = async (id) => {
  const empleado = await dao.findById(id);
  if (!empleado) throw Object.assign(new Error("Empleado no encontrado"), { status: 404 });
  return empleado;
};

exports.create = async (data) => {
  const hashContrasena = await _hashIfPresent(data.contrasena);
  const { id_empleado } = await dao.insert({ ...data, hashContrasena });
  return { id_empleado, message: "Empleado creado" };
};

exports.update = async (id, data) => {
  const hashContrasena = await _hashIfPresent(data.contrasena);
  const affected = await dao.update(id, { ...data, hashContrasena });
  if (!affected) throw Object.assign(new Error("Empleado no encontrado"), { status: 404 });
  return { message: "Empleado actualizado" };
};

exports.updatePassword = async (id, contrasena) => {
  const hash = await bcrypt.hash(contrasena, 10);
  const affected = await dao.updatePassword(id, hash);
  if (!affected) throw Object.assign(new Error("Empleado no encontrado"), { status: 404 });
  return { message: "Contraseña actualizada" };
};

exports.remove = async (id) => {
  const affected = await dao.remove(id);
  if (!affected) throw Object.assign(new Error("Empleado no encontrado"), { status: 404 });
  return { message: "Empleado eliminado" };
};