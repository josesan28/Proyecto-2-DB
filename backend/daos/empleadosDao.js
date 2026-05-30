const bcrypt = require("bcrypt");
const { Empleado, TelefonoEmpleado, CorreoEmpleado } = require("../models");

const _include = [
  { model: TelefonoEmpleado, as: "telefonos", attributes: ["telefono"] },
  { model: CorreoEmpleado, as: "correos", attributes: ["correo"] },
];

const _format = (e) => ({
  ...e.toJSON(),
  telefonos: e.telefonos.map((t) => t.telefono),
  correos:   e.correos.map((c) => c.correo),
});

exports.findAll = async () => {
  const rows = await Empleado.findAll({
    attributes: { exclude: ["hash_contrasena"] },
    include: _include,
    order: [["nombre_empleado", "ASC"]],
  });
  return rows.map(_format);
};

exports.findById = async (id) => {
  const e = await Empleado.findByPk(id, {
    attributes: { exclude: ["hash_contrasena"] },
    include: _include,
  });
  return e ? _format(e) : null;
};

exports.findByUsername = async (username) => {
  const e = await Empleado.findOne({ where: { username } });
  return e ? e.toJSON() : null;
};

exports.insert = async ({
  nombre_empleado, username, cargo, fecha_contratacion,
  estado = "activo", telefonos = [], correos = [], hashContrasena = null,
}) => {
  const { sequelize } = require("../models");
  return sequelize.transaction(async (t) => {
    const emp = await Empleado.create(
      { nombre_empleado, username: username ?? null, cargo: cargo ?? null,
        fecha_contratacion: fecha_contratacion ?? null, estado,
        hash_contrasena: hashContrasena },
      { transaction: t }
    );
    const id = emp.id_empleado;
    await TelefonoEmpleado.bulkCreate(
      telefonos.map((telefono) => ({ id_empleado: id, telefono })),
      { transaction: t }
    );
    await CorreoEmpleado.bulkCreate(
      correos.map((correo) => ({ id_empleado: id, correo })),
      { transaction: t }
    );
    return { id_empleado: id };
  });
};

exports.update = async (id, {
  nombre_empleado, username, cargo, fecha_contratacion,
  estado = "activo", telefonos = [], correos = [], hashContrasena,
}) => {
  const { sequelize } = require("../models");
  return sequelize.transaction(async (t) => {
    const fields = { nombre_empleado, username: username ?? null,
                     cargo: cargo ?? null, fecha_contratacion: fecha_contratacion ?? null, estado };
    if (hashContrasena) fields.hash_contrasena = hashContrasena;

    const [affected] = await Empleado.update(fields, {
      where: { id_empleado: id }, transaction: t,
    });
    if (!affected) return 0;

    await TelefonoEmpleado.destroy({ where: { id_empleado: id }, transaction: t });
    await CorreoEmpleado.destroy({   where: { id_empleado: id }, transaction: t });
    await TelefonoEmpleado.bulkCreate(
      telefonos.map((telefono) => ({ id_empleado: id, telefono })),
      { transaction: t }
    );
    await CorreoEmpleado.bulkCreate(
      correos.map((correo) => ({ id_empleado: id, correo })),
      { transaction: t }
    );
    return affected;
  });
};

exports.updatePassword = async (id, hashContrasena) => {
  const [affected] = await Empleado.update(
    { hash_contrasena: hashContrasena },
    { where: { id_empleado: id } }
  );
  return affected;
};

exports.remove = async (id) =>
  Empleado.destroy({ where: { id_empleado: id } });